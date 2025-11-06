// USE CommonJS syntax to match the Vercel Node.js runtime environment.
const { google } = require('googleapis');

// Define the types within this file to make the function self-contained.
/**
 * @typedef {object} CartItem
 * @property {number} id
 * @property {string} name
 * @property {string} description
 * @property {number} price
 * @property {number} quantity
 */

/**
 * @typedef {object} Address
 * @property {string} tower
 * @property {string} floor
 * @property {string} flat
 * @property {string} [name]
 * @property {string} [phone]
 */

/**
 * @typedef {object} Order
 * @property {string} id
 * @property {CartItem[]} items
 * @property {number} total
 * @property {Address} address
 * @property {string} timestamp
 */

/**
 * Handles the incoming order submission request.
 * @param req The Vercel request object, containing the order in the body.
 * @param res The Vercel response object, used to send a response back to the client.
 */
module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  try {
    /** @type {Order} */
    const order = req.body;

    // 1. Authenticate with Google Sheets
    let auth;
    try {
        auth = new google.auth.GoogleAuth({
          credentials: {
            client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
            private_key: (process.env.GOOGLE_SHEETS_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
          },
          scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });
    } catch (authError) {
        console.error('ERROR: Google Authentication failed.', authError);
        throw new Error('Google authentication failed. Check server credentials in Vercel environment variables.');
    }

    const sheets = google.sheets({ version: 'v4', auth });

    // 2. Prepare the data for the sheet
    const rows = order.items.map(item => [
      order.id,
      order.timestamp,
      order.address.name || '', // Use empty string if name is not provided
      order.address.phone || '', // Use empty string if phone is not provided
      `${order.address.tower} - ${order.address.floor}${order.address.flat}`,
      item.name,
      item.quantity,
      item.price,
      item.quantity * item.price,
      order.total,
    ]);

    // 3. Append data to the sheet
    try {
        await sheets.spreadsheets.values.append({
          spreadsheetId: process.env.SPREADSHEET_ID,
          range: `${process.env.GOOGLE_SHEETS_SHEET_NAME}!A1`, // Append after the last row of the specified sheet
          valueInputOption: 'USER_ENTERED',
          requestBody: {
            values: rows,
          },
        });
    } catch (sheetError) {
        console.error('ERROR: Failed to append data to Google Sheet.', sheetError);
        console.error('Attempted to write to Sheet ID:', process.env.SPREADSHEET_ID);
        console.error('Attempted to write to Sheet Name:', process.env.GOOGLE_SHEETS_SHEET_NAME);
        throw new Error('Could not write to the spreadsheet. Check Sheet ID, Sheet Name, and that the service account has Editor permissions.');
    }


    return res.status(200).json({ success: true, message: 'Order placed successfully!' });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    // This is the final catch-all that sends the response to the client
    console.error('ERROR: Top-level handler failed.', { errorMessage: errorMessage });
    return res.status(500).json({ success: false, message: `Failed to record order: ${errorMessage}` });
  }
};

// FIX: Changed CommonJS `require` to ES Modules `import` to resolve TypeScript error.
import { google } from 'googleapis';
import type { VercelRequest, VercelResponse } from '@vercel/node';

// Define the types within this file to make the function self-contained.
interface CartItem {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
}

interface Address {
  tower: string;
  floor: string;
  flat: string;
  name?: string;
  phone?: string;
}

interface Order {
  id: string;
  items: CartItem[];
  total: number;
  address: Address;
  timestamp: string;
}

// FIX: Changed CommonJS `module.exports` to ES Modules `export default` to resolve TypeScript error.
export default async (req: VercelRequest, res: VercelResponse) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  try {
    const order: Order = req.body;

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

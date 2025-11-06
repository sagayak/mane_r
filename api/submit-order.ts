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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  try {
    const order: Order = req.body;

    // 1. Authenticate with Google Sheets
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
        private_key: (process.env.GOOGLE_SHEETS_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // 2. Prepare the data for the sheet
    // Each item in the order becomes a separate row
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
    
    // Add headers if the sheet is empty (optional, good practice)
    // For simplicity, we'll assume headers are already in the sheet:
    // Order ID, Timestamp, Name, Phone, Address, Item, Quantity, Price, Subtotal, Order Total

    // 3. Append data to the sheet
    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.SPREADSHEET_ID,
      range: `${process.env.GOOGLE_SHEETS_SHEET_NAME}!A1`, // Append after the last row of the specified sheet
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: rows,
      },
    });

    return res.status(200).json({ success: true, message: 'Order placed successfully!' });

  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return res.status(500).json({ success: false, message: `Failed to record order. Error: ${errorMessage}` });
  }
}

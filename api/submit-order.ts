import type { VercelRequest, VercelResponse } from '@vercel/node';
import * as jose from 'jose';
import type { CartItem, Address } from '../types';

// These values are securely read from Vercel Environment Variables
const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
const SHEET_NAME = 'Orders';
const CLIENT_EMAIL = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
const PRIVATE_KEY = process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n'); 
const TOKEN_URI = 'https://oauth2.googleapis.com/token';
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

/**
 * Generates a Google Cloud access token using a service account JWT.
 */
async function getAccessToken(): Promise<string> {
  if (!CLIENT_EMAIL || !PRIVATE_KEY) {
    throw new Error('Google Sheets API credentials are not configured in environment variables.');
  }
  
  const alg = 'RS256';
  const importedPrivateKey = await jose.importPKCS8(PRIVATE_KEY, alg);
  
  const jwt = await new jose.SignJWT({ scope: SCOPES.join(' ') })
    .setProtectedHeader({ alg })
    .setIssuer(CLIENT_EMAIL)
    .setAudience(TOKEN_URI)
    .setExpirationTime('1h')
    .setIssuedAt()
    .sign(importedPrivateKey);

  const response = await fetch(TOKEN_URI, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(`Failed to get access token: ${data.error_description || 'Unknown error'}`);
  }
  return data.access_token;
}

/**
 * The main serverless function handler for submitting an order.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  try {
    if (!SPREADSHEET_ID) {
      throw new Error('SPREADSHEET_ID is not configured in environment variables.');
    }
    
    const { cart, address, total } = req.body as { cart: CartItem[], address: Address, total: number };

    if (!cart || !address || total === undefined || cart.length === 0) {
        return res.status(400).json({ message: 'Missing or invalid order data.' });
    }

    const accessToken = await getAccessToken();
    const range = `${SHEET_NAME}!A1`;
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${range}:append?valueInputOption=USER_ENTERED`;
    
    const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    const fullAddress = `Tower ${address.tower}, Floor ${address.floor}, Flat ${address.flat}`;
    const itemsString = cart.map(item => `${item.name} (x${item.quantity})`).join(', ');

    const values = [[timestamp, fullAddress, itemsString, total]];
    
    const sheetsResponse = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ values }),
    });

    const data = await sheetsResponse.json();
    
    if (!sheetsResponse.ok) {
      console.error('Google Sheets API Error:', data);
      throw new Error(data.error?.message || 'Failed to write to Google Sheet.');
    }

    return res.status(200).json({ message: 'Order submitted successfully!' });

  } catch (error: any) {
    console.error('Error in serverless function:', error);
    return res.status(500).json({ message: error.message || 'An internal server error occurred.' });
  }
}

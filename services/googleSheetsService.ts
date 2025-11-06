
import type { Order } from '../types';

/**
 * WARNING: This is a simulation for a frontend-only application.
 * In a real-world scenario, you should NEVER expose credentials like a private key on the client side.
 * This logic must be moved to a secure backend environment (e.g., a Vercel/Netlify function, a Node.js server)
 * which would then use the credentials to communicate with the Google Sheets API.
 * 
 * This function simulates sending an order to a backend that writes to Google Sheets.
 */
export const submitOrder = async (order: Order): Promise<{ success: boolean; message: string }> => {
  console.log("--- SIMULATING ORDER SUBMISSION TO GOOGLE SHEETS ---");
  
  const orderRows = order.items.map(item => [
    order.id,
    order.timestamp,
    `${order.address.tower}-${order.address.floor}-${order.address.flat}`,
    order.address.name,
    order.address.phone,
    item.name,
    item.quantity,
    item.price,
    item.quantity * item.price
  ]);
  
  console.log("Order ID:", order.id);
  console.log("Timestamp:", order.timestamp);
  console.log("Customer:", `${order.address.name} (${order.address.phone})`);
  console.log("Address:", `${order.address.tower}-${order.address.floor}-${order.address.flat}`);
  console.log("Total: ₹", order.total);
  console.log("Data that would be sent to the sheet (with headers):");
  console.table(orderRows, ["Order ID", "Timestamp", "Address", "Name", "Phone", "Item", "Qty", "Price", "Subtotal"]);

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  console.log("--- SIMULATION COMPLETE ---");

  // In a real application, you would handle potential errors from your backend/Google Sheets API.
  // For this simulation, we will always return success.
  return { success: true, message: "Order placed successfully!" };
};

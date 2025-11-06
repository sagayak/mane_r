import type { Order } from '../types';

/**
 * Submits an order to the secure backend serverless function.
 */
export const submitOrder = async (order: Order): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await fetch('/api/submit-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(order),
    });

    const result = await response.json();

    if (!response.ok) {
      // Use the error message from the backend if available, otherwise a generic one.
      throw new Error(result.message || 'An error occurred while submitting the order.');
    }

    return { success: true, message: result.message };
  } catch (error) {
    console.error("Error submitting order:", error);
    // Ensure error is a string
    const message = error instanceof Error ? error.message : String(error);
    return { success: false, message: message };
  }
};

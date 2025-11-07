import { CartItem, Address } from '../types';

export async function appendOrder(cart: CartItem[], address: Address, total: number): Promise<void> {
  try {
    const response = await fetch('/api/submit-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ cart, address, total }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to submit order.');
    }
  } catch (error) {
    console.error('Error in appendOrder:', error);
    // Re-throw the error so it can be caught by the calling component
    throw error;
  }
}

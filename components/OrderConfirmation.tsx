
import React from 'react';

interface OrderConfirmationProps {
  onNewOrder: () => void;
}

const OrderConfirmation: React.FC<OrderConfirmationProps> = ({ onNewOrder }) => {
  return (
    <div className="text-center p-8 bg-white rounded-lg shadow-lg">
      <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
        <svg className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Order Placed Successfully!</h2>
      <p className="text-gray-600 mb-8">
        Thank you for your order. We've received it and will start preparing it right away.
      </p>
      <button
        onClick={onNewOrder}
        className="bg-orange-500 text-white font-bold py-3 px-8 rounded-lg hover:bg-orange-600 transition-colors"
      >
        Place Another Order
      </button>
    </div>
  );
};

export default OrderConfirmation;

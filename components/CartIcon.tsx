
import React from 'react';
import { CartIcon as ShoppingCartIcon } from './icons';

interface CartIconProps {
  itemCount: number;
  totalPrice: number;
  onClick: () => void;
}

const CartIcon: React.FC<CartIconProps> = ({ itemCount, totalPrice, onClick }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto p-4 z-20">
      <button
        onClick={onClick}
        className="w-full bg-orange-600 text-white rounded-lg shadow-lg flex items-center justify-between p-4 transform hover:scale-105 transition-transform"
      >
        <div className="flex items-center">
          <div className="relative">
            <ShoppingCartIcon className="w-6 h-6" />
            <span className="absolute -top-2 -right-2 bg-white text-orange-600 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {itemCount}
            </span>
          </div>
          <span className="ml-4 font-semibold text-lg">View Cart</span>
        </div>
        <span className="font-bold text-lg">₹{totalPrice.toFixed(2)}</span>
      </button>
    </div>
  );
};

export default CartIcon;

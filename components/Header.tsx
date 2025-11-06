import React from 'react';
import { ShoppingCartIcon } from './icons/ShoppingCartIcon';

interface HeaderProps {
  cartItemCount: number;
  onCartClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ cartItemCount, onCartClick }) => {
  return (
    <header className="bg-white shadow-md sticky top-0 z-10">
      <div className="container mx-auto max-w-4xl flex justify-between items-center p-4">
        <h1 className="text-2xl font-bold text-orange-600">ಮನೆ Rotti</h1>
        <button
          onClick={onCartClick}
          className="relative text-gray-700 hover:text-orange-600 transition-colors"
          aria-label="View Cart"
        >
          <ShoppingCartIcon />
          {cartItemCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
              {cartItemCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};

export default Header;
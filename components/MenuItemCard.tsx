import React from 'react';
import type { MenuItem } from '../types';
import { PlusIcon } from './icons/PlusIcon';

interface MenuItemCardProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem) => void;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({ item, onAddToCart }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105 flex">
      <img className="w-32 h-32 object-cover" src={item.imageUrl} alt={item.name} />
      <div className="p-4 flex flex-col justify-between flex-grow">
        <div>
          <h3 className="text-xl font-bold text-gray-900">{item.name}</h3>
          <p className="text-gray-600 mt-1 text-sm">{item.description}</p>
        </div>
        <div className="flex justify-between items-center mt-2">
            <p className="text-lg font-semibold text-orange-600">₹{item.price.toFixed(2)}</p>
            <button
              onClick={() => onAddToCart(item)}
              className="bg-orange-500 text-white rounded-full p-2 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
              aria-label={`Add ${item.name} to cart`}
            >
              <PlusIcon />
            </button>
        </div>
      </div>
    </div>
  );
};

export default MenuItemCard;

import React from 'react';
import MenuItemCard from './MenuItemCard';
import type { MenuItem } from '../types';

interface MenuProps {
  menuItems: MenuItem[];
  onAddToCart: (item: MenuItem) => void;
}

const Menu: React.FC<MenuProps> = ({ menuItems, onAddToCart }) => {
  return (
    <div>
      <h2 className="text-3xl font-extrabold text-gray-900 mb-6">Today's Menu</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {menuItems.map(item => (
          <MenuItemCard key={item.id} item={item} onAddToCart={onAddToCart} />
        ))}
      </div>
    </div>
  );
};

export default Menu;

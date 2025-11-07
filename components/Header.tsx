
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm p-4 sticky top-0 z-10">
      <h1 className="text-2xl font-bold text-center text-orange-600">MR Cloud Kitchen</h1>
      <p className="text-center text-gray-500 text-sm">Delicious Homemade Meals, Delivered.</p>
    </header>
  );
};

export default Header;

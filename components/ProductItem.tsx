
import React from 'react';
import { Product } from '../types';
import { PlusIcon, MinusIcon } from './icons';

interface ProductItemProps {
  product: Product;
  quantity: number;
  onAddToCart: () => void;
  onUpdateQuantity: (quantity: number) => void;
}

const QuantityControl: React.FC<{
  quantity: number;
  onUpdateQuantity: (quantity: number) => void;
}> = ({ quantity, onUpdateQuantity }) => (
  <div className="flex items-center justify-center space-x-3">
    <button
      onClick={() => onUpdateQuantity(quantity - 1)}
      className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center hover:bg-orange-200 transition-colors"
      aria-label="Decrease quantity"
    >
      <MinusIcon className="w-5 h-5" />
    </button>
    <span className="text-lg font-bold w-8 text-center">{quantity}</span>
    <button
      onClick={() => onUpdateQuantity(quantity + 1)}
      className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center hover:bg-orange-200 transition-colors"
      aria-label="Increase quantity"
    >
      <PlusIcon className="w-5 h-5" />
    </button>
  </div>
);

const AddToCartButton: React.FC<{ onAddToCart: () => void }> = ({ onAddToCart }) => (
  <button
    onClick={onAddToCart}
    className="px-4 py-2 bg-orange-500 text-white font-semibold rounded-full hover:bg-orange-600 transition-colors flex items-center justify-center space-x-2"
  >
    <PlusIcon className="w-5 h-5" />
    <span>Add</span>
  </button>
);

const ProductItem: React.FC<ProductItemProps> = ({ product, quantity, onAddToCart, onUpdateQuantity }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 flex items-center justify-between">
      <div className="flex-1">
        <h3 className="text-lg font-semibold">{product.name}</h3>
        <p className="text-gray-500 text-sm">{product.description}</p>
        <p className="text-orange-600 font-bold mt-1">₹{product.price}</p>
      </div>
      <div className="flex-shrink-0 ml-4">
        {quantity > 0 ? (
          <QuantityControl quantity={quantity} onUpdateQuantity={onUpdateQuantity} />
        ) : (
          <AddToCartButton onAddToCart={onAddToCart} />
        )}
      </div>
    </div>
  );
};

export default ProductItem;


import React from 'react';
import { Product, CartItem } from '../types';
import ProductItem from './ProductItem';

interface ProductListProps {
  products: Product[];
  cart: CartItem[];
  onAddToCart: (product: Product) => void;
  onUpdateQuantity: (productId: number, quantity: number) => void;
}

const ProductList: React.FC<ProductListProps> = ({ products, cart, onAddToCart, onUpdateQuantity }) => {
  return (
    <div className="space-y-4">
      {products.map(product => {
        const cartItem = cart.find(item => item.id === product.id);
        return (
          <ProductItem
            key={product.id}
            product={product}
            quantity={cartItem ? cartItem.quantity : 0}
            onAddToCart={() => onAddToCart(product)}
            onUpdateQuantity={(quantity) => onUpdateQuantity(product.id, quantity)}
          />
        );
      })}
    </div>
  );
};

export default ProductList;

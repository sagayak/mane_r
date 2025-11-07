
import React, { useState, useMemo } from 'react';
import { Product, CartItem, Address } from './types';
import { MENU_ITEMS } from './constants';
import { appendOrder } from './services/googleSheetsService';
import Header from './components/Header';
import ProductList from './components/ProductList';
import CartIcon from './components/CartIcon';
import CartView from './components/CartView';

const App: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [orderStatus, setOrderStatus] = useState<'idle' | 'placing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleAddToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      setCart(prevCart => prevCart.filter(item => item.id !== productId));
    } else {
      setCart(prevCart =>
        prevCart.map(item =>
          item.id === productId ? { ...item, quantity } : item
        )
      );
    }
  };
  
  const { totalItems, totalPrice } = useMemo(() => {
    return cart.reduce(
      (acc, item) => {
        acc.totalItems += item.quantity;
        acc.totalPrice += item.price * item.quantity;
        return acc;
      },
      { totalItems: 0, totalPrice: 0 }
    );
  }, [cart]);

  const handleConfirmOrder = async (address: Address) => {
    setOrderStatus('placing');
    try {
      await appendOrder(cart, address, totalPrice);
      setOrderStatus('success');
    } catch (error) {
      console.error('Order submission failed:', error);
      setErrorMessage(error instanceof Error ? error.message : 'An unknown error occurred.');
      setOrderStatus('error');
    }
  };

  const handlePlaceAnotherOrder = () => {
    setCart([]);
    setIsCartOpen(false);
    setOrderStatus('idle');
    setErrorMessage('');
  };

  return (
    <div className="font-sans antialiased text-gray-800">
      <div className="container mx-auto max-w-lg min-h-screen bg-white shadow-lg relative pb-28">
        <Header />
        <main className="p-4">
          <ProductList
            products={MENU_ITEMS}
            cart={cart}
            onAddToCart={handleAddToCart}
            onUpdateQuantity={handleUpdateQuantity}
          />
        </main>
        
        {cart.length > 0 && (
          <CartIcon 
            itemCount={totalItems} 
            totalPrice={totalPrice}
            onClick={() => setIsCartOpen(true)} 
          />
        )}
        
        {isCartOpen && (
          <CartView
            cart={cart}
            totalPrice={totalPrice}
            onClose={() => setIsCartOpen(false)}
            onUpdateQuantity={handleUpdateQuantity}
            onConfirmOrder={handleConfirmOrder}
            orderStatus={orderStatus}
            errorMessage={errorMessage}
            onPlaceAnotherOrder={handlePlaceAnotherOrder}
          />
        )}
      </div>
    </div>
  );
};

export default App;


import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import Menu from './components/Menu';
import CartView from './components/CartView';
import OrderConfirmation from './components/OrderConfirmation';
import FloatingCartButton from './components/FloatingCartButton';
import { submitOrder } from './services/googleSheetsService';
import type { CartItem, MenuItem, Address, Order } from './types';
import { MENU_ITEMS } from './constants';

type View = 'menu' | 'cart' | 'confirmation';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('menu');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cartItemCount = useMemo(() => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }, [cart]);
  
  const cartTotal = useMemo(() => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [cart]);

  const handleAddToCart = (item: MenuItem) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (itemId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveFromCart(itemId);
    } else {
      setCart(prevCart =>
        prevCart.map(item =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const handleRemoveFromCart = (itemId: number) => {
    setCart(prevCart => prevCart.filter(item => item.id !== itemId));
  };
  
  const handleSubmitOrder = async (address: Address) => {
    setIsLoading(true);
    setError(null);
    const order: Order = {
      id: new Date().toISOString() + '-' + Math.random().toString(36).substring(2, 9),
      items: cart,
      total: cartTotal,
      address,
      timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
    };

    try {
      const result = await submitOrder(order);
      if (result.success) {
        setCart([]);
        setCurrentView('confirmation');
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderView = () => {
    switch (currentView) {
      case 'cart':
        return (
          <CartView
            cartItems={cart}
            onUpdateQuantity={handleUpdateQuantity}
            onSubmitOrder={handleSubmitOrder}
            onBackToMenu={() => setCurrentView('menu')}
            isLoading={isLoading}
            error={error}
          />
        );
      case 'confirmation':
        return <OrderConfirmation onNewOrder={() => setCurrentView('menu')} />;
      case 'menu':
      default:
        return <Menu menuItems={MENU_ITEMS} onAddToCart={handleAddToCart} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      <Header cartItemCount={cartItemCount} onCartClick={() => setCurrentView('cart')} />
      <main className="container mx-auto max-w-4xl p-4 pb-24">
        {renderView()}
      </main>
      {currentView === 'menu' && cart.length > 0 && (
         <FloatingCartButton 
            itemCount={cartItemCount} 
            totalPrice={cartTotal} 
            onClick={() => setCurrentView('cart')} 
        />
      )}
    </div>
  );
};

export default App;

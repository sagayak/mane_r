import React, { useState, useMemo } from 'react';
import type { CartItem, Address } from '../types';
import { PlusIcon } from './icons/PlusIcon';
import { MinusIcon } from './icons/MinusIcon';

interface CartViewProps {
  cartItems: CartItem[];
  onUpdateQuantity: (itemId: number, newQuantity: number) => void;
  onSubmitOrder: (address: Address) => void;
  onBackToMenu: () => void;
  isLoading: boolean;
  error: string | null;
}

const CartView: React.FC<CartViewProps> = ({ cartItems, onUpdateQuantity, onSubmitOrder, onBackToMenu, isLoading, error }) => {
  const [tower, setTower] = useState('');
  const [flatNumber, setFlatNumber] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');
  
  const total = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cartItems]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPhone = e.target.value;
    setPhone(newPhone);
    if (newPhone && !/^\d{10}$/.test(newPhone)) {
        setPhoneError('Phone number must be 10 digits if provided.');
    } else {
        setPhoneError('');
    }
  };

  const isFormValid = tower && flatNumber && !phoneError && cartItems.length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      const floor = flatNumber.length > 2 ? flatNumber.slice(0, -2) : '0';
      const flat = flatNumber.slice(-2);
      onSubmitOrder({ tower, floor, flat, name, phone });
    }
  };

  const generateTowerOptions = (start: number, end: number) => {
    return Array.from({ length: end - start + 1 }, (_, i) => String(start + i));
  };
  
  const towerOptions = generateTowerOptions(1, 22);
  
  const flatNumberOptions = useMemo(() => {
    const options: string[] = [];
    // Ground floor
    for (let flat = 1; flat <= 6; flat++) {
        options.push(String(flat).padStart(3, '0'));
    }
    // Floors 1 to 14
    for (let floor = 1; floor <= 14; floor++) {
        for (let flat = 1; flat <= 6; flat++) {
            const flatString = String(flat).padStart(2, '0');
            options.push(`${floor}${flatString}`);
        }
    }
    return options;
  }, []);


  if (cartItems.length === 0) {
    return (
      <div className="text-center p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Your Cart is Empty</h2>
        <p className="text-gray-600 mb-6">Looks like you haven't added anything to your cart yet.</p>
        <button onClick={onBackToMenu} className="bg-orange-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-orange-600 transition-colors">
          Back to Menu
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-extrabold text-gray-900">Your Cart</h2>
        <button onClick={onBackToMenu} className="text-sm font-medium text-orange-600 hover:text-orange-500">
            &larr; Continue Shopping
        </button>
      </div>
      
      <div className="space-y-4 mb-6">
        {cartItems.map(item => (
          <div key={item.id} className="flex items-center justify-between border-b pb-4">
            <div>
              <p className="font-bold">{item.name}</p>
              <p className="text-sm text-gray-500">₹{item.price.toFixed(2)}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center border rounded-lg">
                <button onClick={() => onUpdateQuantity(item.id, item.quantity - 1)} className="p-2 text-gray-600 hover:text-orange-600"><MinusIcon /></button>
                <span className="px-3 font-semibold w-8 text-center">{item.quantity}</span>
                <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)} className="p-2 text-gray-600 hover:text-orange-600"><PlusIcon /></button>
              </div>
              <p className="font-bold w-20 text-right">₹{(item.price * item.quantity).toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="text-right text-2xl font-bold mb-8">
        Total: <span className="text-orange-600">₹{total.toFixed(2)}</span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <h3 className="text-2xl font-bold">Delivery & Contact Info</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name <span className="text-gray-500">(Optional)</span></label>
            <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm rounded-md" placeholder="Enter your name"/>
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number <span className="text-gray-500">(Optional)</span></label>
            <input type="tel" id="phone" value={phone} onChange={handlePhoneChange} title="If provided, must be a 10-digit phone number" className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm rounded-md" placeholder="10-digit mobile number"/>
            {phoneError && <p className="text-red-500 text-sm mt-1">{phoneError}</p>}
          </div>
          <div>
            <label htmlFor="tower" className="block text-sm font-medium text-gray-700">Tower</label>
            <select id="tower" value={tower} onChange={e => setTower(e.target.value)} required className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm rounded-md">
              <option value="" disabled>Select Tower</option>
              {towerOptions.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="flatNumber" className="block text-sm font-medium text-gray-700">Floor &amp; Flat</label>
            <select id="flatNumber" value={flatNumber} onChange={e => setFlatNumber(e.target.value)} required className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm rounded-md">
              <option value="" disabled>Select Flat</option>
              {flatNumberOptions.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}
        
        <button
          type="submit"
          disabled={!isFormValid || isLoading}
          className="w-full bg-orange-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-orange-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
        >
          {isLoading ? (
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : 'Confirm Order'}
        </button>
      </form>
    </div>
  );
};

export default CartView;
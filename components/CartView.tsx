import React, { useState } from 'react';
import { CartItem, Address } from '../types';
import { CloseIcon, MinusIcon, PlusIcon, CheckCircleIcon, ExclamationIcon } from './icons';

interface CartViewProps {
  cart: CartItem[];
  totalPrice: number;
  onClose: () => void;
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onConfirmOrder: (address: Address) => Promise<void>;
  orderStatus: 'idle' | 'placing' | 'success' | 'error';
  errorMessage: string;
  onPlaceAnotherOrder: () => void;
}

const AddressForm: React.FC<{ address: Address; setAddress: (address: Address) => void; isFormValid: boolean; }> = ({ address, setAddress, isFormValid }) => {
    const towers = Array.from({ length: 18 }, (_, i) => i + 1);
    const floors = Array.from({ length: 14 }, (_, i) => i + 1);
    const flats = Array.from({ length: 6 }, (_, i) => (i + 1).toString().padStart(3, '0'));

    return (
        <div className="mt-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Delivery Address</h3>
            <div>
                <label htmlFor="tower" className="block text-sm font-medium text-gray-700">Tower</label>
                <select id="tower" value={address.tower} onChange={e => setAddress({ ...address, tower: e.target.value })} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm rounded-md">
                    <option value="">Select Tower</option>
                    {towers.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
            </div>
            <div>
                <label htmlFor="floor" className="block text-sm font-medium text-gray-700">Floor</label>
                <select id="floor" value={address.floor} onChange={e => setAddress({ ...address, floor: e.target.value })} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm rounded-md">
                    <option value="">Select Floor</option>
                    {floors.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
            </div>
            <div>
                <label htmlFor="flat" className="block text-sm font-medium text-gray-700">Flat</label>
                <select id="flat" value={address.flat} onChange={e => setAddress({ ...address, flat: e.target.value })} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm rounded-md">
                    <option value="">Select Flat</option>
                    {flats.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
            </div>
             {!isFormValid && <p className="text-red-500 text-xs mt-1">Please fill out all address fields.</p>}
        </div>
    );
};


const CartView: React.FC<CartViewProps> = ({ cart, totalPrice, onClose, onUpdateQuantity, onConfirmOrder, orderStatus, errorMessage, onPlaceAnotherOrder }) => {
  const [address, setAddress] = useState<Address>({ tower: '', floor: '', flat: '' });
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);

  // FIX: Coerce the result to a boolean. The original expression resulted in a string,
  // which caused a type error when passed to props expecting a boolean.
  const isFormValid = !!(address.tower && address.floor && address.flat);

  const handleSubmit = () => {
    setAttemptedSubmit(true);
    if(isFormValid) {
        onConfirmOrder(address);
    }
  };

  const renderContent = () => {
    switch (orderStatus) {
      case 'success':
        return (
          <div className="flex flex-col items-center justify-center text-center p-8">
            <CheckCircleIcon className="w-16 h-16 text-green-500 mb-4"/>
            <h2 className="text-2xl font-bold text-gray-800">Order Placed!</h2>
            <p className="text-gray-600 mt-2">Your delicious meal is on its way. Thank you!</p>
            <button
              onClick={onPlaceAnotherOrder}
              className="mt-8 w-full bg-orange-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-orange-700 transition-colors"
            >
              Place Another Order
            </button>
          </div>
        );
      case 'error':
        return (
          <div className="flex flex-col items-center justify-center text-center p-8">
            <ExclamationIcon className="w-16 h-16 text-red-500 mb-4"/>
            <h2 className="text-2xl font-bold text-gray-800">Oops!</h2>
            <p className="text-gray-600 mt-2">Something went wrong while placing your order.</p>
            <p className="text-red-600 text-sm mt-2 bg-red-100 p-2 rounded-md">{errorMessage}</p>
            <button
              onClick={onPlaceAnotherOrder}
              className="mt-8 w-full bg-orange-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-orange-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        );
      case 'placing':
        return (
            <div className="flex flex-col items-center justify-center p-8">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-600"></div>
                <h2 className="text-xl font-semibold mt-4">Placing Your Order...</h2>
            </div>
        );
      case 'idle':
      default:
        return (
          <>
            <div className="p-4 flex-grow overflow-y-auto">
              <h2 className="text-xl font-bold border-b pb-2">Your Order</h2>
              <div className="space-y-4 mt-4">
                {cart.map(item => (
                  <div key={item.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-sm text-gray-500">₹{item.price}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button onClick={() => onUpdateQuantity(item.id, item.quantity - 1)} className="p-1 rounded-full bg-gray-200"><MinusIcon className="w-4 h-4"/></button>
                      <span>{item.quantity}</span>
                      <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)} className="p-1 rounded-full bg-gray-200"><PlusIcon className="w-4 h-4"/></button>
                    </div>
                  </div>
                ))}
              </div>
              <AddressForm address={address} setAddress={setAddress} isFormValid={isFormValid || !attemptedSubmit}/>
            </div>
            <div className="p-4 border-t bg-white">
              <div className="flex justify-between items-center font-bold text-lg mb-4">
                <span>Total</span>
                <span>₹{totalPrice.toFixed(2)}</span>
              </div>
              <button
                onClick={handleSubmit}
                disabled={!isFormValid && attemptedSubmit}
                className="w-full bg-orange-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-orange-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Confirm Order
              </button>
            </div>
          </>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-30 flex items-end justify-center">
      <div className="bg-gray-100 rounded-t-2xl w-full max-w-lg h-[90vh] flex flex-col">
        <div className="p-4 border-b flex justify-between items-center flex-shrink-0">
          <h2 className="text-xl font-bold">
            {orderStatus === 'idle' ? 'Cart' : 'Order Status'}
          </h2>
          <button onClick={orderStatus === 'idle' || orderStatus === 'error' ? onClose : undefined} className="p-2 rounded-full hover:bg-gray-200">
            <CloseIcon className="w-6 h-6"/>
          </button>
        </div>
        {renderContent()}
      </div>
    </div>
  );
};

export default CartView;
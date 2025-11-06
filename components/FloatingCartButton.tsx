
import React from 'react';
import { ShoppingCartIcon } from './icons/ShoppingCartIcon';

interface FloatingCartButtonProps {
    itemCount: number;
    totalPrice: number;
    onClick: () => void;
}

const FloatingCartButton: React.FC<FloatingCartButtonProps> = ({ itemCount, totalPrice, onClick }) => {
    return (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-transparent z-20">
            <div className="container mx-auto max-w-4xl">
                 <button 
                    onClick={onClick}
                    className="w-full bg-orange-600 text-white rounded-lg shadow-lg flex items-center justify-between p-4 h-16 transform transition-transform hover:scale-105"
                >
                    <div className="flex items-center">
                        <div className="relative">
                            <ShoppingCartIcon />
                            <span className="absolute -top-2 -right-2 bg-white text-orange-600 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                {itemCount}
                            </span>
                        </div>
                        <span className="ml-4 font-bold text-lg">View Cart</span>
                    </div>
                    <span className="font-semibold text-lg">₹{totalPrice.toFixed(2)}</span>
                </button>
            </div>
        </div>
    )
}

export default FloatingCartButton;

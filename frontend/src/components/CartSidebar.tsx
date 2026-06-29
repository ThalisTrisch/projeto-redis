import { motion, AnimatePresence } from 'motion/react';
import { X, Trash2, ShoppingBag } from 'lucide-react';
import { CartItem } from '../types';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onRemoveItem: (id: string) => void;
  onUpdateQuantity: (id: string, newQuantity: number) => void;
}

export function CartSidebar({ isOpen, onClose, cartItems, onRemoveItem, onUpdateQuantity }: CartSidebarProps) {
  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const total = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-50"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-[#333] flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[#3483fa]" />
                Seu carrinho
              </h2>
              <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-gray-500 space-y-4">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
                    <ShoppingBag className="w-10 h-10 text-gray-300" />
                  </div>
                  <p>Seu carrinho está vazio.</p>
                  <button 
                    onClick={onClose}
                    className="text-[#3483fa] font-semibold hover:text-[#2968c8]"
                  >
                    Descobrir produtos
                  </button>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4 bg-white p-3 border border-gray-100 rounded-lg shadow-sm">
                    <div className="w-20 h-20 flex-shrink-0 bg-gray-50 rounded flex items-center justify-center p-2">
                      <img src={item.image} alt={item.title} className="max-w-full max-h-full object-contain mix-blend-multiply" />
                    </div>
                    
                    <div className="flex-1 flex flex-col">
                      <h3 className="text-sm text-[#333] line-clamp-2 mb-1">{item.title}</h3>
                      <p className="text-base font-semibold text-[#333] mb-2">{formatPrice(item.price)}</p>
                      
                      <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-center border border-gray-200 rounded">
                          <button 
                            onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            className="px-2.5 py-1 text-gray-500 hover:bg-gray-100"
                          >
                            -
                          </button>
                          <span className="px-3 text-sm font-medium text-[#333]">{item.quantity}</span>
                          <button 
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            className="px-2.5 py-1 text-[#3483fa] hover:bg-gray-100"
                          >
                            +
                          </button>
                        </div>
                        
                        <button 
                          onClick={() => onRemoveItem(item.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer / Checkout */}
            {cartItems.length > 0 && (
              <div className="p-4 border-t border-gray-100 bg-gray-50">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[#333]">Total</span>
                  <span className="text-2xl font-semibold text-[#333]">{formatPrice(total)}</span>
                </div>
                <button className="w-full bg-[#3483fa] hover:bg-[#2968c8] text-white font-semibold py-3.5 rounded-md transition-colors text-lg">
                  Continuar a compra
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

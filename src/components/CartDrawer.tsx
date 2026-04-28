import { motion, AnimatePresence } from 'motion/react';
import { X, Minus, Plus, Trash2, ArrowRight, ShoppingBag } from 'lucide-react';
import { CartItem } from '../types';
import { cn } from '../lib/utils';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
  onCheckout: () => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemove,
  onCheckout,
}: CartDrawerProps) {
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-[70] flex flex-col shadow-2xl"
          >
            <div className="p-6 flex items-center justify-between border-b border-border">
              <h2 className="text-xl font-display font-bold uppercase tracking-tight">Shopping Bag</h2>
              <button onClick={onClose} className="p-2 -mr-2 opacity-50 hover:opacity-100 transition-opacity">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                  <ShoppingBag className="w-12 h-12 mb-4" />
                  <p className="text-sm uppercase tracking-widest font-bold">Your bag is empty</p>
                  <button 
                    onClick={onClose}
                    className="mt-6 text-xs underline underline-offset-4 decoration-2"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-8">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="w-24 aspect-[3/4] bg-surface border border-border rounded-lg overflow-hidden flex-shrink-0">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="flex-1 flex flex-col justify-between py-1">
                        <div>
                          <div className="flex justify-between items-start gap-2">
                            <h3 className="text-sm font-semibold leading-tight text-ink">{item.name}</h3>
                            <p className="text-sm font-bold text-ink">${item.price}</p>
                          </div>
                          <p className="text-[10px] uppercase tracking-widest text-muted mt-1 font-bold">
                            {item.category}
                          </p>
                        </div>
                        
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center border border-border rounded-lg bg-surface p-1">
                            <button
                              onClick={() => onUpdateQuantity(item.id, -1)}
                              className="p-1 px-2 hover:bg-white rounded transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-8 text-center text-xs font-mono font-bold">{item.quantity}</span>
                            <button
                              onClick={() => onUpdateQuantity(item.id, 1)}
                              className="p-1 px-2 hover:bg-white rounded transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <button
                            onClick={() => onRemove(item.id)}
                            className="p-2 text-muted hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="p-6 bg-surface border-t border-border">
                <div className="flex justify-between items-end mb-6">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-muted font-bold mb-1">Subtotal</p>
                    <p className="text-3xl font-extrabold text-ink leading-none tracking-tighter">${subtotal}</p>
                  </div>
                  <p className="text-xs text-muted font-medium">Shipping calculated at checkout</p>
                </div>
                <button 
                  onClick={onCheckout}
                  className="w-full bg-primary text-white py-4 rounded-xl text-xs uppercase tracking-[0.2em] font-bold flex items-center justify-center gap-2 hover:opacity-90 shadow-lg shadow-primary/20 transition-all active:scale-95"
                >
                  Confirm Order
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

import { motion } from 'motion/react';
import { Plus } from 'lucide-react';
import { Product } from '../types';
import { cn } from '../lib/utils';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white border border-border rounded-2xl p-4 transition-all duration-300 hover:shadow-xl hover:shadow-ink/5 group"
    >
      <div className="relative aspect-[1.1/1] overflow-hidden bg-surface rounded-xl mb-4 group-hover:scale-[1.02] transition-transform duration-500">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        {product.id === '3' && (
          <div className="absolute top-3 left-3 bg-primary text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">
            Premium
          </div>
        )}
      </div>
      
      <div className="flex flex-col h-full">
        <span className="text-[10px] font-bold text-muted uppercase tracking-widest mb-1">
          {product.category}
        </span>
        <h3 className="text-sm font-semibold text-ink line-clamp-1 mb-4">{product.name}</h3>
        
        <div className="mt-auto flex items-center justify-between">
          <p className="text-lg font-extrabold text-ink tracking-tight">${product.price}</p>
          <button
            onClick={() => onAddToCart(product)}
            className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-lg shadow-primary/20"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowRight, Instagram, Twitter, Facebook } from 'lucide-react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, setDoc, serverTimestamp, addDoc, collection } from 'firebase/firestore';

import Navbar from './components/Navbar';
import ProductCard from './components/ProductCard';
import CartDrawer from './components/CartDrawer';
import { PRODUCTS } from './constants';
import { Product, CartItem } from './types';
import { auth, db } from './lib/firebase';
import { cn } from './lib/utils';

function Home({ onAddToCart }: { onAddToCart: (p: Product) => void }) {
  const [activeCategory, setActiveCategory] = React.useState('All Products');
  const categories = ['All Products', 'Smart Home', 'Audio & Sound', 'Wearables', 'Computing', 'Accessories'];

  const filteredProducts = activeCategory === 'All Products' 
    ? PRODUCTS 
    : PRODUCTS.filter(p => p.category.toLowerCase().includes(activeCategory.toLowerCase().split(' ')[0]));

  return (
    <div className="pt-[72px] min-h-screen flex flex-col">
      <main className="flex-1 max-w-7xl mx-auto w-full flex">
        {/* Sidebar */}
        <aside className="hidden lg:block w-72 h-[calc(100vh-72px)] sticky top-[72px] border-r border-border p-8 bg-white/50 backdrop-blur-sm">
          <div className="mb-10">
            <h4 className="text-[10px] font-bold text-muted uppercase tracking-[0.2em] mb-6">Categories</h4>
            <ul className="space-y-1">
              {categories.map((cat) => (
                <li key={cat}>
                  <button 
                    onClick={() => setActiveCategory(cat)}
                    className={cn(
                      "w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-all",
                      activeCategory === cat 
                        ? "bg-accent text-primary shadow-sm" 
                        : "text-muted hover:bg-surface hover:text-ink"
                    )}
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-bold text-muted uppercase tracking-[0.2em] mb-6">Filters</h4>
            <div className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20 cursor-pointer" defaultChecked />
                <span className="text-sm font-medium text-muted group-hover:text-ink transition-colors">In Stock Only</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20 cursor-pointer" />
                <span className="text-sm font-medium text-muted group-hover:text-ink transition-colors">Best Sellers</span>
              </label>
            </div>
          </div>
        </aside>

        {/* Product Grid Area */}
        <section className="flex-1 p-8 lg:p-12 overflow-y-auto">
          <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-primary" />
                <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Active Store</span>
              </div>
              <h2 className="text-4xl font-extrabold text-ink tracking-tighter uppercase">{activeCategory}</h2>
            </div>
            <p className="text-xs text-muted font-medium max-w-[200px] leading-relaxed uppercase tracking-wider">
              Displaying {filteredProducts.length} curated objects for your space.
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div key={product.id}>
                <ProductCard 
                  product={product} 
                  onAddToCart={onAddToCart} 
                />
              </div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="py-32 flex flex-col items-center justify-center text-center opacity-20">
              <div className="w-20 h-20 border-2 border-dashed border-ink rounded-full mb-6" />
              <p className="text-lg font-bold uppercase tracking-widest">No products found</p>
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-border py-8 px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-xs font-medium text-muted uppercase tracking-widest">
          &copy; 2024 Nexus Marketplace. All rights reserved.
        </div>
        <div className="flex gap-4">
          <div className="bg-surface border border-border px-4 py-2 rounded-full text-[10px] font-bold text-muted uppercase tracking-widest flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
            Free Shipping over $250
          </div>
          <div className="bg-surface border border-border px-4 py-2 rounded-full text-[10px] font-bold text-muted uppercase tracking-widest flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            24/7 Concierge Support
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  const [cart, setCart] = React.useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = React.useState(false);
  const [user, setUser] = React.useState<User | null>(null);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        // Sync user to Firestore
        try {
          await setDoc(doc(db, 'users', u.uid), {
            uid: u.uid,
            email: u.email,
            displayName: u.displayName,
            photoURL: u.photoURL,
            lastLogin: serverTimestamp()
          }, { merge: true });
        } catch (e) {
          console.error("Error syncing user:", e);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existingItem = prev.find((item) => item.id === product.id);
      if (existingItem) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeItem = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const handleCheckout = async () => {
    if (!user) {
      alert("Please sign in to complete your purchase.");
      return;
    }

    try {
      const orderData = {
        userId: user.uid,
        items: cart.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        totalAmount: cart.reduce((acc, item) => acc + item.price * item.quantity, 0),
        status: 'pending',
        createdAt: serverTimestamp()
      };

      await addDoc(collection(db, 'orders'), orderData);
      setCart([]);
      setIsCartOpen(false);
      alert("Thank you for your order! Your purchase was successful.");
    } catch (e) {
      console.error("Checkout error:", e);
      alert("Something went wrong during checkout. Please try again.");
    }
  };

  return (
    <Router>
      <div className="relative">
        <Navbar 
          cartCount={cart.reduce((acc, item) => acc + item.quantity, 0)} 
          onOpenCart={() => setIsCartOpen(true)} 
        />
        
        <Routes>
          <Route path="/" element={<Home onAddToCart={addToCart} />} />
        </Routes>

        <CartDrawer
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          items={cart}
          onUpdateQuantity={updateQuantity}
          onRemove={removeItem}
          onCheckout={handleCheckout}
        />
      </div>
    </Router>
  );
}

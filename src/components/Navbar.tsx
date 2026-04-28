import React from 'react';
import { ShoppingBag, Search, Menu, X, User as UserIcon, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';
import { auth, signInWithGoogle, logout } from '../lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
}

export default function Navbar({ cartCount, onOpenCart }: NavbarProps) {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [user, setUser] = React.useState<User | null>(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
    return () => {
      window.removeEventListener('scroll', handleScroll);
      unsubscribe();
    };
  }, []);

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-8 py-0 h-[72px] bg-white border-b border-border shadow-sm flex items-center",
        )}
      >
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-12">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-8 h-8 bg-primary rounded-lg shadow-lg shadow-primary/20 transition-transform group-hover:scale-105" />
              <span className="text-xl font-extrabold tracking-tighter text-ink uppercase">
                Nexus
              </span>
            </Link>
            
            <div className="hidden lg:flex items-center gap-1.5">
              {['All Products', 'Collections', 'Offers'].map((item) => (
                <Link
                  key={item}
                  to="#"
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-accent hover:text-primary text-muted",
                    item === 'All Products' && "bg-accent text-primary"
                  )}
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>

          <div className="hidden md:flex flex-1 max-w-sm mx-12">
            <div className="w-full bg-surface rounded-xl px-4 py-2.5 flex items-center gap-3 text-muted border border-transparent focus-within:border-primary/20 focus-within:bg-white transition-all">
              <Search className="w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search products..." 
                className="bg-transparent text-sm w-full outline-none placeholder:text-muted/60"
              />
            </div>
          </div>

          <div className="flex items-center gap-8">
            <div className="relative">
              {user ? (
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="w-10 h-10 rounded-full overflow-hidden border-2 border-accent hover:border-primary/20 transition-colors shadow-sm"
                  >
                    <img src={user.photoURL || ''} alt={user.displayName || ''} className="w-full h-full object-cover" />
                  </button>
                  <AnimatePresence>
                    {isUserMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 top-full mt-3 w-56 bg-white shadow-2xl rounded-2xl border border-border p-3 flex flex-col gap-1 z-50"
                      >
                        <div className="px-3 py-2 mb-2 border-b border-border">
                          <p className="text-xs font-bold text-ink truncate">{user.displayName}</p>
                          <p className="text-[10px] text-muted truncate">{user.email}</p>
                        </div>
                        <button className="text-left px-3 py-2.5 text-sm font-medium rounded-xl hover:bg-accent hover:text-primary transition-all flex items-center gap-3">
                          <UserIcon className="w-4 h-4 opacity-70" /> Profile
                        </button>
                        <button 
                          onClick={() => {
                            logout();
                            setIsUserMenuOpen(false);
                          }}
                          className="text-left px-3 py-2.5 text-sm font-medium rounded-xl hover:bg-red-50 text-red-500 transition-all flex items-center gap-3"
                        >
                          <LogOut className="w-4 h-4" /> Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <button 
                  onClick={signInWithGoogle}
                  className="px-6 py-2.5 rounded-xl border-2 border-border font-bold text-xs uppercase tracking-wider hover:bg-ink hover:text-white hover:border-ink transition-all active:scale-95"
                >
                  Sign In
                </button>
              )}
            </div>

            <button 
              onClick={onOpenCart}
              className="relative group p-2 text-ink flex items-center gap-3"
            >
              <div className="relative">
                <ShoppingBag className="w-6 h-6 transition-transform group-hover:scale-110" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] w-4.5 h-4.5 flex items-center justify-center rounded-full font-bold border-2 border-white">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:block text-sm font-bold">${(cartCount * 89).toFixed(0)}</span>
            </button>
            <button 
              className="lg:hidden text-ink"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-40 bg-white pt-24 px-8 lg:hidden"
          >
            <div className="flex flex-col gap-4">
              {['All Products', 'Collections', 'Offers', 'About', 'Journal'].map((item) => (
                <Link
                  key={item}
                  to="#"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-4xl font-extrabold text-ink leading-tight tracking-tighter uppercase"
                >
                  {item}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

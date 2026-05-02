import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, User, Menu, X, Search, ShoppingBag } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { motion, AnimatePresence } from "motion/react";

const Navigation = () => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "glass py-3" : "bg-transparent py-5"}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <ShoppingBag className="text-brand-primary w-6 h-6 md:w-8 md:h-8" />
          <span className="text-lg md:text-2xl font-serif font-bold tracking-tight text-brand-primary uppercase">LOOKWAY FLORA</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link to="/shop" className="hover:text-brand-accent transition-colors">Shop</Link>
          <Link to="/categories" className="hover:text-brand-accent transition-colors">Categories</Link>
          <Link to="/about" className="hover:text-brand-accent transition-colors">About Us</Link>
          {user?.role === "admin" && <Link to="/admin" className="text-brand-accent hover:opacity-80 transition-opacity">Admin</Link>}
          {user?.role === "vendor" && <Link to="/vendor" className="text-brand-accent hover:opacity-80 transition-opacity">Vendor Dashboard</Link>}
        </div>

        <div className="flex items-center gap-2 md:gap-5">
          <button className="hidden md:block p-2 hover:bg-brand-accent/10 rounded-full transition-colors cursor-pointer">
            <Search className="w-5 h-5 text-brand-primary" />
          </button>
          
          <Link to="/cart" className="relative p-2 hover:bg-brand-accent/10 rounded-full transition-colors">
            <ShoppingCart className="w-5 h-5 text-brand-primary" />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 bg-brand-accent text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </Link>

          {user ? (
            <div className="relative group hidden md:block">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-brand-sage/10 px-3 py-1.5 rounded-full border border-brand-sage/20">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-brand-green">Wallet</span>
                  <span className="text-xs font-bold text-zinc-900">Rs. {(user.walletBalance || 0).toFixed(2)}</span>
                </div>
                <button className="flex items-center gap-2 p-1 pl-3 bg-brand-primary text-white rounded-full hover:bg-brand-primary/90 transition-colors">
                  <span className="text-xs font-medium">{user.name.split(' ')[0]}</span>
                  <User className="w-5 h-5 p-1 bg-white/20 rounded-full" />
                </button>
              </div>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-zinc-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-2">
                <Link to="/profile" className="block px-4 py-2 hover:bg-zinc-50 transition-colors">My Profile</Link>
                <Link to="/orders" className="block px-4 py-2 hover:bg-zinc-50 transition-colors">Orders</Link>
                <hr className="my-1 border-zinc-100" />
                <button onClick={logout} className="w-full text-left px-4 py-2 text-red-500 hover:bg-red-50 transition-colors">Logout</button>
              </div>
            </div>
          ) : (
            <Link to="/login" className="hidden md:inline-block px-5 py-2 bg-brand-primary text-white rounded-full text-sm font-medium hover:shadow-lg hover:shadow-brand-accent/20 transition-all active:scale-95">
              Sign In
            </Link>
          )}

          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2">
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t border-white/20"
          >
            <div className="flex flex-col p-6 gap-4 font-medium overflow-y-auto max-h-[70vh]">
              <Link to="/shop" onClick={() => setIsOpen(false)}>Shop</Link>
              <Link to="/categories" onClick={() => setIsOpen(false)}>Categories</Link>
              <Link to="/about" onClick={() => setIsOpen(false)}>About Us</Link>
              {user?.role === "admin" && <Link to="/admin" onClick={() => setIsOpen(false)} className="text-brand-accent">Admin</Link>}
              {user?.role === "vendor" && <Link to="/vendor" onClick={() => setIsOpen(false)} className="text-brand-accent">Vendor Dashboard</Link>}
              
              <hr className="border-zinc-200/50 my-2" />
              
              {user ? (
                <>
                  <Link to="/profile" onClick={() => setIsOpen(false)}>My Profile</Link>
                  <Link to="/orders" onClick={() => setIsOpen(false)}>Orders</Link>
                  <button onClick={() => { logout(); setIsOpen(false); }} className="text-red-500 text-left">Logout</button>
                </>
              ) : (
                <Link to="/login" onClick={() => setIsOpen(false)} className="text-brand-primary font-bold">Sign In</Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navigation;

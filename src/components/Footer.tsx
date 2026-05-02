import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, ShoppingBag } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 py-20">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-1">
          <Link to="/" className="flex items-center gap-2 text-white mb-6">
            <ShoppingBag className="text-brand-accent w-8 h-8" />
            <span className="text-2xl font-serif font-bold tracking-tight uppercase">LOOKWAY FLORA</span>
          </Link>
          <p className="text-sm leading-relaxed mb-8">
            The destination for modern lifestyle. Discover premium electronics, designer apparel, and essential home goods delivered with priority care.
          </p>
          <div className="flex gap-4">
            <a href="#" className="p-2 bg-white/5 rounded-full hover:bg-brand-accent hover:text-white transition-all"><Instagram className="w-4 h-4" /></a>
            <a href="#" className="p-2 bg-white/5 rounded-full hover:bg-brand-accent hover:text-white transition-all"><Facebook className="w-4 h-4" /></a>
            <a href="#" className="p-2 bg-white/5 rounded-full hover:bg-brand-accent hover:text-white transition-all"><Twitter className="w-4 h-4" /></a>
          </div>
        </div>

        <div>
          <h4 className="text-white font-medium mb-6">Shop</h4>
          <ul className="space-y-4 text-sm">
            <li><Link to="/shop" className="hover:text-brand-accent transition-colors">All Products</Link></li>
            <li><Link to="/shop?category=electronics" className="hover:text-brand-accent transition-colors">Electronics</Link></li>
            <li><Link to="/shop?category=apparel" className="hover:text-brand-accent transition-colors">Apparel</Link></li>
            <li><Link to="/shop?category=lifestyle" className="hover:text-brand-accent transition-colors">Lifestyle</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-medium mb-6">Support</h4>
          <ul className="space-y-4 text-sm">
            <li><Link to="/shipping" className="hover:text-brand-accent transition-colors">Shipping Policy</Link></li>
            <li><Link to="/returns" className="hover:text-brand-accent transition-colors">Returns & Refunds</Link></li>
            <li><Link to="/faq" className="hover:text-brand-accent transition-colors">FAQs</Link></li>
            <li><Link to="/contact" className="hover:text-brand-accent transition-colors">Contact Us</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-medium mb-6">Experience</h4>
          <ul className="space-y-4 text-sm">
            <li className="flex items-center gap-3"><MapPin className="w-4 h-4 text-brand-accent" /> 123 Tech Avenue, San Francisco, CA</li>
            <li className="flex items-center gap-3"><Phone className="w-4 h-4 text-brand-accent" /> +1 (555) 000-5678</li>
            <li className="flex items-center gap-3"><Mail className="w-4 h-4 text-brand-accent" /> hello@lookwayflora.com</li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 mt-20 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between gap-4 text-xs">
        <p>© 2026 LOOKWAY FLORA. All rights reserved.</p>
        <div className="flex gap-8">
          <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

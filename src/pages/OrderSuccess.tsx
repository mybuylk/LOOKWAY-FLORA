import React from "react";
import { Link, useLocation } from "react-router-dom";
import { CheckCircle, ShoppingBag, ArrowRight, Calendar, Package } from "lucide-react";
import { motion } from "motion/react";

const OrderSuccess = () => {
  const location = useLocation();
  const orderId = location.state?.orderId || "FLR-" + Math.random().toString(36).substr(2, 9).toUpperCase();

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 flex items-center justify-center">
      <div className="max-w-2xl w-full">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass p-12 md:p-16 rounded-[4rem] text-center"
        >
          <div className="flex justify-center mb-10">
            <div className="relative">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="w-24 h-24 bg-brand-green text-white rounded-full flex items-center justify-center"
              >
                <CheckCircle className="w-12 h-12" />
              </motion.div>
              <div className="absolute -inset-4 border-2 border-brand-green/20 rounded-full animate-ping pointer-events-none" />
            </div>
          </div>

          <h1 className="text-4xl font-serif font-bold text-brand-primary mb-4">Order Confirmed!</h1>
          <p className="text-slate-500 mb-10 italic">
            Thank you for shopping with Lookway Flora. Your items are being expertly secured for their journey.
          </p>

          <div className="bg-white/50 border border-slate-100 rounded-3xl p-8 mb-12 text-left space-y-6">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Order Reference</span>
               <span className="font-mono font-medium text-brand-primary">{orderId}</span>
            </div>
            
            <div className="grid grid-cols-2 gap-8">
               <div className="flex items-center gap-4">
                  <div className="p-3 bg-brand-accent/10 rounded-xl">
                     <Calendar className="w-5 h-5 text-brand-accent" />
                  </div>
                  <div>
                     <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Estimated Arrival</span>
                     <span className="text-sm font-bold text-brand-primary">2-5 Business Days</span>
                  </div>
               </div>
               <div className="flex items-center gap-4">
                  <div className="p-3 bg-brand-accent/10 rounded-xl">
                     <Package className="w-5 h-5 text-brand-accent" />
                  </div>
                  <div>
                     <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Status</span>
                     <span className="text-sm font-bold text-brand-primary">Processing</span>
                  </div>
               </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link to="/orders" className="flex items-center justify-center gap-3 py-4 bg-white border border-slate-100 rounded-full font-bold text-brand-primary hover:bg-slate-50 transition-all">
              <ShoppingBag className="w-4 h-4" />
              Track Package
            </Link>
            <Link to="/shop" className="flex items-center justify-center gap-3 py-4 bg-brand-primary text-white rounded-full font-bold hover:shadow-xl hover:shadow-brand-accent/20 transition-all group">
              Continue Shopping
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderSuccess;

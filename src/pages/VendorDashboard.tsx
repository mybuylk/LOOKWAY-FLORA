import React from "react";
import { Store, Package, Plus, Banknote, ArrowUpRight, ShoppingBag } from "lucide-react";
import { formatPrice } from "../lib/utils";

const VendorDashboard = () => {
  return (
    <div className="min-h-screen bg-market-gradient pt-12 px-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-brand-primary text-white rounded-3xl flex items-center justify-center">
              <Store className="w-10 h-10" />
            </div>
            <div>
              <h1 className="text-4xl font-serif font-bold text-brand-primary">Vendor Portal</h1>
              <p className="text-sm text-slate-500">Managing "The Green Glasshouse" Store</p>
            </div>
          </div>
          <button className="px-8 py-4 bg-brand-primary text-white rounded-full font-bold flex items-center gap-3 hover:shadow-2xl transition-all">
            <Plus className="w-5 h-5" />
            New Offering
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="glass p-8 rounded-[2.5rem] border-none shadow-sm">
             <Banknote className="w-6 h-6 text-emerald-500 mb-4" />
             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Total Earnings</span>
             <h3 className="text-3xl font-serif font-bold text-brand-primary">{formatPrice(12430)}</h3>
             <p className="mt-4 text-xs text-green-500 font-bold flex items-center gap-1">
               <ArrowUpRight className="w-3 h-3" /> 18% vs last month
             </p>
          </div>
          <div className="glass p-8 rounded-[2.5rem] border-none shadow-sm">
             <Package className="w-6 h-6 text-brand-accent mb-4" />
             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Active Listings</span>
             <h3 className="text-3xl font-serif font-bold text-brand-primary">24</h3>
             <p className="mt-4 text-xs text-slate-400 font-medium">85% in stock level</p>
          </div>
          <div className="glass p-8 rounded-[2.5rem] border-none shadow-sm">
             <ShoppingBag className="w-6 h-6 text-brand-slate mb-4" />
             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">New Orders</span>
             <h3 className="text-3xl font-serif font-bold text-brand-primary">9</h3>
             <p className="mt-4 text-xs text-amber-500 font-bold">Needs processing</p>
          </div>
        </div>

        <div className="glass p-10 rounded-[3rem] border-none shadow-sm">
          <h3 className="text-2xl font-serif font-bold text-brand-primary mb-8">Recent Sales</h3>
          <div className="space-y-4">
            {[1,2,3].map(i => (
              <div key={i} className="flex items-center justify-between p-6 bg-white/50 rounded-2xl hover:bg-white transition-colors cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-100 rounded-xl overflow-hidden">
                    <img src={`https://images.unsplash.com/photo-1541250848049-b4f71413cc30?q=80&w=1974&auto=format&fit=crop`} className="w-full h-full object-cover" alt="" />
                  </div>
                  <div>
                    <h4 className="font-bold text-brand-primary">Spring Bouquet #01{i}</h4>
                    <span className="text-xs text-slate-400">Sold to customerID_0{i}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-brand-primary block">{formatPrice(89)}</span>
                  <span className="text-[10px] font-bold uppercase text-emerald-500">Paid</span>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-8 py-4 text-brand-accent font-bold text-sm border-2 border-dashed border-brand-accent/20 rounded-2xl hover:bg-brand-accent/5 transition-colors">
            View All Sales History
          </button>
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;

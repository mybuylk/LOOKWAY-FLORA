import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { ShoppingBag, Calendar, Package, ChevronRight, Truck, X } from "lucide-react";
import { motion } from "motion/react";
import { useAuth } from "../context/AuthContext";
import { formatPrice } from "../lib/utils";

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("/api/orders");
        setOrders(res.data);
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchOrders();
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center">
          <h2 className="text-2xl font-serif text-brand-green mb-4">Please sign in to view your orders.</h2>
          <Link to="/login" className="text-brand-sage hover:underline font-medium">Go to Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 md:pt-32 pb-20 px-4 md:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8 md:mb-12">
           <div className="p-3 md:p-4 bg-brand-green/10 rounded-xl md:rounded-2xl">
              <ShoppingBag className="text-brand-green w-6 h-6 md:w-8 md:h-8" />
           </div>
           <div>
              <h1 className="text-2xl md:text-4xl font-serif font-bold text-brand-green">My Orders</h1>
              <p className="text-zinc-500 text-xs md:text-sm italic">Tracking your botanical journey.</p>
           </div>
        </div>

        {loading ? (
          <div className="space-y-4 md:space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse bg-white border border-zinc-100 p-6 md:p-8 rounded-2xl md:rounded-[2rem]">
                 <div className="h-6 bg-zinc-100 rounded w-1/4 mb-4" />
                 <div className="h-4 bg-zinc-100 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : orders.length > 0 ? (
          <div className="space-y-4 md:space-y-6">
            {orders.map((order: any, index: number) => (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                key={order._id}
                className="bg-white border border-zinc-100 rounded-2xl md:rounded-[2rem] p-6 md:p-8 hover:shadow-xl hover:shadow-brand-green/5 transition-all group"
              >
                <div className="flex flex-col md:flex-row justify-between gap-6 md:gap-8">
                  <div className="space-y-3 md:space-y-4">
                    <div className="flex items-center gap-3">
                      <span className="px-2 py-0.5 md:px-3 md:py-1 bg-zinc-100 text-[9px] md:text-[10px] font-bold tracking-widest uppercase rounded-full">
                        #{order._id.slice(-8)}
                      </span>
                      <span className="text-brand-sage font-bold text-[10px] md:text-xs uppercase tracking-widest flex items-center gap-2">
                         <div className="w-1 md:w-1.5 h-1 md:h-1.5 bg-brand-sage rounded-full animate-pulse" />
                         {order.status || "Processing"}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-4 md:gap-6">
                       <div className="flex items-center gap-2 text-xs md:text-sm text-zinc-500">
                          <Calendar className="w-3.5 h-3.5 md:w-4 md:h-4" />
                          {new Date(order.createdAt).toLocaleDateString()}
                       </div>
                       <div className="flex items-center gap-2 text-xs md:text-sm text-zinc-600 font-bold">
                          <Package className="w-3.5 h-3.5 md:w-4 md:h-4 text-brand-green" />
                          {order.items?.length || 0} items
                       </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-6 md:gap-12 border-t md:border-t-0 pt-4 md:pt-0">
                    <div className="text-left md:text-right">
                       <span className="text-[9px] md:text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-0.5 md:mb-1">Total Amount</span>
                       <p className="text-xl md:text-2xl font-serif font-bold text-brand-green">{formatPrice(order.total || 0)}</p>
                    </div>
                    <button 
                      onClick={() => setSelectedOrder(order)}
                      className="p-3 md:p-4 bg-zinc-50 rounded-full group-hover:bg-brand-green group-hover:text-white transition-all"
                    >
                       <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-white rounded-[3rem] border border-dashed border-zinc-200">
            <Truck className="w-16 h-16 text-zinc-200 mx-auto mb-6" />
            <h3 className="text-xl font-serif text-brand-green mb-2">No orders yet</h3>
            <p className="text-zinc-400 text-sm mb-8">Ready to bring some nature home?</p>
            <Link to="/shop" className="px-8 py-3 bg-brand-green text-white rounded-full font-medium shadow-lg shadow-brand-green/20 hover:scale-105 active:scale-95 transition-all">
              Go to Boutique
            </Link>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setSelectedOrder(null)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white w-full max-w-2xl rounded-2xl md:rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden"
          >
            <div className="p-5 md:p-8 border-b border-zinc-100 flex items-center justify-between">
              <div>
                <h2 className="text-xl md:text-2xl font-serif font-bold text-brand-green">Order Details</h2>
                <p className="text-zinc-400 text-[10px] md:text-xs font-bold uppercase tracking-widest mt-0.5 md:mt-1">#{selectedOrder._id}</p>
              </div>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="p-2 md:p-3 hover:bg-zinc-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 md:w-6 md:h-6 text-zinc-400" />
              </button>
            </div>

            <div className="p-5 md:p-8 max-h-[50vh] md:max-h-[60vh] overflow-y-auto">
              <div className="space-y-4 md:space-y-6">
                {selectedOrder.items?.map((item: any, i: number) => (
                  <div key={i} className="flex items-center gap-4 md:gap-6 p-4 rounded-xl md:rounded-2xl bg-zinc-50 border border-zinc-100">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-white rounded-lg md:rounded-xl border border-zinc-100 flex-shrink-0 flex items-center justify-center overflow-hidden">
                      <Package className="w-5 h-5 md:w-6 md:h-6 text-zinc-200" />
                    </div>
                    <div className="flex-grow min-w-0">
                      <p className="text-[8px] md:text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-0.5 md:mb-1">Product ID</p>
                      <h4 className="font-bold text-brand-green text-xs md:text-sm truncate">{item.productId}</h4>
                      <p className="text-[10px] md:text-sm text-zinc-500">Qty: {item.quantity} × {formatPrice(item.price)}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-bold text-brand-green text-sm md:text-base">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-5 md:p-8 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between">
              <div>
                <p className="text-[9px] md:text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-0.5 md:mb-1">Status</p>
                <span className="px-3 py-1 md:px-4 md:py-1.5 bg-brand-green text-white text-[9px] md:text-[10px] font-bold uppercase tracking-widest rounded-full">
                  {selectedOrder.status}
                </span>
              </div>
              <div className="text-right">
                <p className="text-[9px] md:text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-0.5 md:mb-1">Total Paid</p>
                <p className="text-xl md:text-3xl font-serif font-bold text-brand-green">{formatPrice(selectedOrder.total)}</p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Orders;

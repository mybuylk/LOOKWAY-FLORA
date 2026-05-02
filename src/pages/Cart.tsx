import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, ArrowRight, Trash2, ChevronRight, Package } from "lucide-react";
import axios from "axios";
import { formatPrice } from "../lib/utils";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
  const { user, token, updateUser } = useAuth();
  const navigate = useNavigate();
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cod"); // "cod" or "wallet"
  const [errorDetails, setErrorDetails] = useState("");

  const deliveryFee = 15;
  const tax = cartTotal * 0.12;
  const total = cartTotal + deliveryFee + tax;

  const handlePlaceOrder = async () => {
    if (!user) {
      navigate("/login?redirect=cart");
      return;
    }
    setErrorDetails("");

    try {
      setIsPlacingOrder(true);
      const res = await axios.post("/api/orders", {
        items: cart.map(item => ({
          productId: item.id,
          name: item.name,
          price: item.discountPrice || item.price,
          quantity: item.quantity,
          image: item.image
        })),
        total: total,
        status: "Processing",
        paymentMethod
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.walletDecucted) {
         updateUser({ walletBalance: (user.walletBalance || 0) - total });
      }

      clearCart();
      navigate("/order-success", { state: { orderId: res.data.order?._id || res.data._id } });
    } catch (err: any) {
      console.error("Error placing order:", err);
      setErrorDetails(err.response?.data?.message || err.message);
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen pt-40 pb-20 px-6 flex flex-col items-center text-center">
        <div className="w-32 h-32 bg-brand-accent/10 rounded-full flex items-center justify-center mb-8">
          <ShoppingBag className="w-12 h-12 text-brand-accent" />
        </div>
        <h1 className="text-4xl font-serif font-bold text-brand-primary mb-4">Your Bag is Empty</h1>
        <p className="text-slate-500 mb-10 max-w-sm">It looks like you haven't added any curated items to your selection yet.</p>
        <Link to="/shop" className="px-10 py-4 bg-brand-primary text-white rounded-full font-bold hover:shadow-2xl transition-all">
          Explore Marketplace
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 bg-slate-50/50">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-2 text-slate-400 text-sm mb-12">
          <Link to="/shop" className="hover:text-brand-primary">Shop</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-slate-900 font-medium">Checkout Bag</span>
        </div>

        <h1 className="text-3xl md:text-5xl font-serif font-bold text-brand-primary mb-10 md:mb-16">Checkout Bag</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-16">
          {/* List */}
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            {cart.map((item) => (
              <div key={item.id} className="bg-white p-4 md:p-8 rounded-2xl md:rounded-3xl flex flex-col md:flex-row gap-4 md:gap-8 items-center border border-slate-100 shadow-sm transition-all hover:shadow-md">
                <div className="w-24 md:w-32 aspect-square rounded-xl md:rounded-2xl overflow-hidden bg-slate-50 flex-shrink-0 border border-slate-100">
                  <img src={item.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=200&auto=format&fit=crop"} className="w-full h-full object-cover" alt={item.name} />
                </div>
                <div className="flex-grow text-center md:text-left">
                  <h3 className="text-lg md:text-xl font-serif font-bold text-brand-primary mb-1">{item.name}</h3>
                  <div className="mt-2 md:mt-4 flex items-center justify-center md:justify-start gap-6">
                    <div className="flex items-center bg-white rounded-lg md:rounded-xl border border-slate-200 p-1">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center hover:bg-slate-50 rounded-lg font-bold"
                      >-</button>
                      <span className="w-8 md:w-10 text-center font-bold text-sm">{item.quantity}</span>
                      <button 
                         onClick={() => updateQuantity(item.id, item.quantity + 1)}
                         className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center hover:bg-slate-50 rounded-lg font-bold"
                      >+</button>
                    </div>
                  </div>
                </div>
                <div className="text-center md:text-right flex flex-col gap-1 md:gap-2">
                  <span className="text-xl md:text-2xl font-sans font-bold text-brand-primary">{formatPrice((item.discountPrice || item.price) * item.quantity)}</span>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-400 hover:text-red-500 transition-colors p-1 md:p-2 flex items-center gap-1 justify-center md:justify-end text-[10px] md:text-xs uppercase tracking-widest font-bold"
                  >
                    <Trash2 className="w-3 h-3 md:w-4 md:h-4" />
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-brand-primary text-white p-6 md:p-10 rounded-2xl md:rounded-[2.5rem] shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 opacity-5 -mr-12 -mt-12">
                <Package className="w-72 h-72" />
              </div>
              
              <h3 className="text-2xl font-serif font-bold mb-8 relative z-10">Order Summary</h3>
              
              <div className="space-y-6 relative z-10 mb-8 border-b border-white/10 pb-8">
                <div className="flex justify-between text-sm opacity-80">
                  <span>Subtotal</span>
                  <span>{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-sm opacity-80">
                  <span>Priority Shipping</span>
                  <span>{formatPrice(deliveryFee)}</span>
                </div>
                <div className="flex justify-between text-sm opacity-80">
                  <span>Estimated Tax</span>
                  <span>{formatPrice(tax)}</span>
                </div>
                <hr className="border-white/10" />
                <div className="flex justify-between text-xl font-bold">
                  <span>Grand Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              <div className="relative z-10 mb-8">
                <h4 className="text-sm font-bold uppercase tracking-widest mb-4">Payment Method</h4>
                <div className="space-y-4">
                  <button
                    type="button" 
                    onClick={() => setPaymentMethod('cod')} 
                    className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${paymentMethod === 'cod' ? 'border-brand-accent bg-white/10' : 'border-white/20 hover:border-white/40'}`}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'cod' ? 'border-brand-accent' : 'border-white/50'}`}>
                      {paymentMethod === 'cod' && <div className="w-2.5 h-2.5 rounded-full bg-brand-accent" />}
                    </div>
                    <span className="font-bold">Cash on Delivery</span>
                  </button>
                  <button
                    type="button" 
                    onClick={() => user && user.walletBalance && user.walletBalance >= total && setPaymentMethod('wallet')} 
                    className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${user && user.walletBalance && user.walletBalance >= total ? '' : 'opacity-50 cursor-not-allowed'} ${paymentMethod === 'wallet' ? 'border-brand-accent bg-white/10' : 'border-white/20 hover:border-white/40'}`}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'wallet' ? 'border-brand-accent' : 'border-white/50'}`}>
                      {paymentMethod === 'wallet' && <div className="w-2.5 h-2.5 rounded-full bg-brand-accent" />}
                    </div>
                    <span className="font-bold flex-grow text-left">Wallet</span>
                    {user && (
                      <span className="text-xs font-mono bg-white/20 px-2 py-1 rounded">
                        {formatPrice(user.walletBalance || 0)}
                      </span>
                    )}
                  </button>
                  {errorDetails && <div className="text-red-300 text-xs font-bold mt-2 text-center">{errorDetails}</div>}
                </div>
              </div>

              <button 
                onClick={handlePlaceOrder}
                disabled={isPlacingOrder || (paymentMethod === 'wallet' && (!user || (user.walletBalance || 0) < total))}
                className="w-full py-5 bg-brand-accent text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:shadow-xl hover:shadow-brand-accent/20 transition-all active:scale-95 group disabled:opacity-50"
              >
                {isPlacingOrder ? "Processing Order..." : "Confirm Secure Order"}
                {!isPlacingOrder && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
              </button>

              <div className="mt-8 text-[10px] text-center opacity-50 uppercase tracking-[0.2em] font-medium">
                Military-Grade SSL Encryption Active
              </div>
            </div>

            <div className="mt-8 p-6 bg-white rounded-2xl border border-slate-100 text-xs text-slate-500 leading-relaxed text-center font-medium">
              Prices and availability are not guaranteed until shipment confirmation.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;

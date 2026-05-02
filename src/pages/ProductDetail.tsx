import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { ShoppingCart, Heart, ShieldCheck, Truck, RefreshCcw, Star, ChevronLeft, ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { formatPrice } from "../lib/utils";
import { useCart } from "../context/CartContext";

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/products/${id}`);
        setProduct(res.data);
        
        // Fetch related products
        if (res.data.categoryId?._id) {
          const relatedRes = await axios.get(`/api/products?category=${res.data.categoryId.slug}&limit=4`);
          setRelatedProducts(relatedRes.data.filter((p: any) => p._id !== id).slice(0, 4));
        }
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
    scrollTo(0, 0);
  }, [id]);

  const handleAddToCart = () => {
    setIsAdding(true);
    addToCart(product, quantity);
    setTimeout(() => {
      setIsAdding(false);
    }, 1000);
  };

  if (loading) return <div className="h-screen flex items-center justify-center"><div className="w-10 h-10 border-4 border-brand-primary border-t-transparent rounded-full animate-spin" /></div>;
  if (!product) return <div className="h-screen flex items-center justify-center">Product not found</div>;

  return (
    <div className="min-h-screen pt-20 pb-16 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <Link to="/shop" className="inline-flex items-center gap-2 text-slate-500 hover:text-brand-primary transition-colors mb-8 md:mb-12 group">
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Shop
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 mb-16 md:mb-24">
          {/* Images */}
          <div className="space-y-4 md:space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative aspect-square overflow-hidden rounded-2xl md:rounded-[2.5rem] shadow-2xl bg-white border border-slate-100"
            >
              <img 
                src={product.images?.[activeImg] || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1999&auto=format&fit=crop"} 
                className="w-full h-full object-cover" 
                alt={product.name} 
              />
            </motion.div>
            <div className="flex gap-2 md:gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {product.images?.map((img: string, i: number) => (
                <button 
                  key={i} 
                  onClick={() => setActiveImg(i)}
                  className={`relative w-20 md:w-24 aspect-square rounded-xl md:rounded-2xl overflow-hidden border-2 flex-shrink-0 transition-all ${activeImg === i ? "border-brand-accent scale-105" : "border-transparent opacity-60 hover:opacity-100"}`}
                >
                  <img src={img || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=200&auto=format&fit=crop"} className="w-full h-full object-cover" alt="" />
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col">
            <div className="mb-6 md:mb-8">
              <span className="inline-block px-4 py-1 bg-brand-accent/10 text-brand-accent rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest mb-3 md:mb-4">
                {product.categoryId?.name || "Premium Collection"}
              </span>
              <h1 className="text-3xl md:text-5xl font-serif font-bold text-brand-primary mb-3 md:mb-4 leading-tight">{product.name}</h1>
              <div className="flex flex-wrap items-center gap-4 md:gap-6">
                 <div className="flex items-center gap-1 text-brand-accent">
                   {[1,2,3,4,5].map(i => <Star key={i} className={`w-4 h-4 ${i <= Math.round(product.ratings?.average || 5) ? "fill-current" : "text-slate-200"}`} />)}
                   <span className="text-slate-500 text-xs md:text-sm ml-2">({product.ratings?.count || 12} reviews)</span>
                 </div>
                 <div className="h-4 w-px bg-slate-200" />
                 <span className={`text-xs md:text-sm ${product.stock > 0 ? "text-green-600" : "text-red-500"} font-medium`}>
                   {product.stock > 0 ? `In Stock (${product.stock})` : "Out of Stock"}
                 </span>
              </div>
            </div>

            <div className="mb-6 md:mb-8 p-4 md:p-6 bg-white rounded-2xl md:rounded-3xl border border-slate-100 flex items-center justify-between shadow-sm">
              <div>
                <span className="text-slate-400 text-[10px] md:text-xs uppercase tracking-widest font-bold block mb-1">Current Price</span>
                <span className="text-2xl md:text-4xl font-sans font-bold text-brand-primary">
                  {formatPrice(product.discountPrice || product.price)}
                </span>
                {product.discountPrice && (
                  <span className="ml-2 md:ml-3 text-sm md:text-lg text-slate-400 line-through">
                    {formatPrice(product.price)}
                  </span>
                )}
              </div>
              {product.discountPrice && (
                <div className="px-3 py-1 bg-brand-accent text-white rounded-full text-[10px] md:text-xs font-bold">
                  SAVE {Math.round((1 - product.discountPrice / product.price) * 100)}%
                </div>
              )}
            </div>

            <p className="text-slate-600 leading-relaxed mb-6 md:mb-10 text-base md:text-lg">
              {product.description}
            </p>

            <div className="space-y-4 md:space-y-6 mt-auto">
              <div className="flex gap-2 md:gap-4">
                <div className="inline-flex items-center bg-white border border-slate-100 rounded-xl md:rounded-2xl p-1">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center hover:bg-slate-50 rounded-lg md:rounded-xl transition-colors font-bold"
                  >-</button>
                  <span className="w-10 md:w-12 text-center font-bold text-sm md:text-base">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center hover:bg-slate-50 rounded-lg md:rounded-xl transition-colors font-bold"
                  >+</button>
                </div>
                <button 
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0 || isAdding}
                  className={`flex-grow rounded-xl md:rounded-2xl font-bold flex items-center justify-center gap-2 md:gap-3 transition-all active:scale-95 text-sm md:text-base ${isAdding ? "bg-slate-400 text-white scale-105" : "bg-brand-primary text-white hover:shadow-2xl hover:shadow-brand-primary/30"}`}
                >
                  {isAdding ? (
                    <>Added!</>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4 md:w-5 md:h-5" />
                      Add to Basket
                    </>
                  )}
                </button>
                <button className="p-3 md:p-4 bg-white border border-slate-100 rounded-xl md:rounded-2xl hover:text-red-500 transition-colors">
                  <Heart className="w-5 h-5 md:w-6 md:h-6" />
                </button>
              </div>

              {/* Badges */}
              <div className="grid grid-cols-3 gap-2 md:gap-4 pt-4 md:pt-8">
                <div className="p-3 md:p-4 bg-slate-50 rounded-xl md:rounded-2xl flex flex-col items-center text-center">
                  <Truck className="w-4 h-4 md:w-5 md:h-5 mb-1 md:mb-2 text-brand-accent" />
                  <span className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-slate-400">Shipping</span>
                </div>
                <div className="p-3 md:p-4 bg-slate-50 rounded-xl md:rounded-2xl flex flex-col items-center text-center">
                  <RefreshCcw className="w-4 h-4 md:w-5 md:h-5 mb-1 md:mb-2 text-brand-accent" />
                  <span className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-slate-400">Returns</span>
                </div>
                <div className="p-3 md:p-4 bg-slate-50 rounded-xl md:rounded-2xl flex flex-col items-center text-center">
                   <ShieldCheck className="w-4 h-4 md:w-5 md:h-5 mb-1 md:mb-2 text-brand-accent" />
                  <span className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-slate-400">Secure</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="pt-20 border-t border-slate-100">
            <div className="flex justify-between items-end mb-12">
              <div>
                <span className="text-brand-accent font-bold tracking-[0.2em] uppercase text-[10px] mb-2 block">Curation</span>
                <h2 className="text-4xl font-serif font-bold text-brand-primary">You May Also Like</h2>
              </div>
              <Link to={`/shop?category=${product.categoryId?.slug}`} className="flex items-center gap-2 text-sm font-bold text-brand-primary hover:gap-3 transition-all group">
                View Collection <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {relatedProducts.map((p, idx) => (
                <motion.div 
                  key={p._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="group"
                >
                  <Link to={`/product/${p._id}`}>
                    <div className="aspect-[4/5] rounded-[2rem] overflow-hidden mb-4 relative shadow-sm border border-slate-50">
                      <img 
                        src={p.images?.[0] ||  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1999&auto=format&fit=crop"} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
                        alt={p.name} 
                      />
                      <div className="absolute inset-0 bg-brand-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div>
                      <h4 className="text-lg font-serif font-bold text-brand-primary group-hover:text-brand-accent transition-colors line-clamp-1">{p.name}</h4>
                      <p className="text-sm font-medium text-slate-400">{formatPrice(p.discountPrice || p.price)}</p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;

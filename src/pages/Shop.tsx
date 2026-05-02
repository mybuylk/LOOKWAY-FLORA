import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useSearchParams } from "react-router-dom";
import { Filter, ChevronDown, SlidersHorizontal, Search, ShoppingBag, X, Check } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { formatPrice } from "../lib/utils";

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "";
  
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    category: initialCategory,
    sort: "newest",
    search: ""
  });

  // Sync filter when URL category changes
  useEffect(() => {
    const urlCategory = searchParams.get("category") || "";
    if (urlCategory !== filter.category) {
      setFilter(prev => ({ ...prev, category: urlCategory }));
    }
  }, [searchParams]);

  // Update URL when category filter changes
  const handleCategoryChange = (slug: string) => {
    setFilter({ ...filter, category: slug });
    if (slug) {
      setSearchParams({ category: slug });
    } else {
      const newParams = new URLSearchParams(searchParams);
      newParams.delete("category");
      setSearchParams(newParams);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          axios.get(`/api/products?category=${filter.category}&sort=${filter.sort}&search=${filter.search}`),
          axios.get("/api/categories")
        ]);
        setProducts(prodRes.data);
        setCategories(catRes.data);
      } catch (err) {
        console.error("Error fetching shop data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [filter]);

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 bg-[#FCFAF7]">
      <div className="max-w-7xl mx-auto relative">
        {/* Header Section */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-[10px] font-black text-brand-accent uppercase tracking-[0.5em] mb-6 block">The Permanent Collection</span>
            <h1 className="text-7xl md:text-8xl font-serif font-bold text-brand-primary mb-8 tracking-tight">Gallery of Flora</h1>
            <p className="text-slate-500 max-w-2xl mx-auto text-xl italic serif leading-relaxed">
              Curating rare specimens and masterful arrangements for the modern interior. Each piece is a living testament to nature's design.
            </p>
          </motion.div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6 bg-[#FCFAF7] py-6 px-4 md:px-8 rounded-[2rem] border border-slate-100 shadow-sm">
          <div className="w-full md:w-auto relative flex-grow max-w-md">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
            <input 
              type="text" 
              placeholder="Search botanical database..." 
              className="w-full pl-14 pr-6 py-4 bg-white border border-slate-100 rounded-full text-sm focus:ring-4 focus:ring-brand-accent/10 focus:border-brand-accent focus:outline-none transition-all placeholder:text-slate-300"
              value={filter.search}
              onChange={(e) => setFilter({...filter, search: e.target.value})}
            />
          </div>
          
          <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Order By</span>
            <select 
              className="bg-transparent font-black text-xs text-brand-primary cursor-pointer outline-none uppercase tracking-widest text-right"
              value={filter.sort}
              onChange={(e) => setFilter({...filter, sort: e.target.value})}
            >
              <option value="newest">Latest</option>
              <option value="price_low">Price Ascending</option>
              <option value="price_high">Price Descending</option>
              <option value="popular">Coveted</option>
            </select>
          </div>
        </div>

        {/* Categories Tabs */}
        <div className="flex overflow-x-auto gap-3 pb-4 mb-12 scrollbar-none -mx-6 px-6 md:mx-0 md:px-0">
          <button 
            onClick={() => setFilter({ ...filter, category: "" })}
            className={`flex-shrink-0 px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
              !filter.category ? 'bg-brand-primary text-white shadow-xl shadow-brand-primary/20' : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-100'
            }`}
          >
            Full Gallery
          </button>
          {categories.map((cat: any) => (
            <button 
              key={cat._id}
              onClick={() => setFilter({ ...filter, category: cat.slug })}
              className={`flex-shrink-0 px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
                filter.category === cat.slug ? 'bg-brand-primary text-white shadow-xl shadow-brand-primary/20' : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-100'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="block">
          {/* Product Grid Container */}
          <div className="w-full">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-16">
                {[1,2,3,4].map(i => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-[4/5] bg-slate-100 rounded-[3rem] mb-8 shadow-sm" />
                    <div className="h-10 bg-slate-100 rounded-2xl w-3/4 mb-4" />
                    <div className="h-6 bg-slate-100 rounded-2xl w-1/4" />
                  </div>
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-x-16 gap-y-24">
                {products.map((product: any, idx: number) => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1, duration: 0.8 }}
                    key={product._id} 
                    className="group"
                  >
                    <div className="relative aspect-[4/5] overflow-hidden rounded-[3.5rem] mb-10 shadow-sm group-hover:shadow-2xl transition-all duration-700 border border-slate-100/50">
                      <img 
                        src={product.images?.[0] || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1999&auto=format&fit=crop"} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s] ease-out" 
                        alt={product.name} 
                      />
                      
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-brand-primary opacity-0 group-hover:opacity-10 transition-opacity duration-700" />
                      
                      {/* Action Buttons */}
                      <div className="absolute inset-x-8 bottom-10 flex items-center justify-between opacity-0 group-hover:opacity-100 translate-y-6 group-hover:translate-y-0 transition-all duration-700 delay-100">
                        <Link 
                          to={`/product/${product._id}`}
                          className="px-10 py-5 bg-white text-brand-primary text-[10px] font-black uppercase tracking-[0.2em] rounded-full shadow-2xl hover:bg-brand-primary hover:text-white transition-all active:scale-95"
                        >
                          Acquire Specimen
                        </Link>
                        <button className="p-5 bg-brand-accent text-white rounded-full shadow-2xl hover:scale-110 active:scale-90 transition-all">
                          <ShoppingBag className="w-6 h-6" />
                        </button>
                      </div>

                      {product.discountPrice ? (
                        <div className="absolute top-10 left-10 bg-brand-accent text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl">
                          Special Reserve
                        </div>
                      ) : (
                        idx === 0 && (
                          <div className="absolute top-10 left-10 bg-brand-primary text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl">
                            Premier Debut
                          </div>
                        )
                      )}
                    </div>
                    
                    <div className="px-6 text-center">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-4">
                        {product.categoryId?.name || "Botanical Reserve"}
                      </p>
                      <Link to={`/product/${product._id}`}>
                        <h3 className="font-serif text-4xl font-bold text-brand-primary mb-4 tracking-tight group-hover:text-brand-accent transition-colors duration-500">
                          {product.name}
                        </h3>
                      </Link>
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-xl font-bold text-brand-accent">
                          {formatPrice(product.discountPrice || product.price)}
                        </span>
                        {product.discountPrice && (
                          <span className="text-slate-300 text-xs line-through tracking-widest uppercase font-black">
                            {formatPrice(product.price)}
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-60 glass rounded-[4rem] border-none shadow-sm flex flex-col items-center"
              >
                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-10 shadow-inner">
                  <X className="w-12 h-12 text-slate-200" />
                </div>
                <h3 className="text-3xl font-serif text-slate-800 mb-4 italic">The Vault is Silent</h3>
                <p className="text-slate-400 max-w-sm text-lg leading-relaxed italic">Your refinement criteria yielded no matches within our current exhibition.</p>
                <button 
                  onClick={() => setFilter({ category: "", sort: "newest", search: "" })}
                  className="mt-12 text-brand-accent font-black text-xs uppercase tracking-[0.3em] border-b-2 border-brand-accent pb-2 hover:text-brand-primary hover:border-brand-primary transition-all"
                >
                  Reset Archive filters
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;

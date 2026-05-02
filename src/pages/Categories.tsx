import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Package, ArrowRight, Layers } from "lucide-react";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("/api/categories");
        setCategories(res.data);
      } catch (err) {
        console.error("Error fetching categories:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 bg-slate-50/30">
      <div className="max-w-7xl mx-auto">
        <header className="mb-16 text-center max-w-2xl mx-auto">
          <h1 className="text-5xl font-serif font-bold text-brand-primary mb-6">Market Departments</h1>
          <p className="text-slate-500 italic">
            Precision curated selections for the modern lifestyle, organized by industry and innovation.
          </p>
        </header>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square bg-slate-100 rounded-[2.5rem] mb-6" />
                <div className="h-8 bg-slate-100 rounded w-1/2 mx-auto" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {categories.map((category: any, index: number) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                key={category._id}
                className="group relative"
              >
                <Link to={`/shop?category=${category.slug}`}>
                  <div className="aspect-square rounded-[2.5rem] overflow-hidden mb-6 relative shadow-sm border border-slate-100">
                    <img
                      src={category.imageUrl || "https://images.unsplash.com/photo-1517705008128-361805f42e86?q=80&w=1987&auto=format&fit=crop"}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                    />
                    <div className="absolute inset-0 bg-brand-primary/10 group-hover:bg-brand-primary/20 transition-colors" />
                    <div className="absolute inset-0 flex items-center justify-center">
                       <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100">
                          <ArrowRight className="text-white w-8 h-8" />
                       </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <h3 className="text-2xl font-serif font-bold text-brand-primary mb-2 group-hover:text-brand-accent transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-sm text-slate-400 font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                       <Layers className="w-3 h-3 text-brand-accent" />
                       Explore Dept
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {!loading && categories.length === 0 && (
          <div className="text-center py-40">
            <Package className="w-12 h-12 text-slate-200 mx-auto mb-4" />
            <h3 className="text-xl font-serif text-slate-400">No departments found yet...</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories;

import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Box, ShieldCheck, Truck, Zap } from "lucide-react";
import { motion } from "motion/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import axios from "axios";

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  const heroRef = useRef(null);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("/api/categories");
        setCategories(res.data.slice(0, 3));
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".hero-title", {
        y: 100,
        opacity: 0,
        duration: 1.2,
        ease: "power4.out",
        stagger: 0.2
      });

      gsap.to(".hero-img", {
        yPercent: 20,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero-section",
          start: "top top",
          end: "bottom top",
          scrub: true
        }
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={heroRef} className="overflow-hidden">
      {/* Hero Section */}
      <section className="hero-section relative min-h-screen flex items-center pt-20 px-6 bg-slate-50">
        <div className="absolute inset-0 z-0 overflow-hidden">
           <div className="absolute top-0 right-0 w-1/2 h-full bg-brand-accent/5 skew-x-12 translate-x-20" />
        </div>

        <div className="max-w-7xl mx-auto w-full relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="space-y-6 lg:space-y-8">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 lg:px-4 lg:py-2 bg-brand-accent/10 border border-brand-accent/10 rounded-full text-brand-accent text-[10px] lg:text-xs font-bold tracking-wider uppercase"
            >
              <Zap className="w-3 h-3" />
              New Spring Collections Available
            </motion.div>
            
            <h1 className="hero-title text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-bold text-brand-primary leading-[1.1]">
              Elevate Your <br /> 
              <span className="italic font-normal text-brand-accent">Lifestyle.</span>
            </h1>
            
            <p className="hero-title text-base lg:text-lg text-slate-600 max-w-lg leading-relaxed">
              Discover the intersection of innovation and style. From high-performance electronics to curated apparel, we bring the best of the world to your doorstep.
            </p>

            <div className="hero-title flex flex-col sm:flex-row flex-wrap gap-4 pt-2 lg:pt-4">
              <Link to="/shop" className="group px-8 lg:px-10 py-4 lg:py-5 bg-brand-primary text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:shadow-xl hover:shadow-brand-primary/40 transition-all hover:scale-105 active:scale-95">
                Start Shopping
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/categories" className="px-8 lg:px-10 py-4 lg:py-5 bg-white border border-slate-200 text-brand-primary rounded-2xl font-bold hover:border-brand-accent hover:text-brand-accent transition-all text-center">
                Browse Categories
              </Link>
            </div>
          </div>

          <div className="relative">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="relative aspect-square rounded-[2rem_8rem] overflow-hidden shadow-[0_32px_64px_-16px_rgba(15,23,42,0.3)] rotate-3 border-[12px] border-white group hover:rotate-0 transition-all duration-1000"
            >
              <img 
                src="https://i.ibb.co/svzk1kXF/Chat-GPT-Image-Apr-30-2026-06-17-10-PM.png" 
                className="hero-img w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                alt="Luxury Lifestyle Product"
              />
              <div className="absolute inset-0 bg-brand-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            </motion.div>
            
            {/* Floating Badge */}
            <div className="absolute -bottom-10 -left-10 glass p-8 rounded-3xl shadow-2xl max-w-xs animate-bounce" style={{ animationDuration: '6s' }}>
              <div className="flex items-center gap-3 mb-2">
                <ShieldCheck className="text-brand-accent w-6 h-6" />
                <span className="font-bold text-brand-primary uppercase tracking-widest text-[10px]">Verified Quality</span>
              </div>
              <p className="text-xs text-slate-500 font-medium">Every product undergoes rigorous multi-point inspection before shipment.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-32 px-6 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-end mb-20">
          <div>
            <h2 className="text-5xl font-serif font-bold text-brand-primary mb-4">The Essentials</h2>
            <p className="text-slate-500 font-medium">Precision curated collections for every aspect of modern life.</p>
          </div>
          <Link to="/categories" className="text-brand-accent font-bold flex items-center gap-2 hover:gap-3 transition-all pb-2">
             All Departments <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((cat) => (
            <Link to={`/shop?category=${cat.slug || cat.name.toLowerCase()}`} key={cat._id || cat.name} className="group relative h-[600px] overflow-hidden rounded-[3rem]">
              <img src={cat.imageUrl || cat.image || "https://images.unsplash.com/photo-1517705008128-361805f42e86?q=80&w=1987&auto=format&fit=crop"} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={cat.name} />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
              <div className="absolute bottom-12 left-10">
                <span className="text-brand-accent font-bold uppercase tracking-[0.2em] text-[10px] mb-2 block">{cat.description || "Collection"}</span>
                <h3 className="text-4xl font-serif font-bold text-white mb-4">{cat.name}</h3>
                <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center group-hover:bg-white group-hover:text-brand-primary transition-all">
                  <ArrowRight className="w-6 h-6" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Trust Markers */}
      <section className="py-24 px-6 bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="flex flex-col items-center text-center">
            <Truck className="w-12 h-12 text-brand-accent mb-6" />
            <h4 className="font-serif text-xl font-bold mb-2">Global Shipping</h4>
            <p className="text-sm text-slate-500 px-4">Fast, insured delivery to over 150 countries with real-time tracking.</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <Box className="w-12 h-12 text-brand-accent mb-6" />
            <h4 className="font-serif text-xl font-bold mb-2">Premium Packing</h4>
            <p className="text-sm text-slate-500 px-4">Eco-conscious industrial-grade protection for every fragile component.</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <Zap className="w-12 h-12 text-brand-accent mb-6" />
            <h4 className="font-serif text-xl font-bold mb-2">Quick Returns</h4>
            <p className="text-sm text-slate-500 px-4">Hassle-free 30-day return policy for any non-personalized items.</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <ShieldCheck className="w-12 h-12 text-brand-accent mb-6" />
            <h4 className="font-serif text-xl font-bold mb-2">Secure Payments</h4>
            <p className="text-sm text-slate-500 px-4">Protected by industry-standard encryption and anti-fraud protocols.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

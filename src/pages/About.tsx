import React from "react";
import { motion } from "motion/react";
import { Globe, Award, ShieldCheck, Zap, Truck, Users } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-brand-accent font-bold tracking-[0.2em] uppercase text-xs mb-4 block">Innovation & Style</span>
            <h1 className="text-6xl font-serif font-bold text-brand-primary mb-8 leading-tight">
              Crafting Modern <br />
              <span className="italic text-brand-accent font-normal">Brand Experiences</span> Since 2012
            </h1>
            <p className="text-slate-600 text-lg leading-relaxed mb-8">
              Welcome to Lookway Flora, where we believe quality items shouldn't be a luxury. What started as an innovative tech boutique
              has evolved into a global destination for curated electronics, designer apparel, and essential lifestyle goods. Our mission is to integrate 
              functionality with your most precious moments.
            </p>
            <div className="grid grid-cols-2 gap-8">
              <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm">
                <Globe className="text-brand-accent w-8 h-8 mb-4" />
                <h3 className="font-serif font-bold text-brand-primary mb-2">Global Access</h3>
                <p className="text-xs text-slate-500">Sourcing unique products from top innovators worldwide.</p>
              </div>
              <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm">
                <ShieldCheck className="text-brand-accent w-8 h-8 mb-4" />
                <h3 className="font-serif font-bold text-brand-primary mb-2">Quality First</h3>
                <p className="text-xs text-slate-500">Every item undergoes rigorous multi-point testing.</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="aspect-[4/5] rounded-[3rem] overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1519337265831-281ec6cc8514?q=80&w=2070&auto=format&fit=crop" 
                alt="Florist at work" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-8 -left-8 glass p-8 rounded-3xl max-w-[240px]">
              <p className="text-sm font-serif italic text-brand-primary">
                "We don't just sell products; we cultivate a lifestyle that empowers your daily routine."
              </p>
              <p className="text-[10px] font-bold text-brand-accent mt-4 uppercase tracking-widest">
                — Alex Lookway, CEO
              </p>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-20 border-t border-slate-100">
          <div>
            <Truck className="text-brand-accent w-10 h-10 mb-6" />
            <h4 className="text-xl font-serif font-bold text-brand-primary mb-3">Priority Logistics</h4>
            <p className="text-sm text-slate-500 leading-relaxed">
              Our advanced supply chain ensures your products arrive faster and safer than ever before.
            </p>
          </div>
          <div>
            <Zap className="text-brand-accent w-10 h-10 mb-6" />
            <h4 className="text-xl font-serif font-bold text-brand-primary mb-3">Cutting Edge</h4>
            <p className="text-sm text-slate-500 leading-relaxed">
              We stay ahead of the curve, bringing you the latest technological innovations before they hit the mass market.
            </p>
          </div>
          <div>
             <Users className="text-brand-accent w-10 h-10 mb-6" />
            <h4 className="text-xl font-serif font-bold text-brand-primary mb-3">Customer Focus</h4>
            <p className="text-sm text-slate-500 leading-relaxed">
              Our 24/7 dedicated support team ensures every marketplace interaction is seamless and rewarding.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;

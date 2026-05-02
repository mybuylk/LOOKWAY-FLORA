import React from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { motion } from "motion/react";

const Contact = () => {
  return (
    <div className="min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-16">
          <h1 className="text-5xl font-serif font-bold text-brand-green mb-6">Contact Us</h1>
          <p className="text-zinc-500 max-w-2xl">
            Have questions about our arrangements or need a custom design? Reach out to our floral experts.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="space-y-12">
              <div className="flex gap-6">
                 <div className="p-4 bg-brand-green text-white rounded-2xl h-fit">
                    <Mail className="w-6 h-6" />
                 </div>
                 <div>
                    <h3 className="text-xl font-serif font-bold text-brand-green mb-2">Email Us</h3>
                    <p className="text-zinc-500 mb-4">Our team typically responds within 24 hours.</p>
                    <a href="mailto:hello@lookwayflora.com" className="text-brand-sage font-bold hover:underline">hello@lookwayflora.com</a>
                 </div>
              </div>

              <div className="flex gap-6">
                 <div className="p-4 bg-brand-green text-white rounded-2xl h-fit">
                    <Phone className="w-6 h-6" />
                 </div>
                 <div>
                    <h3 className="text-xl font-serif font-bold text-brand-green mb-2">Call Us</h3>
                    <p className="text-zinc-500 mb-4">Monday - Friday, 9am - 6pm EST.</p>
                    <a href="tel:+15550001234" className="text-brand-sage font-bold hover:underline">+1 (555) 000-1234</a>
                 </div>
              </div>

              <div className="flex gap-6">
                 <div className="p-4 bg-brand-green text-white rounded-2xl h-fit">
                    <MapPin className="w-6 h-6" />
                 </div>
                 <div>
                    <h3 className="text-xl font-serif font-bold text-brand-green mb-2">Visit Our Studio</h3>
                    <p className="text-zinc-500 mb-4">By appointment only.</p>
                    <p className="text-brand-sage font-bold">123 Botanical Ave, NY 10012</p>
                 </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass p-12 rounded-[3rem]"
          >
            <form className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest pl-2">First Name</label>
                  <input type="text" className="w-full bg-white border border-zinc-100 rounded-full px-6 py-4 focus:outline-none focus:ring-2 focus:ring-brand-sage/20 transition-all font-medium" placeholder="Jane" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest pl-2">Last Name</label>
                  <input type="text" className="w-full bg-white border border-zinc-100 rounded-full px-6 py-4 focus:outline-none focus:ring-2 focus:ring-brand-sage/20 transition-all font-medium" placeholder="Doe" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest pl-2">Email Address</label>
                <input type="email" className="w-full bg-white border border-zinc-100 rounded-full px-6 py-4 focus:outline-none focus:ring-2 focus:ring-brand-sage/20 transition-all font-medium" placeholder="jane@example.com" />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest pl-2">Message</label>
                <textarea rows={4} className="w-full bg-white border border-zinc-100 rounded-[2rem] px-6 py-4 focus:outline-none focus:ring-2 focus:ring-brand-sage/20 transition-all font-medium resize-none" placeholder="Tell us about your project or inquiry..." />
              </div>

              <button className="w-full bg-brand-green text-white py-5 rounded-full font-bold flex items-center justify-center gap-3 hover:shadow-xl hover:shadow-brand-green/20 transition-all active:scale-95 group">
                 <span>Send Message</span>
                 <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;

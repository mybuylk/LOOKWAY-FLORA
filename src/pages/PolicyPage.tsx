import React from "react";
import { useLocation } from "react-router-dom";
import { ShieldCheck, Truck, RotateCcw, HelpCircle, FileText } from "lucide-react";
import { motion } from "motion/react";

const PolicyPage = () => {
  const { pathname } = useLocation();
  
  const getContent = () => {
    switch (pathname) {
      case "/shipping":
        return {
          title: "Shipping Policy",
          icon: <Truck className="w-12 h-12 text-brand-sage" />,
          text: "We offer botanical-grade temperature-controlled shipping to ensure your blooms arrive in perfect condition. Standard delivery typically takes 2-4 business days. Same-day delivery is available for select metro areas."
        };
      case "/returns":
        return {
          title: "Returns & Refunds",
          icon: <RotateCcw className="w-12 h-12 text-brand-sage" />,
          text: "Due to the perishable nature of our products, we cannot accept returns once delivered. However, if your arrangements arrive damaged or don't meet our freshness standards, please contact us within 24 hours for a full replacement or refund."
        };
      case "/faq":
        return {
          title: "Frequently Asked Questions",
          icon: <HelpCircle className="w-12 h-12 text-brand-sage" />,
          text: "How do I care for my flowers? Keep them in a cool spot away from direct sunlight. Change the water daily and trim stems at an angle every 2 days. Can I schedule a delivery? Yes, you can choose a delivery date during checkout."
        };
      case "/privacy":
        return {
          title: "Privacy Policy",
          icon: <ShieldCheck className="w-12 h-12 text-brand-sage" />,
          text: "Your privacy is our priority. We only collect information necessary to process your floral orders and provide a personalized experience. We never share your personal data with third-party marketers."
        };
      case "/terms":
        return {
          title: "Terms of Service",
          icon: <FileText className="w-12 h-12 text-brand-sage" />,
          text: "By using LOOKWAY FLORA, you agree to our terms of service regarding order placement, delivery expectations, and payment processing. All floral designs are subject to seasonal availability."
        };
      default:
        return {
          title: "Our Policies",
          icon: <LeafIcon />,
          text: "Please select a specific policy to view more details about our botanical services."
        };
    }
  };

  const LeafIcon = () => (
    <div className="w-12 h-12 bg-brand-green text-white rounded-full flex items-center justify-center font-serif italic text-xl">F</div>
  );

  const content = getContent();

  return (
    <div className="min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass p-16 rounded-[4rem] text-center"
        >
          <div className="flex justify-center mb-8">
            {content.icon}
          </div>
          <h1 className="text-4xl font-serif font-bold text-brand-green mb-8">{content.title}</h1>
          <div className="prose prose-zinc max-w-none">
            <p className="text-zinc-600 text-lg leading-relaxed">
              {content.text}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PolicyPage;

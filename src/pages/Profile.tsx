import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { User, Mail, Shield, Calendar, Package, LogOut, Wallet, Plus, CreditCard, ArrowRight, Check } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { formatPrice, formatDate } from "../lib/utils";

const Profile = () => {
  const { user, logout, token, updateUser } = useAuth();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState<any>(null);
  const [bankDetails, setBankDetails] = useState("");
  const [loading, setLoading] = useState(true);
  
  // Modal state
  const [isTopupModalOpen, setIsTopupModalOpen] = useState(false);
  const [topupAmount, setTopupAmount] = useState("");
  const [depositDate, setDepositDate] = useState("");
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [receipt, setReceipt] = useState<any>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (token) {
          const [res, settingsRes] = await Promise.all([
            axios.get("/api/auth/me"),
            axios.get("/api/settings") // Assuming this exists for public settings
          ]);
          setProfileData(res.data);
          setBankDetails(settingsRes.data.bankDetails || "");
          updateUser({ walletBalance: res.data.walletBalance });
        }
      } catch (error) {
        console.error("Error fetching data", error);
      } finally {
        setLoading(false);
      }
    };
    if (user) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, [user?.id, token]);

  const handleTopup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topupAmount || isNaN(Number(topupAmount)) || Number(topupAmount) <= 0 || !depositDate || !receiptFile) return;
    
    setIsProcessing(true);
    
    const fileToBase64 = (file: File): Promise<string> => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
      });
    };

    try {
      const proof = await fileToBase64(receiptFile);
      const res = await axios.post("/api/auth/wallet/topup", { amount: Number(topupAmount), depositDate, proof });
      
      setReceipt(res.data.transaction);
      setIsProcessing(false);

      if ("Notification" in window) {
        if (Notification.permission === "granted") {
          new Notification("Top-up requested", { body: `Your ${formatPrice(Number(topupAmount))} top-up request is under review.` });
        } else if (Notification.permission !== "denied") {
          Notification.requestPermission().then(permission => {
            if (permission === "granted") {
              new Notification("Top-up requested", { body: `Your ${formatPrice(Number(topupAmount))} top-up request is under review.` });
            }
          });
        }
      }
    } catch (err) {
      console.error("Top-up failed", err);
      setIsProcessing(false);
    }
  };

  if (!user) return <div className="pt-40 text-center font-serif text-brand-green">Please sign in to view your profile.</div>;
  if (loading) return <div className="pt-40 flex justify-center"><div className="w-8 h-8 border-2 border-brand-green border-t-transparent rounded-full animate-spin" /></div>;

  const displayUser = profileData || user;

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 md:px-6 relative">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-brand-green mb-12">Account Settings</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 md:gap-12">
          {/* Action List */}
          <div className="space-y-4 lg:col-span-1">
             <button onClick={() => navigate('/shop')} className="w-full flex items-center justify-between p-4 md:p-6 bg-white border border-zinc-100 rounded-2xl md:rounded-3xl hover:border-brand-sage transition-all group shadow-sm">
                <div className="flex items-center gap-3 md:gap-4">
                  <Package className="w-5 h-5 text-brand-sage" />
                  <span className="font-medium text-xs md:text-sm">ACQUIRE SPECIMEN</span>
                </div>
                <span className="text-zinc-400 group-hover:translate-x-1 transition-transform">→</span>
             </button>
             <button className="w-full flex items-center justify-between p-4 md:p-6 bg-white border border-zinc-100 rounded-2xl md:rounded-3xl hover:border-brand-sage transition-all group shadow-sm">
                <div className="flex items-center gap-3 md:gap-4">
                  <Shield className="w-5 h-5 text-brand-sage" />
                  <span className="font-medium text-xs md:text-sm">Security</span>
                </div>
                <span className="text-zinc-400 group-hover:translate-x-1 transition-transform">→</span>
             </button>
             {user.role === "admin" && (
               <button onClick={() => navigate('/admin')} className="w-full flex items-center justify-between p-4 md:p-6 bg-brand-green/5 border border-brand-green/10 rounded-2xl md:rounded-3xl hover:border-brand-green/30 transition-all group">
                  <div className="flex items-center gap-3 md:gap-4">
                    <Shield className="w-5 h-5 text-brand-green" />
                    <span className="font-medium text-brand-green text-xs md:text-sm">Admin Dashboard</span>
                  </div>
                  <span className="text-brand-green group-hover:translate-x-1 transition-transform">→</span>
               </button>
             )}
             <button onClick={logout} className="w-full flex items-center justify-between p-4 md:p-6 bg-red-50 border border-red-100 rounded-2xl md:rounded-3xl hover:bg-red-100 transition-all group">
                <div className="flex items-center gap-3 md:gap-4">
                  <LogOut className="w-5 h-5 text-red-500" />
                  <span className="font-medium text-red-600 text-xs md:text-sm">Logout</span>
                </div>
             </button>
          </div>

          {/* Details */}
          <div className="lg:col-span-3 space-y-6 md:space-y-8">
            <div className="glass p-6 md:p-10 rounded-2xl md:rounded-[2.5rem] border border-white/40 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-sage/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 md:gap-6 mb-6 md:mb-10 pb-6 md:pb-10 border-b border-black/5 relative z-10 text-center sm:text-left">
                <div className="w-20 h-20 md:w-24 md:h-24 bg-brand-green text-white rounded-full flex items-center justify-center text-2xl md:text-3xl font-serif shrink-0 shadow-xl shadow-brand-green/20">
                  {displayUser.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-serif font-bold text-brand-green">{displayUser.name}</h2>
                  <div className="flex items-center justify-center sm:justify-start gap-3 mt-1 md:mt-2">
                    <span className="px-3 py-1 bg-brand-sage/20 text-brand-green rounded-full text-[9px] md:text-[10px] uppercase font-bold tracking-widest">
                      {displayUser.role} member
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8 relative z-10">
                <div className="flex items-start gap-4 md:gap-5">
                  <div className="p-3 bg-white/60 shadow-sm rounded-xl md:rounded-2xl shrink-0">
                    <Mail className="w-4 h-4 md:w-5 md:h-5 text-brand-green" />
                  </div>
                  <div>
                    <span className="text-[9px] md:text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-1">Email Address</span>
                    <p className="font-medium text-zinc-900 text-sm md:text-base">{displayUser.email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 md:gap-5">
                  <div className="p-3 bg-white/60 shadow-sm rounded-xl md:rounded-2xl shrink-0">
                    <Calendar className="w-4 h-4 md:w-5 md:h-5 text-brand-green" />
                  </div>
                  <div>
                    <span className="text-[9px] md:text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-1">Member Since</span>
                    <p className="font-medium text-zinc-900 text-sm md:text-base">{displayUser.createdAt ? formatDate(displayUser.createdAt) : "Recently"}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Wallet Section */}
            <div className="bg-brand-green rounded-2xl md:rounded-[2.5rem] p-6 md:p-10 text-white relative overflow-hidden shadow-2xl shadow-brand-green/20">
              <div className="absolute top-0 right-0 w-80 h-80 md:w-96 md:h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
              
              <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 md:gap-8 border-b border-white/10 pb-6 md:pb-10">
                <div>
                  <div className="flex items-center gap-2 md:gap-3 mb-2">
                    <Wallet className="w-5 h-5 md:w-6 md:h-6 text-brand-sage" />
                    <h3 className="text-xs md:text-sm font-bold uppercase tracking-widest text-brand-sage">My Wallet</h3>
                  </div>
                  <p className="text-3xl md:text-5xl font-serif font-bold">{formatPrice(displayUser.walletBalance || 0)}</p>
                </div>
                
                <button 
                  onClick={() => setIsTopupModalOpen(true)}
                  className="px-6 md:px-8 py-3 md:py-4 bg-white text-brand-green rounded-full font-bold flex items-center gap-2 md:gap-3 hover:scale-105 active:scale-95 transition-all shadow-xl text-sm md:text-base"
                >
                  <Plus className="w-4 h-4 md:w-5 md:h-5" />
                  Wallet Top-Up
                </button>
              </div>

              {/* Transactions List */}
              <div className="relative z-10 pt-10">
                <h4 className="text-xs font-bold uppercase tracking-widest text-white/50 mb-6">Recent Transactions</h4>
                {displayUser.transactions && displayUser.transactions.length > 0 ? (
                  <div className="space-y-4">
                    {displayUser.transactions.slice().reverse().slice(0, 3).map((tx: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-center bg-white/5 backdrop-blur-md rounded-2xl p-5 border border-white/10">
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-xl ${tx.type === 'deposit' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-white/10 text-white/70'}`}>
                            {tx.type === 'deposit' ? <Plus className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                          </div>
                          <div>
                            <p className="font-bold text-sm capitalize">{tx.type} • {tx.receiptId || "N/A"}</p>
                            <p className="text-xs text-white/50">{formatDate(tx.date)}</p>
                          </div>
                        </div>
                        <span className={`font-bold ${tx.type === 'deposit' ? 'text-emerald-400' : 'text-white'}`}>
                          {tx.type === 'deposit' ? '+' : '-'}{formatPrice(tx.amount)}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-white/50 text-sm">No recent transactions to display.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top-Up Modal */}
      <AnimatePresence>
        {isTopupModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => !isProcessing && setIsTopupModalOpen(false)}
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[2.5rem] p-8 w-full max-w-md relative z-10 shadow-2xl overflow-hidden"
            >
              {isProcessing ? (
                <div className="py-12 flex flex-col items-center justify-center text-center">
                  <div className="text-left w-full mb-8">
                    <h3 className="text-sm font-bold text-brand-accent uppercase tracking-widest mb-1">LOOKWAY FLORA TOPUP</h3>
                    <p className="text-4xl font-bold text-brand-primary">Rs {Number(topupAmount).toFixed(2)}</p>
                    <p className="text-sm text-zinc-500">Transaction amount</p>
                  </div>
                  
                  <div className="relative mb-8">
                    <div className="w-16 h-16 border-4 border-brand-sage/20 rounded-full animate-spin border-t-brand-green" />
                  </div>
                  
                  <p className="text-base text-zinc-700 font-medium max-w-xs">
                    Waiting for confirmation. Please do not close or navigate away from this screen<span className="text-red-500">.</span>
                  </p>
                </div>
              ) : receipt ? (
                <div className="py-8 text-center flex flex-col items-center">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mb-6">
                    <Check className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-zinc-900 mb-2">Deposit Successful</h3>
                  <p className="text-zinc-500 mb-8">Your wallet has been credited securely.</p>
                  
                  <div className="w-full bg-zinc-50 rounded-2xl p-6 text-left mb-8 border border-zinc-100 border-dashed">
                    <div className="flex justify-between mb-2">
                       <span className="text-xs text-zinc-400 font-bold uppercase">Amount</span>
                       <span className="text-sm font-bold text-emerald-600">+{formatPrice(receipt.amount)}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                       <span className="text-xs text-zinc-400 font-bold uppercase">Processed</span>
                       <span className="text-sm font-medium text-zinc-700">{formatDate(receipt.date)}</span>
                    </div>
                    {receipt.depositDate && (
                      <div className="flex justify-between mb-2">
                         <span className="text-xs text-zinc-400 font-bold uppercase">Deposited</span>
                         <span className="text-sm font-medium text-zinc-700">{formatDate(receipt.depositDate)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                       <span className="text-xs text-zinc-400 font-bold uppercase">Receipt ID</span>
                       <span className="text-xs font-mono text-zinc-500">{receipt.receiptId}</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => {
                      setReceipt(null);
                      setIsTopupModalOpen(false);
                      setTopupAmount("");
                    }}
                    className="w-full py-4 bg-brand-green text-white rounded-2xl font-bold hover:shadow-xl hover:shadow-brand-green/20 transition-all active:scale-95"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <>
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-brand-sage/20 text-brand-green rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Wallet className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-serif font-bold text-zinc-900">Wallet Top-Up</h3>
                    <p className="text-sm text-zinc-500 mt-2">Add funds for seamless purchases.</p>
                    {bankDetails && (
                       <div className="mt-4 p-4 bg-zinc-100 rounded-xl text-xs text-zinc-600 font-mono text-left">
                         <p className="font-bold mb-1">Our Bank Details:</p>
                         <p className="whitespace-pre-wrap">{bankDetails}</p>
                       </div>
                    )}
                  </div>
                  
                  <form onSubmit={handleTopup} className="text-left">
                    <div className="mb-4">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-2 pl-2">Top-Up Amount (LKR)</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-zinc-400">Rs.</span>
                        <input 
                          type="number" 
                          placeholder="e.g. 5000"
                          value={topupAmount}
                          onChange={(e) => setTopupAmount(e.target.value)}
                          className="w-full pl-12 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl font-bold text-lg text-zinc-900 focus:outline-none focus:ring-2 focus:ring-brand-sage/30 focus:border-brand-green transition-all"
                          autoFocus
                          required
                          min="1"
                        />
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-2 pl-2">Deposit Date</label>
                      <input 
                        type="date"
                        value={depositDate}
                        onChange={(e) => setDepositDate(e.target.value)}
                        required
                        className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl font-medium text-zinc-900 focus:outline-none focus:ring-2 focus:ring-brand-sage/30 focus:border-brand-green transition-all"
                      />
                    </div>

                    <div className="mb-8">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-2 pl-2">Payment Receipt</label>
                      <input 
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) => setReceiptFile(e.target.files?.[0] || null)}
                        required
                        className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-medium text-zinc-600 focus:outline-none focus:ring-2 focus:ring-brand-sage/30 focus:border-brand-green file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-brand-sage/20 file:text-brand-green hover:file:bg-brand-sage/30 cursor-pointer"
                      />
                    </div>
                    
                    <div className="flex gap-4">
                      <button 
                        type="button"
                        onClick={() => {
                          setIsTopupModalOpen(false);
                          setTopupAmount("");
                          setDepositDate("");
                          setReceiptFile(null);
                        }}
                        className="flex-1 py-3 bg-zinc-100 text-zinc-600 rounded-xl font-bold hover:bg-zinc-200 transition-colors"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit"
                        disabled={!topupAmount || Number(topupAmount) <= 0 || !depositDate || !receiptFile}
                        className="flex-1 py-3 bg-brand-green text-white rounded-xl font-bold disabled:opacity-50 disabled:active:scale-100 hover:shadow-xl hover:shadow-brand-green/20 transition-all active:scale-95"
                      >
                        Topup Now
                      </button>
                    </div>
                  </form>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Profile;

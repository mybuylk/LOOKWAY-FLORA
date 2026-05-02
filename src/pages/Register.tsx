import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User, ArrowRight, Flower2 } from "lucide-react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer"
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await axios.post("/api/auth/register", formData);
      login(res.data.token, res.data.user);
      navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-20">
      <div className="max-w-md w-full glass p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-serif font-bold text-brand-green mb-2">Join the Garden</h1>
            <p className="text-zinc-500 text-sm">Create your Lookway Flora account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-widest pl-4">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-300" />
                <input 
                  type="text" 
                  required
                  className="w-full pl-12 pr-4 py-4 bg-white border border-zinc-100 rounded-2xl focus:ring-4 focus:ring-brand-sage/10 focus:outline-none transition-all"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-widest pl-4">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-300" />
                <input 
                  type="email" 
                  required
                  className="w-full pl-12 pr-4 py-4 bg-white border border-zinc-100 rounded-2xl focus:ring-4 focus:ring-brand-sage/10 focus:outline-none transition-all"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-widest pl-4">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-300" />
                <input 
                  type="password" 
                  required
                  className="w-full pl-12 pr-4 py-4 bg-white border border-zinc-100 rounded-2xl focus:ring-4 focus:ring-brand-sage/10 focus:outline-none transition-all"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-widest pl-4">Role</label>
              <select 
                className="w-full px-6 py-4 bg-white border border-zinc-100 rounded-2xl focus:ring-4 focus:ring-brand-sage/10 focus:outline-none transition-all text-sm appearance-none"
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
              >
                <option value="customer">I'm a Customer</option>
                <option value="vendor">I'm a Vendor</option>
              </select>
            </div>

            {error && <p className="text-red-500 text-xs pl-4">{error}</p>}

            <button 
              disabled={loading}
              className="w-full bg-brand-green text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:shadow-xl hover:shadow-brand-green/20 transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? "Creating Account..." : "Create Account"}
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          <p className="mt-8 text-center text-zinc-500 text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-brand-green font-bold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;

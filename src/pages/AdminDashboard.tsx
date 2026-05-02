import React, { useState, useEffect } from "react";
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  ShoppingBag, 
  BarChart3, 
  Settings, 
  Plus,
  Banknote,
  ArrowUpRight,
  Search,
  Loader2,
  Edit2,
  Trash2,
  Eye,
  MoreVertical,
  X,
  PlusCircle,
  Image as ImageIcon,
  Layers,
  Menu
} from "lucide-react";
import { Link, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { formatPrice } from "../lib/utils";
import axios from "axios";
import { motion, AnimatePresence } from "motion/react";

import { 
  LineElement, 
  PointElement, 
  LinearScale, 
  Title, 
  CategoryScale, 
  Chart as ChartJS, 
  Tooltip, 
  Legend, 
  Filler 
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const StatCard = ({ title, value, change, icon: Icon, color }: any) => (
  <div className="glass p-8 rounded-[2rem] border-none">
    <div className="flex justify-between items-start mb-6">
      <div className={`p-4 rounded-2xl ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div className="flex items-center gap-1 text-green-500 text-sm font-bold">
        <ArrowUpRight className="w-4 h-4" />
        {change}%
      </div>
    </div>
    <span className="text-zinc-500 text-xs font-bold uppercase tracking-widest block mb-2">{title}</span>
    <h3 className="text-3xl font-serif font-bold text-brand-green">{value}</h3>
  </div>
);

const AdminDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [activeProduct, setActiveProduct] = useState<any>(null); // null, 'new', or product object
  const [activeCategory, setActiveCategory] = useState<any>(null); // null, 'new', or category object
  const [viewOrder, setViewOrder] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row relative">
      {/* Mobile Nav Header */}
      <div className="md:hidden flex items-center justify-between p-6 bg-white border-b border-slate-100 z-50 sticky top-0">
        <h1 className="font-serif font-bold text-xl text-brand-primary">Admin</h1>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2">
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed md:sticky top-0 left-0 w-72 bg-white border-r border-slate-100 p-8 flex-col pt-12 h-[100dvh] z-50 transition-transform duration-300 md:translate-x-0 overflow-y-auto flex ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="mb-12">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-[0.3em] mb-6 pl-4 flex items-center justify-between">
            Management
            <button className="md:hidden p-1 hover:bg-slate-50 rounded-lg" onClick={() => setMobileMenuOpen(false)}>
              <X className="w-4 h-4" />
            </button>
          </h2>
          <nav className="space-y-2">
            {[
              { path: "/admin", icon: LayoutDashboard, label: "Overview" },
              { path: "/admin/products", icon: Package, label: "Products" },
              { path: "/admin/categories", icon: Layers, label: "Categories" },
              { path: "/admin/orders", icon: ShoppingBag, label: "Orders" },
              { path: "/admin/users", icon: Users, label: "Customers" },
              { path: "/admin/topups", icon: Banknote, label: "User Topups" },
              { path: "/admin/reports", icon: BarChart3, label: "Analytics" },
            ].map((item) => {
              const isActive = item.path === "/admin" 
                ? location.pathname === "/admin" || location.pathname === "/admin/"
                : location.pathname.startsWith(item.path);

              return (
                <Link 
                  key={item.path}
                  to={item.path} 
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-4 rounded-2xl transition-all ${isActive ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/20" : "text-slate-500 hover:bg-slate-50"}`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto pt-8 border-t border-slate-50 space-y-2">
          <Link to="/admin/settings" onClick={() => setMobileMenuOpen(false)} className={`flex items-center gap-3 px-4 py-4 transition-colors ${location.pathname.startsWith("/admin/settings") ? "text-brand-accent font-bold" : "text-slate-500 hover:text-brand-primary"}`}>
            <Settings className="w-5 h-5" />
            <span className="font-medium">Settings</span>
          </Link>
          <button 
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              window.location.href = "/login";
            }}
            className="flex items-center gap-3 px-4 py-4 w-full text-left text-red-400 hover:bg-red-50 rounded-2xl transition-all"
          >
            <X className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-grow p-4 sm:p-8 md:p-12 overflow-y-auto w-full">
        <div className="max-w-6xl mx-auto">
          <Routes>
            <Route index element={<AdminOverview onNewProduct={() => setActiveProduct('new')} onViewOrder={(o: any) => setViewOrder(o)} />} />
            <Route path="products" element={<AdminProducts onNewProduct={() => setActiveProduct('new')} onEditProduct={(p: any) => setActiveProduct(p)} />} />
            <Route path="categories" element={<AdminCategories onNewCategory={() => setActiveCategory('new')} onEditCategory={(c: any) => setActiveCategory(c)} />} />
            <Route path="orders" element={<AdminOrders onViewOrder={(o: any) => setViewOrder(o)} />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="topups" element={<AdminTopups />} />
            <Route path="reports" element={<AdminReports />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="*" element={<div className="py-20 text-center text-slate-400">Section coming soon...</div>} />
          </Routes>
        </div>
      </main>

      <ProductFormModal 
        isOpen={!!activeProduct} 
        onClose={() => setActiveProduct(null)} 
        product={activeProduct === 'new' ? null : activeProduct} 
      />

      <OrderDetailModal 
        isOpen={!!viewOrder} 
        onClose={() => setViewOrder(null)} 
        order={viewOrder} 
      />

      <CategoryFormModal 
        isOpen={!!activeCategory} 
        onClose={() => setActiveCategory(null)} 
        category={activeCategory === 'new' ? null : activeCategory} 
      />
    </div>
  );
};

const AdminSettings = () => {
  const [settings, setSettings] = useState<any>({ siteTitle: "", contactEmail: "", currencySymbol: "$", bankDetails: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axios.get("/api/admin/settings");
        setSettings(res.data);
      } catch (err) {
        console.error("Error fetching settings:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const saveSettings = async () => {
    try {
      await axios.patch("/api/admin/settings", settings);
      alert("Settings saved!");
    } catch (err) {
      alert("Failed to save settings");
    }
  };

  if (loading) return <div className="py-20 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-slate-400" /></div>;

  return (
    <div>
      <h1 className="text-4xl font-serif font-bold text-brand-primary mb-12">Settings</h1>
      <div className="glass p-10 rounded-[3rem] border-none">
        <div className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Site Title</label>
            <input type="text" value={settings.siteTitle} onChange={e => setSettings({...settings, siteTitle: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Contact Email</label>
            <input type="email" value={settings.contactEmail} onChange={e => setSettings({...settings, contactEmail: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Currency Symbol</label>
            <input type="text" value={settings.currencySymbol} onChange={e => setSettings({...settings, currencySymbol: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Bank Details</label>
            <textarea value={settings.bankDetails} onChange={e => setSettings({...settings, bankDetails: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 h-32" />
          </div>
          <button onClick={saveSettings} className="px-6 py-3 bg-brand-primary text-white rounded-xl font-bold uppercase text-sm">Save Changes</button>
        </div>
      </div>
    </div>
  );
};

const AdminOverview = ({ onNewProduct, onViewOrder }: any) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/api/admin/dashboard");
        setData(res.data);
      } catch (err) {
        console.error("Error fetching admin stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="py-40 flex flex-col items-center justify-center text-slate-400">
        <Loader2 className="w-10 h-10 animate-spin mb-4" />
        <p className="font-serif italic">Loading intelligence...</p>
      </div>
    );
  }

  const { stats, recentOrders } = data || { stats: {}, recentOrders: [] };

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12">
        <div>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-brand-primary mb-2">Omni Dashboard</h1>
          <p className="text-sm text-slate-500">Welcome back, Administrator. Here's your business status.</p>
        </div>
        <div className="flex flex-wrap gap-4 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none px-6 py-3 bg-white border border-slate-200 rounded-full text-sm font-medium hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
            <Search className="w-4 h-4" />
            Quick Search
          </button>
          <button onClick={onNewProduct} className="flex-1 sm:flex-none px-6 py-3 bg-brand-primary text-white rounded-full text-sm font-medium hover:shadow-xl transition-all flex items-center justify-center gap-2">
            <Plus className="w-4 h-4" />
            Add Product
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        <StatCard title="Total Revenue" value={formatPrice(stats.revenue || 0)} change="12.5" icon={Banknote} color="bg-emerald-500" />
        <StatCard title="Total Orders" value={stats.orders || 0} change="8.2" icon={ShoppingBag} color="bg-brand-accent" />
        <StatCard title="Active Users" value={stats.users || 0} change="24.1" icon={Users} color="bg-brand-primary" />
      </div>

      {/* Analytics Chart */}
      <div className="glass p-10 rounded-[3rem] border-none mb-12">
        <div className="flex justify-between items-center mb-10">
           <div>
             <h3 className="text-2xl font-serif font-bold text-brand-primary">Sales Performance</h3>
             <p className="text-xs text-slate-400">Monthly revenue trends</p>
           </div>
           <select className="bg-slate-50 border-none rounded-xl px-4 py-2 text-xs font-bold outline-none">
             <option>Last 6 Months</option>
             <option>Last Year</option>
           </select>
        </div>
        <div className="h-80">
          <Line 
            data={{
              labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
              datasets: [{
                label: "Monthly Revenue",
                data: [12000, 19000, 15000, 25000, 22000, 30000],
                borderColor: "#2563EB",
                backgroundColor: "rgba(37, 99, 235, 0.05)",
                fill: true,
                tension: 0.4,
                pointRadius: 6,
                pointBackgroundColor: "#fff",
                pointBorderWidth: 2,
              }]
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { display: false } },
              scales: {
                y: { grid: { display: false }, ticks: { font: { size: 10 } } },
                x: { grid: { display: false }, ticks: { font: { size: 10 } } }
              }
            }}
          />
        </div>
      </div>

      {/* Table Area */}
      <div className="glass p-10 rounded-[3rem] border-none">
        <div className="flex justify-between items-center mb-10">
          <h3 className="text-2xl font-serif font-bold text-brand-primary">Recent Orders</h3>
          <Link to="/admin/orders" className="text-brand-accent text-sm font-bold border-b border-brand-accent hover:opacity-80 transition-opacity">View All Orders</Link>
        </div>
        
        <div className="overflow-x-auto">
          {recentOrders.length > 0 ? (
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Order ID</th>
                  <th className="py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Customer</th>
                  <th className="py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Date</th>
                  <th className="py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Total</th>
                  <th className="py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Review</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-sm">
                {recentOrders.map((order: any) => (
                  <tr key={order._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-6 font-bold text-brand-primary">#{order._id?.toString().slice(-6).toUpperCase()}</td>
                    <td className="py-6 font-medium text-slate-700">{order.userId?.name || "Guest"}</td>
                    <td className="py-6">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        order.status === 'delivered' ? 'bg-green-50 text-green-700' : 
                        order.status === 'pending' ? 'bg-amber-50 text-amber-700' : 
                        order.status === 'cancelled' ? 'bg-red-50 text-red-700' :
                        order.status === 'returned' ? 'bg-purple-50 text-purple-700' : 'bg-blue-50 text-blue-700'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-6 text-slate-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="py-6 font-bold text-slate-900">{formatPrice(order.total)}</td>
                    <td className="py-6 text-right">
                      <button 
                         onClick={() => onViewOrder(order)}
                         className="p-2 text-slate-400 hover:text-brand-primary transition-colors hover:bg-slate-100 rounded-lg"
                      >
                         <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="py-10 text-center text-slate-400 italic">No orders yet...</div>
          )}
        </div>
      </div>
    </>
  );
};

const AdminProducts = ({ onNewProduct, onEditProduct }: any) => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/products");
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products for admin:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await axios.delete(`/api/products/${id}`);
      setProducts(products.filter(p => p._id !== id));
    } catch (err) {
      alert("Failed to delete product");
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12">
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-brand-primary">Inventory Management</h1>
        <button onClick={onNewProduct} className="w-full sm:w-auto px-6 py-3 bg-brand-primary text-white rounded-full text-sm font-medium hover:shadow-xl transition-all flex items-center justify-center gap-2">
          <Plus className="w-4 h-4" />
          New Product
        </button>
      </div>

      <div className="glass p-10 rounded-[3rem] border-none">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Product</th>
                <th className="py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Category</th>
                <th className="py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Price</th>
                <th className="py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Stock</th>
                <th className="py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right px-6">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {products.map((product) => (
                <tr key={product._id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                        <img 
                          src={product.images?.[0] || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=200&auto=format&fit=crop"} 
                          className="w-full h-full object-cover" 
                          alt={product.name} 
                        />
                      </div>
                      <span className="font-bold text-brand-primary line-clamp-1">{product.name}</span>
                    </div>
                  </td>
                  <td className="py-6 text-sm text-slate-500">{product.categoryId?.name || "Uncategorized"}</td>
                  <td className="py-6 font-medium text-slate-900">{formatPrice(product.price)}</td>
                  <td className="py-6 text-sm text-slate-500">{product.stock} units</td>
                  <td className="py-6 text-sm">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      product.stock > 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                    }`}>
                      {product.stock > 0 ? "In Stock" : "Out of Stock"}
                    </span>
                  </td>
                  <td className="py-6 px-6">
                    <div className="flex justify-end gap-2">
                       <button 
                         onClick={() => onEditProduct(product)}
                         className="p-2 text-slate-400 hover:text-brand-primary transition-colors hover:bg-slate-100 rounded-lg"
                       >
                         <Edit2 className="w-4 h-4" />
                       </button>
                       <button onClick={() => handleDelete(product._id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors hover:bg-red-50 rounded-lg">
                         <Trash2 className="w-4 h-4" />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const AdminOrders = ({ onViewOrder }: any) => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("/api/admin/orders");
        setOrders(res.data);
      } catch (err) {
        console.error("Error fetching orders for admin:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      await axios.patch(`/api/admin/orders/${orderId}`, { status });
      // In a real app, refresh orders list
      setOrders(orders.map(o => o._id === orderId ? { ...o, status } : o));
    } catch (err) {
      console.error("Error updating order status:", err);
      alert("Failed to update order status");
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-4xl font-serif font-bold text-brand-primary mb-12">Order Logs</h1>
      <div className="glass p-10 rounded-[3rem] border-none text-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Order ID</th>
                <th className="py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Customer</th>
                <th className="py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
                <th className="py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Quantity</th>
                <th className="py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Total</th>
                <th className="py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right px-6">Manage</th>
                <th className="py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right px-6">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-6 font-bold text-brand-primary">#{order._id?.toString().slice(-6).toUpperCase()}</td>
                  <td className="py-6">
                    <div className="flex flex-col text-xs">
                      <span className="font-bold text-slate-900">{order.userId?.name || "Guest"}</span>
                      <span className="text-slate-400">{order.userId?.email || "N/A"}</span>
                    </div>
                  </td>
                  <td className="py-6">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      order.status === 'delivered' ? 'bg-green-50 text-green-700' : 
                      order.status === 'pending' ? 'bg-amber-50 text-amber-700' : 
                      order.status === 'cancelled' ? 'bg-red-50 text-red-700' :
                      order.status === 'returned' ? 'bg-purple-50 text-purple-700' : 'bg-blue-50 text-blue-700'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-6 text-slate-500">{order.items?.length || 0} items</td>
                  <td className="py-6 font-bold text-slate-900">{formatPrice(order.total)}</td>
                  <td className="py-6 px-6 text-right">
                    <button 
                      onClick={() => onViewOrder(order)}
                      className="p-2 text-slate-400 hover:text-brand-primary transition-colors hover:bg-slate-100 rounded-lg"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                  <td className="py-6 px-6 text-right">
                    <div className="flex gap-2 justify-end">
                      <button 
                         onClick={() => onViewOrder(order)}
                         className="p-2 text-slate-400 hover:text-brand-primary transition-colors hover:bg-slate-100 rounded-lg"
                      >
                         <Edit2 className="w-4 h-4" />
                      </button>
                      <div className="flex gap-1" >
                        {order.status !== 'pending' && (
                          <button onClick={() => updateOrderStatus(order._id, 'pending')} className="text-[9px] font-bold uppercase bg-slate-100 px-2 py-1 rounded">PEND</button>
                        )}
                        {order.status !== 'processing' && (
                          <button onClick={() => updateOrderStatus(order._id, 'processing')} className="text-[9px] font-bold uppercase bg-blue-50 text-blue-700 px-2 py-1 rounded">PROC</button>
                        )}
                        {order.status !== 'delivered' && (
                          <button onClick={() => updateOrderStatus(order._id, 'delivered')} className="text-[9px] font-bold uppercase bg-green-50 text-green-700 px-2 py-1 rounded">DELV</button>
                        )}
                        {order.status !== 'cancelled' && (
                          <button onClick={() => updateOrderStatus(order._id, 'cancelled')} className="text-[9px] font-bold uppercase bg-red-50 text-red-700 px-2 py-1 rounded">CANC</button>
                        )}
                        {order.status !== 'returned' && (
                          <button onClick={() => updateOrderStatus(order._id, 'returned')} className="text-[9px] font-bold uppercase bg-purple-50 text-purple-700 px-2 py-1 rounded">RETN</button>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {orders.length === 0 && <div className="py-10 text-center text-slate-400 italic">No orders recorded yet.</div>}
        </div>
      </div>
    </div>
  );
};

const AdminUsers = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("/api/admin/users");
        setUsers(res.data);
      } catch (err) {
        console.error("Error fetching users for admin:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const updateUserRole = async (userId: string, role: string) => {
    try {
      await axios.patch(`/api/admin/users/${userId}`, { role });
      setUsers(users.map(u => u._id === userId ? { ...u, role } : u));
    } catch (err) {
      console.error("Error updating user role:", err);
      alert("Failed to update user role");
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-4xl font-serif font-bold text-brand-primary mb-12">Customer Directory</h1>
      <div className="glass p-10 rounded-[3rem] border-none text-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Name</th>
                <th className="py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Email</th>
                <th className="py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Role</th>
                <th className="py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Joined</th>
                <th className="py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right px-6">Manage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {users.map((u) => (
                <tr key={u._id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-6 font-bold text-slate-900">{u.name}</td>
                  <td className="py-6 text-slate-500">{u.email}</td>
                  <td className="py-6">
                    <select 
                      value={u.role} 
                      onChange={(e) => updateUserRole(u._id, e.target.value)} 
                      className="bg-slate-50 font-bold text-[10px] uppercase p-2 border rounded-full border-slate-200"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="py-6 text-slate-400">{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td className="py-6 px-6 text-right">
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const AdminTopups = () => {
  const [topups, setTopups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchTopups = async () => {
      try {
        const res = await axios.get("/api/admin/topups");
        setTopups(res.data);
      } catch (err) {
        console.error("Error fetching topups:", err);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchTopups();
  }, []);

  const approveTopup = async (receiptId: string) => {
    try {
      await axios.post("/api/admin/topups/approve", { receiptId });
      fetchTopups(); // Refresh list
    } catch (err: any) {
      console.error("Error approving topup:", err);
      const message = err.response?.data?.message || "Failed to approve topup";
      alert("Error: " + message);
    }
  };

  const rejectTopup = async (receiptId: string) => {
    if (!window.confirm("Are you sure you want to reject this topup?")) return;
    try {
      await axios.post("/api/admin/topups/reject", { receiptId });
      fetchTopups(); // Refresh list
    } catch (err: any) {
      console.error("Error rejecting topup:", err);
      const message = err.response?.data?.message || "Failed to reject topup";
      alert("Error: " + message);
    }
  };

  const filteredTopups = topups.filter(t => 
    t.user?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.receiptId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12">
        <h1 className="text-4xl font-serif font-bold text-brand-primary">User Wallet Topups</h1>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by email or receipt..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white rounded-full border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
          />
        </div>
      </div>
      <div className="glass p-10 rounded-[3rem] border-none text-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Receipt ID</th>
                <th className="py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">User</th>
                <th className="py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Amount</th>
                <th className="py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Processed On</th>
                <th className="py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Deposited On</th>
                <th className="py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Proof</th>
                <th className="py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredTopups.map((t, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-6 font-mono text-xs text-brand-primary font-bold">{t.receiptId || "N/A"}</td>
                  <td className="py-6">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-900">{t.user?.name}</span>
                      <span className="text-xs text-slate-500">{t.user?.email}</span>
                    </div>
                  </td>
                  <td className="py-6 font-bold text-emerald-600">+{formatPrice(t.amount)}</td>
                  <td className="py-6 text-slate-500">{new Date(t.date).toLocaleString()}</td>
                  <td className="py-6 text-slate-500">
                    {t.depositDate ? (
                      <span className="text-emerald-600 font-bold">{new Date(t.depositDate).toLocaleString()}</span>
                    ) : (
                      <span className="text-amber-500 font-bold">Pending</span>
                    )}
                  </td>
                  <td className="py-6">
                    {t.proof ? (
                      <a href={t.proof} target="_blank" rel="noopener noreferrer" className="block w-12 h-12 rounded-lg overflow-hidden border border-slate-200">
                        <img src={t.proof} alt="Proof" className="w-full h-full object-cover" />
                      </a>
                    ) : (
                      <span className="text-slate-400 text-xs">No proof</span>
                    )}
                  </td>
                  <td className="py-6">
                    {!t.depositDate ? (
                      <div className="flex gap-2">
                        <button 
                          onClick={() => approveTopup(t.receiptId)}
                          className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-colors font-bold text-xs uppercase"
                        >
                          Approve
                        </button>
                        <button 
                          onClick={() => rejectTopup(t.receiptId)}
                          className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors font-bold text-xs uppercase"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-slate-400 text-xs font-bold uppercase">Approved</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredTopups.length === 0 && <div className="py-10 text-center text-slate-400 italic">No matching topups found.</div>}
        </div>
      </div>
    </div>
  );
};

const AdminReports = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await axios.get("/api/admin/analytics");
        setData(res.data);
      } catch (err) {
        console.error("Error fetching analytics:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    );
  }

  const chartData = {
    labels: data.map(d => d._id),
    datasets: [
      {
        label: "Revenue",
        data: data.map(d => d.revenue),
        borderColor: "#2563EB",
        backgroundColor: "rgba(37, 99, 235, 0.1)",
        fill: true,
        tension: 0.4,
      },
      {
        label: "Orders",
        data: data.map(d => d.orders * 100), // Scaled for visibility on same chart
        borderColor: "#F59E0B",
        backgroundColor: "transparent",
        borderDash: [5, 5],
        tension: 0.4,
      }
    ]
  };

  return (
    <div>
      <h1 className="text-4xl font-serif font-bold text-brand-primary mb-12">Business Intelligence</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="glass p-10 rounded-[3rem] border-none">
          <h3 className="text-xl font-bold text-brand-primary mb-6">Revenue Growth (Last 30 Days)</h3>
          <div className="h-64">
            <Line 
              data={chartData} 
              options={{ 
                responsive: true, 
                maintainAspectRatio: false,
                plugins: { legend: { position: 'bottom' } }
              }} 
            />
          </div>
        </div>

        <div className="glass p-10 rounded-[3rem] border-none flex flex-col justify-center items-center text-center">
          <BarChart3 className="w-16 h-16 text-slate-200 mb-4" />
          <h3 className="text-xl font-bold text-slate-900 mb-2">Deep Insights</h3>
          <p className="text-slate-500 text-sm max-w-xs">
            Our algorithms are crunching data to provide predictive trends for your botanical garden's next season.
          </p>
        </div>
      </div>

      <div className="glass p-10 rounded-[3rem] border-none">
        <h3 className="text-xl font-bold text-brand-primary mb-6">Daily Metric breakdown</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 italic text-slate-400">
                <th className="py-4">Date</th>
                <th className="py-4">Orders</th>
                <th className="py-4">Revenue</th>
                <th className="py-4">AOV</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {data.map((d) => (
                <tr key={d._id} className="hover:bg-slate-50/50">
                  <td className="py-4 font-medium">{d._id}</td>
                  <td className="py-4">{d.orders}</td>
                  <td className="py-4 font-bold text-emerald-600">{formatPrice(d.revenue)}</td>
                  <td className="py-4 text-slate-500">{formatPrice(d.orders > 0 ? d.revenue / d.orders : 0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const ProductFormModal = ({ isOpen, onClose, product }: any) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    image: ""
  });
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      axios.get("/api/categories").then(res => setCategories(res.data));
      if (product) {
        setFormData({
          name: product.name || "",
          description: product.description || "",
          price: product.price?.toString() || "",
          stock: product.stock?.toString() || "",
          category: product.categoryId?._id || product.categoryId || "",
          image: product.images?.[0] || ""
        });
      } else {
        setFormData({
          name: "",
          description: "",
          price: "",
          stock: "",
          category: "",
          image: ""
        });
      }
    }
  }, [isOpen, product]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { category: catId, image: imgUrl, ...rest } = formData;
      const payload = {
        ...rest,
        price: Number(formData.price),
        stock: Number(formData.stock),
        images: [imgUrl],
        categoryId: catId
      };

      if (product) {
        await axios.put(`/api/products/${product._id}`, payload);
        alert("Specimen details updated successfully!");
      } else {
        await axios.post("/api/products", payload);
        alert("Product created successfully!");
      }
      onClose();
      window.location.reload();
    } catch (err) {
      alert(product ? "Failed to update product" : "Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 pb-24">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white w-full max-w-xl rounded-[3rem] overflow-hidden shadow-2xl flex flex-col max-h-full"
          >
            <div className="p-10 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-serif font-bold text-brand-primary">{product ? "Edit Specimen" : "New Specimen"}</h2>
                <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest font-black">{product ? "Modifying Botanical Record" : "Botanical Enrollment"}</p>
              </div>
              <button onClick={onClose} className="p-4 hover:bg-slate-50 rounded-full transition-colors">
                <X className="w-6 h-6 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-10 space-y-8 overflow-y-auto">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-4 col-span-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Product Name</label>
                  <input 
                    required
                    className="w-full px-8 py-5 bg-slate-50 rounded-2xl border-none focus:ring-4 focus:ring-brand-accent/5 transition-all outline-none font-medium"
                    placeholder="E.g. Rare Blue Orchid"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Pricing (LKR)</label>
                  <input 
                    required
                    type="number"
                    className="w-full px-8 py-5 bg-slate-50 rounded-2xl border-none focus:ring-4 focus:ring-brand-accent/5 transition-all outline-none font-medium"
                    placeholder="0.00"
                    value={formData.price}
                    onChange={e => setFormData({...formData, price: e.target.value})}
                  />
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Initial Stock</label>
                  <input 
                    required
                    type="number"
                    className="w-full px-8 py-5 bg-slate-50 rounded-2xl border-none focus:ring-4 focus:ring-brand-accent/5 transition-all outline-none font-medium"
                    placeholder="0"
                    value={formData.stock}
                    onChange={e => setFormData({...formData, stock: e.target.value})}
                  />
                </div>

                <div className="space-y-4 col-span-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Classification</label>
                  <select 
                    required
                    className="w-full px-8 py-5 bg-slate-50 rounded-2xl border-none focus:ring-4 focus:ring-brand-accent/5 transition-all outline-none font-medium"
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value})}
                  >
                    <option value="">Select Category</option>
                    {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </select>
                </div>

                <div className="space-y-4 col-span-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Visual Documentation (URL)</label>
                    <div className="relative">
                        <ImageIcon className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                        <input 
                            required
                            className="w-full pl-14 pr-8 py-5 bg-slate-50 rounded-2xl border-none focus:ring-4 focus:ring-brand-accent/5 transition-all outline-none font-medium"
                            placeholder="https://images.unsplash.com..."
                            value={formData.image}
                            onChange={e => setFormData({...formData, image: e.target.value})}
                        />
                    </div>
                </div>

                <div className="space-y-4 col-span-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Botanical Notes</label>
                  <textarea 
                    className="w-full px-8 py-5 bg-slate-50 rounded-2xl border-none focus:ring-4 focus:ring-brand-accent/5 transition-all outline-none font-medium min-h-[120px]"
                    placeholder="Describe the specimen's unique characteristics..."
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                  />
                </div>
              </div>

              <div className="pt-8">
                <button 
                  disabled={loading}
                  className="w-full bg-brand-primary text-white py-6 rounded-3xl font-black text-xs uppercase tracking-[0.3em] shadow-xl shadow-brand-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4 disabled:opacity-50"
                >
                  {loading ? (product ? "Updating..." : "Registering...") : (product ? "Sync Record" : "Finalize Enrollment")}
                  <PlusCircle className="w-5 h-5" />
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};


export default AdminDashboard;

const OrderDetailModal = ({ isOpen, onClose, order }: any) => {
  if (!order) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-white w-full max-w-4xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            <div className="p-8 md:p-12 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                <h2 className="text-3xl font-serif font-bold text-brand-primary">Order Details</h2>
                <p className="text-xs text-brand-accent mt-1 uppercase tracking-widest font-black">Record #{order._id?.toString().slice(-6).toUpperCase()}</p>
              </div>
              <button onClick={onClose} className="p-4 hover:bg-white rounded-full transition-colors shadow-sm">
                <X className="w-6 h-6 text-slate-400" />
              </button>
            </div>

            <div className="flex-grow overflow-y-auto p-8 md:p-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
                <div>
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Customer Intelligence</h3>
                  <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                    <p className="font-bold text-slate-900 text-lg mb-1">{order.userId?.name || "Guest"}</p>
                    <p className="text-slate-500 mb-4">{order.userId?.email || "No contact info"}</p>
                    <div className="flex items-center gap-2">
                       <span className="text-[10px] font-bold text-slate-400 uppercase">Placed on:</span>
                       <span className="text-xs font-medium text-slate-700">{new Date(order.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Transaction Status</h3>
                  <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-400 uppercase">Status</span>
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                        order.status === 'delivered' ? 'bg-green-500 text-white' : 
                        order.status === 'pending' ? 'bg-amber-500 text-white' : 'bg-brand-primary text-white'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-400 uppercase">Total Amount</span>
                      <span className="text-lg font-black text-brand-primary font-serif">{formatPrice(order.totalAmount)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Manifest (Items)</h3>
                <div className="space-y-4">
                  {order.items?.map((item: any, idx: number) => (
                    <div key={idx} className="flex items-center gap-6 p-6 bg-white border border-slate-100 rounded-3xl hover:border-brand-accent/30 transition-colors">
                      <div className="w-20 h-20 bg-slate-50 rounded-2xl overflow-hidden flex-shrink-0 border border-slate-100">
                         {/* We might not have full product info here depending on populate, 
                             but our Order model should have productId which we can use to fetch if needed.
                             For now, let's assume we have names/prices in the items array if saved that way.
                         */}
                         <div className="w-full h-full flex items-center justify-center text-slate-300">
                           <ShoppingBag className="w-8 h-8" />
                         </div>
                      </div>
                      <div className="flex-grow">
                        <p className="font-bold text-brand-primary mb-1">Product ID: {item.productId?.toString().slice(-6).toUpperCase()}</p>
                        <p className="text-xs text-slate-400">Botanical Specimen Reference</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-slate-900">{formatPrice(item.price)}</p>
                        <p className="text-xs text-slate-400">Qty: {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-10 bg-slate-50 flex justify-end gap-4">
               <button 
                onClick={() => alert("Printing functionality coming soon...")}
                className="px-8 py-4 bg-white border border-slate-200 rounded-full text-xs font-black uppercase tracking-widest text-slate-600 hover:bg-slate-100 transition-colors"
               >
                 Export PDF
               </button>
               <button 
                onClick={onClose}
                className="px-8 py-4 bg-brand-primary text-white rounded-full text-xs font-black uppercase tracking-widest hover:shadow-xl transition-all"
               >
                 Dismiss
               </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const AdminCategories = ({ onNewCategory, onEditCategory }: any) => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/categories");
      setCategories(res.data);
    } catch (err) {
      console.error("Error fetching categories:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this category? Products using this category might break.")) return;
    try {
      await axios.delete(`/api/categories/${id}`);
      setCategories(categories.filter(c => c._id !== id));
    } catch (err) {
      alert("Failed to delete category");
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12">
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-brand-primary">Botanical Categories</h1>
        <button onClick={onNewCategory} className="w-full sm:w-auto px-6 py-3 bg-brand-primary text-white rounded-full text-sm font-medium hover:shadow-xl transition-all flex items-center justify-center gap-2">
          <Plus className="w-4 h-4" />
          New Category
        </button>
      </div>

      <div className="glass p-10 rounded-[3rem] border-none">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-sans">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Image</th>
                <th className="py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Name</th>
                <th className="py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Description</th>
                <th className="py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right px-6">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {categories.map((cat) => (
                <tr key={cat._id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-6">
                    {cat.imageUrl ? (
                      <div className="w-16 h-16 rounded-2xl overflow-hidden border border-slate-100">
                        <img src={cat.imageUrl} alt={cat.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100">
                        <ImageIcon className="w-6 h-6 text-slate-300" />
                      </div>
                    )}
                  </td>
                  <td className="py-6 font-bold text-brand-primary">{cat.name}</td>
                  <td className="py-6 text-sm text-slate-500 max-w-md line-clamp-1">{cat.description || "No description provided."}</td>
                  <td className="py-6 px-6">
                    <div className="flex justify-end gap-2">
                       <button 
                         onClick={() => onEditCategory(cat)}
                         className="p-2 text-slate-400 hover:text-brand-primary transition-colors hover:bg-slate-100 rounded-lg"
                       >
                         <Edit2 className="w-4 h-4" />
                       </button>
                       <button onClick={() => handleDelete(cat._id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors hover:bg-red-50 rounded-lg">
                         <Trash2 className="w-4 h-4" />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {categories.length === 0 && <div className="py-10 text-center text-slate-400 italic font-serif">No botanical categories registered yet.</div>}
        </div>
      </div>
    </div>
  );
};

const CategoryFormModal = ({ isOpen, onClose, category }: any) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    imageUrl: ""
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (category) {
        setFormData({
          name: category.name || "",
          description: category.description || "",
          imageUrl: category.imageUrl || ""
        });
      } else {
        setFormData({
          name: "",
          description: "",
          imageUrl: ""
        });
      }
    }
  }, [isOpen, category]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (category) {
        await axios.put(`/api/categories/${category._id}`, formData);
        alert("Category updated successfully!");
      } else {
        await axios.post("/api/categories", formData);
        alert("Category created successfully!");
      }
      onClose();
      window.location.reload();
    } catch (err) {
      alert(category ? "Failed to update category" : "Failed to create category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 pb-24">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white w-full max-w-lg rounded-[3rem] overflow-hidden shadow-2xl flex flex-col max-h-full"
          >
            <div className="p-10 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-serif font-bold text-brand-primary">{category ? "Edit Taxonomy" : "New Taxonomy"}</h2>
                <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest font-black">Classification Hub</p>
              </div>
              <button onClick={onClose} className="p-4 hover:bg-slate-50 rounded-full transition-colors">
                <X className="w-6 h-6 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-10 space-y-8 overflow-y-auto">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Category Name</label>
                <input 
                  required
                  className="w-full px-8 py-5 bg-slate-50 rounded-2xl border-none focus:ring-4 focus:ring-brand-accent/5 transition-all outline-none font-medium text-brand-primary"
                  placeholder="E.g. Ferns, Orchids, Succulents"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Taxonomic Description</label>
                <textarea 
                  className="w-full px-8 py-5 bg-slate-50 rounded-2xl border-none focus:ring-4 focus:ring-brand-accent/5 transition-all outline-none font-medium min-h-[120px] resize-none"
                  placeholder="Define the characteristics of this botanical group..."
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                />
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Image URL</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-8 flex items-center pointer-events-none">
                    <ImageIcon className="w-5 h-5 text-slate-400" />
                  </div>
                  <input 
                    className="w-full pl-16 pr-8 py-5 bg-slate-50 rounded-2xl border-none focus:ring-4 focus:ring-brand-accent/5 transition-all outline-none font-medium text-brand-primary"
                    placeholder="https://example.com/image.jpg"
                    value={formData.imageUrl}
                    onChange={e => setFormData({...formData, imageUrl: e.target.value})}
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-brand-primary text-white py-6 rounded-3xl font-black text-xs uppercase tracking-[0.3em] shadow-xl shadow-brand-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
              >
                {loading ? "Processing..." : (category ? "Update Classification" : "Confirm Enrollment")}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

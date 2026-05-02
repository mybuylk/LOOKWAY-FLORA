/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import { useAuth } from "./context/AuthContext";
import { Navigate } from "react-router-dom";

// Lazy Pages
const Home = lazy(() => import("./pages/Home"));
const Shop = lazy(() => import("./pages/Shop"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Cart = lazy(() => import("./pages/Cart"));
const Profile = lazy(() => import("./pages/Profile"));
const About = lazy(() => import("./pages/About"));
const Categories = lazy(() => import("./pages/Categories"));
const Orders = lazy(() => import("./pages/Orders"));
const Contact = lazy(() => import("./pages/Contact"));
const PolicyPage = lazy(() => import("./pages/PolicyPage"));
const OrderSuccess = lazy(() => import("./pages/OrderSuccess"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const VendorDashboard = lazy(() => import("./pages/VendorDashboard"));

const Loading = () => (
   <div className="h-screen w-full flex items-center justify-center bg-market-gradient">
     <div className="animate-pulse flex flex-col items-center">
       <div className="w-16 h-16 bg-brand-primary rounded-full opacity-20 mb-4" />
       <span className="text-brand-primary font-serif italic">Loading Lookway Flora...</span>
     </div>
   </div>
);

const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles: string[] }) => {
  const { user, loading } = useAuth();

  if (loading) return <Loading />;
  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <div className="min-h-screen flex flex-col bg-market-gradient">
          <Navigation />
          <main className="flex-grow pt-20">
            <Suspense fallback={<Loading />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/about" element={<About />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/shipping" element={<PolicyPage />} />
                <Route path="/returns" element={<PolicyPage />} />
                <Route path="/faq" element={<PolicyPage />} />
                <Route path="/privacy" element={<PolicyPage />} />
                <Route path="/terms" element={<PolicyPage />} />
                <Route path="/order-success" element={<OrderSuccess />} />
                <Route 
                  path="/admin/*" 
                  element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/vendor/*" 
                  element={
                    <ProtectedRoute allowedRoles={["vendor", "admin"]}>
                      <VendorDashboard />
                    </ProtectedRoute>
                  } 
                />
              </Routes>
            </Suspense>
          </main>
          <Footer />
        </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

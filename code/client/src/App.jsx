import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Layout
import Navbar from './components/Common/Navbar';
import Footer from './components/Common/Footer';

// User Pages
import Home from './pages/User/Home';
import Products from './pages/User/Products';
import ProductDetail from './pages/User/ProductDetail';
import Cart from './pages/User/Cart';
import Checkout from './pages/User/Checkout';
import OrderConfirmation from './pages/User/OrderConfirmation';
import Profile from './pages/User/Profile';
import Orders from './pages/User/Orders';
import OrderDetail from './pages/User/OrderDetail';
import Wishlist from './pages/User/Wishlist';

// Auth Pages
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';

// Admin Pages
import AdminLayout from './components/Admin/AdminLayout';
import Dashboard from './pages/Admin/Dashboard';
import AdminProducts from './pages/Admin/AdminProducts';
import AdminProductForm from './pages/Admin/AdminProductForm';
import AdminOrders from './pages/Admin/AdminOrders';
import AdminOrderDetail from './pages/Admin/AdminOrderDetail';
import AdminUsers from './pages/Admin/AdminUsers';
import AdminSettings from './pages/Admin/AdminSettings';

// Protected Route
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}><div className="loading-spinner" /></div>;
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/" replace />;
  return children;
};

const UserLayout = ({ children }) => (
  <>
    <Navbar />
    <main style={{ minHeight: 'calc(100vh - 140px)' }}>{children}</main>
    <Footer />
  </>
);

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <Toaster position="top-right" toastOptions={{ duration: 3000, style: { fontFamily: 'Inter, sans-serif', fontSize: '0.875rem' } }} />
          <Routes>
            {/* Auth */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* User Routes */}
            <Route path="/" element={<UserLayout><Home /></UserLayout>} />
            <Route path="/products" element={<UserLayout><Products /></UserLayout>} />
            <Route path="/products/:id" element={<UserLayout><ProductDetail /></UserLayout>} />
            <Route path="/cart" element={<UserLayout><Cart /></UserLayout>} />
            <Route path="/wishlist" element={<UserLayout><Wishlist /></UserLayout>} />
            <Route path="/checkout" element={<ProtectedRoute><UserLayout><Checkout /></UserLayout></ProtectedRoute>} />
            <Route path="/order-confirmation/:id" element={<ProtectedRoute><UserLayout><OrderConfirmation /></UserLayout></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><UserLayout><Profile /></UserLayout></ProtectedRoute>} />
            <Route path="/orders" element={<ProtectedRoute><UserLayout><Orders /></UserLayout></ProtectedRoute>} />
            <Route path="/orders/:id" element={<ProtectedRoute><UserLayout><OrderDetail /></UserLayout></ProtectedRoute>} />

            {/* Admin Routes */}
            <Route path="/admin" element={<ProtectedRoute adminOnly><AdminLayout /></ProtectedRoute>}>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="products/new" element={<AdminProductForm />} />
              <Route path="products/edit/:id" element={<AdminProductForm />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="orders/:id" element={<AdminOrderDetail />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;

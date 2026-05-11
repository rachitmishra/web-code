import { BrowserRouter as Router, Routes, Route } from 'react-router';
import MainLayout from './components/layout/MainLayout';
import AdminLayout from './components/layout/AdminLayout';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Checkout from './pages/Checkout';
import Success from './pages/Success';
import StaticPage from './pages/StaticPage';
import Orders from './pages/Admin/Orders';
import OrderDetail from './pages/Admin/OrderDetail';
import EmailLogs from './pages/Admin/EmailLogs';
import Inventory from './pages/Admin/Inventory';
import Marketing from './pages/Admin/Marketing';
import SeedData from './pages/Admin/SeedData';
import Analytics from './pages/Admin/Analytics';
import Invitations from './pages/Admin/Invitations';
import Storefront from './pages/Admin/Storefront';
import PageManager from './pages/Admin/PageManager';
import ProtectedRoute from './components/ui/Auth/ProtectedRoute';
import AdminRoute from './components/ui/Auth/AdminRoute';
import './App.css';

export const AppRoutes = () => (
  <Routes>
    {/* Customer Routes with MainLayout */}
    <Route element={<MainLayout><Home /></MainLayout>} index />
    <Route path="/" element={<MainLayout><Home /></MainLayout>} />
    <Route path="/product/:id" element={<MainLayout><ProductDetail /></MainLayout>} />
    <Route path="/cart" element={<MainLayout><Cart /></MainLayout>} />
    <Route path="/login" element={<MainLayout><Login /></MainLayout>} />
    <Route path="/checkout" element={<MainLayout><Checkout /></MainLayout>} />
    <Route path="/checkout/success/:orderId" element={<MainLayout><Success /></MainLayout>} />
    <Route path="/about" element={<MainLayout><StaticPage /></MainLayout>} />
    <Route path="/shipping" element={<MainLayout><StaticPage /></MainLayout>} />
    <Route path="/contact" element={<MainLayout><StaticPage /></MainLayout>} />
    <Route 
      path="/profile" 
      element={
        <MainLayout>
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        </MainLayout>
      } 
    />

    {/* Admin Routes with AdminLayout */}
    <Route 
      path="/admin" 
      element={
        <AdminRoute>
          <AdminLayout />
        </AdminRoute>
      }
    >
      <Route index element={<Orders />} />
      <Route path="orders" element={<Orders />} />
      <Route path="orders/:id" element={<OrderDetail />} />
      <Route path="email-logs" element={<EmailLogs />} />
      <Route path="inventory" element={<Inventory />} />
      <Route path="marketing" element={<Marketing />} />
      <Route path="seed" element={<SeedData />} />
      <Route path="analytics" element={<Analytics />} />
      <route path="invitations" element={<Invitations />} />
      <Route path="storefront" element={<Storefront />} />
      <Route path="pages" element={<PageManager />} />
    </Route>
  </Routes>
);

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;

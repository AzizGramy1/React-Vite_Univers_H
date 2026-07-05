// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';

// Layout
import Layout from './components/common/Layout';
import PrivateRoute from './components/common/PrivateRoute';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Services from './pages/Services';
import Orders from './pages/Orders';
import Clients from './pages/Clients';
import Suppliers from './pages/Suppliers';
import Requests from './pages/Requests';
import Quotes from './pages/Quotes';
import Offers from './pages/Offers';
import Planning from './pages/Planning';
import Settings from './pages/Settings';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
              padding: '12px 20px',
              borderRadius: '12px',
            },
            success: {
              style: {
                background: '#10B981',
              },
            },
            error: {
              style: {
                background: '#EF4444',
              },
            },
          }}
        />
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route element={<PrivateRoute />}>
            <Route element={<Layout />}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/products" element={<Products />} />
              <Route path="/services" element={<Services />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/clients" element={<Clients />} />
              <Route path="/suppliers" element={<Suppliers />} />
              <Route path="/requests" element={<Requests />} />
              <Route path="/quotes" element={<Quotes />} />
              <Route path="/offers" element={<Offers />} />
              <Route path="/planning" element={<Planning />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
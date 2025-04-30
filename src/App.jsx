import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import './css/style.css';
import './charts/ChartjsConfig';

import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Citizens from './pages/Citizens';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

import Sidebar from './partials/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import DistrictUsers from './pages/DistrictUsers';

function App() {
  const location = useLocation();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    document.querySelector('html').style.scrollBehavior = 'auto';
    window.scroll({ top: 0 });
    document.querySelector('html').style.scrollBehavior = '';
  }, [location.pathname]);

  return (
    <>
    
     
    <Routes>
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />

  <Route
    path="/"
    element={
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    }
  >
    <Route index element={<Dashboard />} />
    <Route path="citizens" element={<Citizens />} />
    <Route path="reports" element={<Reports />} />
    <Route path="settings" element={<Settings />} />
    <Route path="/district-users" element={<DistrictUsers />} />

  </Route>
</Routes>
    

      
    </>
  );
}

export default App;

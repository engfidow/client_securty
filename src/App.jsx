import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import './css/style.css';
import './charts/ChartjsConfig';

import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';

import Reports from './pages/Reports';
import Settings from './pages/Settings';

import Sidebar from './partials/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import DistrictUsers from './pages/DistrictUsers';

import CitizenList from './pages/Citizen';
import CrimeReport from './pages/CrimeReport';
import AdminReport from './pages/AdminReport';
import Profile from './pages/Profile';
import DistrictDashboard from './pages/DistrictDashboard';
import DisctrictCrime from './pages/DisctrictCrime';
import DistricBranches from './pages/DistricBranches';

function App() {
  const location = useLocation();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(true);

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
    <Route path="crime-reports" element={<CrimeReport />} />
    <Route path="citizens" element={<CitizenList />} />
    <Route path="reports" element={<Reports />} />
    <Route path="settings" element={<Settings />} />
    <Route path="/district-users" element={<DistrictUsers />} />
    <Route path="/admin-report" element={<AdminReport />} />
    <Route path="/profile" element={<Profile />} />
    <Route path="/district-dashboard" element={<DistrictDashboard />} />


    <Route path="/district-crime-reports" element={<DisctrictCrime />} />
    <Route path="/district-branches" element={<DistricBranches />} />


  </Route>
</Routes>
    

      
    </>
  );
}

export default App;

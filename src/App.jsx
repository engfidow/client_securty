import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import './css/style.css';
import './charts/ChartjsConfig';

import Dashboard from './pages/Dashboard';
import Login from './pages/Login';


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
import FeedbackList from './pages/FeedbackList';
import PersonalReport from './pages/PersonalReport';
import HomePage from './pages/HomePage';
import DistrictPersonalReport from './pages/DistrictPersonalReport';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import UnAuthorized from './pages/UnAuthorized';
import UnAuthenticatedRoutes from './components/UnAuthenticatedRoutes';
import BranchDashboard from './pages/BranchDashboard';
import BranchCrime from './pages/BranchCrime';
import BranchPersonalReport from './pages/BranchPersonalReport';

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
      <Route path="/home" element={<HomePage />} />
       <Route path="/login" element={<UnAuthenticatedRoutes children={<Login />} />} />
 

  <Route
    path="/"
    element={
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    }
  >

    {/* start admin Routes */}
    <Route index element={<AdminProtectedRoute children={<Dashboard />} />} />
    <Route path="personal-reports" element={<AdminProtectedRoute children={<PersonalReport />} />} />
    <Route path="crime-reports" element={<AdminProtectedRoute children={<CrimeReport />} />} />
    <Route path="citizens" element={<AdminProtectedRoute children={<CitizenList />} />} />
    <Route path="reports" element={<AdminProtectedRoute children={<Reports />} />} />
    <Route path="settings" element={<AdminProtectedRoute children={<Settings />} />} />
    <Route path="/district-users" element={<AdminProtectedRoute children={<DistrictUsers />} />} />
    <Route path="/admin-report" element={<AdminProtectedRoute children={<AdminReport />} />} />
    <Route path="/feedbacks" element={<AdminProtectedRoute children={<FeedbackList />} />} />
    <Route path="/profile" element={<Profile />} />
    
    {/* end admin Routes */}

    <Route path="/district-dashboard" element={<DistrictDashboard />}/>
    <Route path="/branch-dashboard" element={<BranchDashboard />}/>
    <Route path="/district-crime-reports" element={<DisctrictCrime />} />
    <Route path="/branch-crime-reports" element={<BranchCrime />} />
    <Route path="/district-personal-reports" element={<DistrictPersonalReport />} />
    <Route path="/branch-personal-reports" element={<BranchPersonalReport />} />
    <Route path="/district-branches" element={<DistricBranches />} />


  </Route>

  <Route path="/unauthorized" element={<UnAuthorized />} />
</Routes>
    

      
    </>
  );
}

export default App;

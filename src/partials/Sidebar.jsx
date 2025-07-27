import React, { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  MdDashboard,
  MdPeople,
  MdMap,
  MdReport,
  MdAccountCircle,
  MdLogout,
  MdFeedback,
  MdTraffic,
} from 'react-icons/md';
import { TbMessageReportFilled } from "react-icons/tb";
import { PiUsersThreeFill } from "react-icons/pi";
import logo from '../images/logo.png'; 

function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const location = useLocation();
  const navigate = useNavigate();
  const trigger = useRef(null);
  const sidebar = useRef(null);
  const [sidebarExpanded, setSidebarExpanded] = useState(
    localStorage.getItem('sidebar-expanded') === 'true'
  );

  const user = JSON.parse(localStorage.getItem('user'));
  const role = user?.role || 'police';

  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener('mousedown', clickHandler);
    return () => document.removeEventListener('mousedown', clickHandler);
  }, [sidebarOpen]);

  useEffect(() => {
    localStorage.setItem('sidebar-expanded', sidebarExpanded);
    document.body.classList.toggle('sidebar-expanded', sidebarExpanded);
  }, [sidebarExpanded]);

  const logout = () => {
    localStorage.clear();
    navigate('/home');
  };

  const navItem = (to, icon, label) => (
    <NavLink
      to={to}
      onClick={() => {
        if (window.innerWidth < 1024) setSidebarOpen(false);
      }}
      className={({ isActive }) =>
        `flex items-center gap-2 p-2 rounded transition-all ${
          isActive
            ? 'bg-violet-100 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300'
            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
        }`
      }
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  );

  return (
    <>
      {/* Mobile Backdrop */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 lg:hidden transition-opacity duration-300 ${
          sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setSidebarOpen(false)}
      />

      <div
        ref={sidebar}
        className={`fixed top-0 left-0 z-50 w-64 h-full bg-white dark:bg-gray-800 shadow-md p-4 transition-transform duration-300 transform
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:block`}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className='flex items-center space-x-2'>
             <img src={logo} alt="Logo" className="w-8 h-8 rounded-full shadow-lg" />
          <h1 className="text-xl font-bold text-violet-600">ReportApp</h1>
          </div>
          
          <button
            ref={trigger}
            className="lg:hidden text-gray-500 hover:text-gray-400"
            onClick={() => setSidebarOpen(false)}
          >
            ✖
          </button>
        </div>

        {/* Navigation */}
       <nav className="space-y-2">
  {role === 'admin' && navItem('/', <MdDashboard size={20} />, 'Dashboard')}
  {(role === 'police' || role === 'branch') && navItem('/district-dashboard', <MdDashboard size={20} />, 'Dashboard')}

  {role === 'admin' && navItem('/personal-reports', <MdTraffic size={20} />, 'Personal Reports')}
  {role === 'admin' && navItem('/crime-reports',  <TbMessageReportFilled size={20} />, 'Crime Reports')}
  {role === 'admin' && navItem('/district-users', <PiUsersThreeFill size={20} />, 'Manage Users')}
  {role === 'admin' && navItem('/citizens', <MdMap size={20} />, 'Citizens')}
  {role === 'admin' && navItem('/feedbacks', <MdFeedback size={20} />, 'Feedbacks')}
  {role === 'admin' && navItem('/admin-report', <MdReport size={20} />, 'Reports')}

  {(role === 'police' || role === 'branch') && navItem('/district-crime-reports', <MdPeople size={20} />, 'Crime Reports')}
  {(role === 'police' || role === 'branch') && navItem('/district-personal-reports', <MdTraffic size={20} />, 'Personal Reports')}
  {(role === 'police' || role === 'branch') && navItem('/district-branches', <MdPeople size={20} />, 'District Branches')}

  {navItem('/profile', <MdAccountCircle size={20} />, 'Profile')}

  <button
    onClick={logout}
    className="flex items-center gap-2 p-2 w-full text-left rounded text-red-600 hover:bg-red-100 dark:hover:bg-red-800 mt-4"
  >
    <MdLogout size={20} />
    <span>Logout</span>
  </button>
</nav>

      </div>
    </>
  );
}

export default Sidebar;

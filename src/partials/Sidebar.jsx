import React, { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  MdDashboard,
  MdPeople,
  MdMap,
  MdReport,
  MdAccountCircle,
  MdLogout,
} from 'react-icons/md';

function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const location = useLocation();
  const { pathname } = location;
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
      if (!sidebarOpen || sidebar.current.contains(target) || trigger.current.contains(target)) return;
      setSidebarOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  useEffect(() => {
    localStorage.setItem('sidebar-expanded', sidebarExpanded);
    if (sidebarExpanded) {
      document.body.classList.add('sidebar-expanded');
    } else {
      document.body.classList.remove('sidebar-expanded');
    }
  }, [sidebarExpanded]);

  const logout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const navItem = (to, icon, label) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-2 p-2 rounded ${
          isActive ? 'bg-violet-100 text-violet-700' : 'text-gray-700 hover:bg-gray-100'
        }`
      }
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  );

  return (
    <div className="min-w-fit">
      <div
        className={`fixed inset-0 bg-gray-900/30 z-40 lg:hidden transition-opacity duration-200 ${
          sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden="true"
      ></div>

      <div
        ref={sidebar}
        className={`flex flex-col z-40 h-screen w-64 bg-white dark:bg-gray-800 p-4 border-r transition-all duration-200 ease-in-out
        ${sidebarOpen ? 'block' : 'hidden lg:block'}
      `}
      >
        {/* Logo */}
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-xl font-bold text-violet-600">SecureApp</h1>
          <button
            ref={trigger}
            className="lg:hidden text-gray-500 hover:text-gray-400"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            ✖
          </button>
        </div>

        {/* Nav */}
        <nav className="space-y-2">
          {navItem('/', <MdDashboard size={20} />, 'Dashboard')}
          {navItem('/citizens', <MdPeople size={20} />, 'Citizens Report')}
          {role === 'admin' && navItem('/district-users', <MdMap size={20} />, 'District Users')}


          {role === 'admin'
            ? navItem('/reports', <MdReport size={20} />, 'Reports')
            : navItem('/districts', <MdMap size={20} />, 'District Reports')}

          {navItem('/profile', <MdAccountCircle size={20} />, 'Profile')}

          <button
            onClick={logout}
            className="flex items-center gap-2 p-2 w-full text-left rounded text-red-600 hover:bg-red-50 mt-4"
          >
            <MdLogout size={20} />
            <span>Logout</span>
          </button>
        </nav>
      </div>
    </div>
  );
}

export default Sidebar;

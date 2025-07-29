import React, { useEffect, useState } from 'react';


import UserMenu from '../components/DropdownProfile';
import ThemeToggle from '../components/ThemeToggle';
import { BellIcon } from '@heroicons/react/24/outline';
import axios from 'axios';

function Header({
  sidebarOpen,
  setSidebarOpen,
  variant = 'default',
}) {

  const [searchModalOpen, setSearchModalOpen] = useState(false)
  const [notifications, setNotifications] = useState([]);
const [unreadCount, setUnreadCount] = useState(0);
const [dropdownOpen, setDropdownOpen] = useState(false);
useEffect(() => {
  const fetchReports = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const viewedIds = JSON.parse(localStorage.getItem('viewedReports') || '[]');

      const res = await axios.get('https://security991.onrender.com/api/reports');
      console.log(res)
      let reports = res.data;

      // Role-based filter
      if (user.role === 'police') {
        reports = reports.filter(r => r.district === user.district);
      } else if (user.role === 'branch') {
        reports = reports.filter(r => r.branch === user.name);
      }

      // Sort by createdAt descending
      reports.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      // Filter out viewed
      const newReports = reports.filter(r => !viewedIds.includes(r._id));
      setNotifications(newReports);
      setUnreadCount(newReports.length);
    } catch (err) {
      console.error('❌ Notification Fetch Error:', err);
    }
  };

  fetchReports();
}, []);

const handleViewNotification = (id) => {
  const viewed = JSON.parse(localStorage.getItem('viewedReports') || '[]');
  if (!viewed.includes(id)) {
    viewed.push(id);
    localStorage.setItem('viewedReports', JSON.stringify(viewed));
  }

  setNotifications((prev) => prev.filter((n) => n._id !== id));
  setUnreadCount((prev) => prev - 1);
};



  return (
    <header className={`sticky top-0 before:absolute before:inset-0 before:backdrop-blur-md max-lg:before:bg-white/90 dark:max-lg:before:bg-gray-800/90 before:-z-10 z-30 ${variant === 'v2' || variant === 'v3' ? 'before:bg-white after:absolute after:h-px after:inset-x-0 after:top-full after:bg-gray-200 dark:after:bg-gray-700/60 after:-z-10' : 'max-lg:shadow-xs lg:before:bg-gray-100/90 dark:lg:before:bg-gray-900/90'} ${variant === 'v2' ? 'dark:before:bg-gray-800' : ''} ${variant === 'v3' ? 'dark:before:bg-gray-900' : ''}`}>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className={`flex items-center justify-between h-16 ${variant === 'v2' || variant === 'v3' ? '' : 'lg:border-b border-gray-200 dark:border-gray-700/60'}`}>

          {/* Header: Left side */}
          <div className="flex">

            {/* Hamburger button */}
            <button
              className="text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 lg:hidden"
              aria-controls="sidebar"
              aria-expanded={sidebarOpen}
              onClick={(e) => { e.stopPropagation(); setSidebarOpen(!sidebarOpen); }}
            >
              <span className="sr-only">Open sidebar</span>
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <rect x="4" y="5" width="16" height="2" />
                <rect x="4" y="11" width="16" height="2" />
                <rect x="4" y="17" width="16" height="2" />
              </svg>
            </button>

          </div>

          {/* Header: Right side */}
          <div className="flex items-center space-x-3">
           
            <div className="relative">
  <button
    onClick={() => setDropdownOpen(!dropdownOpen)}
    className="relative focus:outline-none"
  >
    <BellIcon className="w-6 h-6 text-gray-700 dark:text-gray-200" />
    {unreadCount > 0 && (
      <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
        {unreadCount}
      </span>
    )}
  </button>

  {/* Dropdown */}
  {dropdownOpen && (
    <div className="absolute right-0 z-10 w-80 mt-2 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg dark:bg-gray-800 dark:border-gray-700">
      <div className="p-2 max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="text-gray-500 dark:text-gray-300 text-sm text-center">No new notifications</div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif._id}
              onClick={() => handleViewNotification(notif._id)}
              className="cursor-pointer p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
            >
              <p className="font-semibold text-sm text-gray-800 dark:text-white">{notif.title}</p>
              <p className="text-xs text-gray-500 dark:text-gray-300">{notif.description}</p>
              <p className="text-xs text-gray-400">{new Date(notif.createdAt).toLocaleString()}</p>
            </div>
          ))
        )}
      </div>
    </div>
  )}
</div>

           
            {/* <Help align="right" /> */}
            <ThemeToggle />
            {/*  Divider */}
            <hr className="w-px h-6 bg-gray-200 dark:bg-gray-700/60 border-none" />
            <UserMenu align="right" />

          </div>

        </div>
      </div>
    </header>
  );
}

export default Header;
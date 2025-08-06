import React, { useEffect, useRef, useState } from 'react';
import UserMenu from '../components/DropdownProfile';
import ThemeToggle from '../components/ThemeToggle';
import { BellIcon } from '@heroicons/react/24/outline';
import socket from '../socket';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Header({ sidebarOpen, setSidebarOpen, variant = 'default' }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(false);
    }
  };

  if (dropdownOpen) {
    document.addEventListener('mousedown', handleClickOutside);
  } else {
    document.removeEventListener('mousedown', handleClickOutside);
  }

  return () => {
    document.removeEventListener('mousedown', handleClickOutside);
  };
}, [dropdownOpen]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) return;

    // ✅ Join socket notification rooms
    socket.emit('joinNotificationRooms', user._id, user.role);

    // ✅ Fetch unread notifications from backend
    const fetchNotifications = async () => {
      try {
        const res = await axios.get(`https://security991.onrender.com/api/notifications/${user._id}`);
        const notifs = res.data.data || [];
        const formatted = notifs.map(n => ({
          ...n,
          createdAt: new Date(n.createdAt),
        }));
        setNotifications(formatted);
        setUnreadCount(formatted.length);
      } catch (err) {
        console.error('Failed to fetch notifications', err);
      }
    };

    fetchNotifications();

    // ✅ Realtime new notifications
    const handleNewReport = (report) => {
      const shouldShow =
        user.role === 'admin' ||
        (user.role === 'police' && report.district === user.district) ||
        (user.role === 'branch' && report.branch === user.name);

      if (shouldShow) {
        setNotifications(prev => [{
          ...report,
          createdAt: new Date(report.createdAt),
        }, ...prev]);
        setUnreadCount(prev => prev + 1);
      }
    };

    socket.on('newReport', handleNewReport);

    return () => {
      socket.off('newReport', handleNewReport);
    };
  }, []);

  // ✅ Handle click: mark read + navigate
  const handleViewNotification = async (notif) => {
    try {
      await axios.put(`https://security991.onrender.com/api/notifications/read/${notif._id}`);
    } catch (err) {
      console.error('Failed to mark notification as read', err);
    }

    // Remove from UI
    setNotifications(prev => prev.filter(n => n._id !== notif._id));
    setUnreadCount(prev => Math.max(0, prev - 1));

    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) return;

    // ✅ Redirect based on role + type
    if (user.role === 'admin') {
      if (notif.type === 'personal') {
        navigate('/personal-reports');
      } else if (notif.type === 'crime') {
        navigate('/crime-reports');
      }
    } else if (user.role === 'police') {
      if (notif.type === 'personal') {
        navigate('/district-personal-reports');
      } else if (notif.type === 'crime') {
        navigate('/district-crime-reports');
      }
    }
  };

  return (
    <header className={`sticky top-0 before:absolute before:inset-0 before:backdrop-blur-md max-lg:before:bg-white/90 dark:max-lg:before:bg-gray-800/90 before:-z-10 z-30`}>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex">
            <button
              className="text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 lg:hidden"
              onClick={(e) => { e.stopPropagation(); setSidebarOpen(!sidebarOpen); }}
            >
              <span className="sr-only">Open sidebar</span>
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <rect x="4" y="5" width="16" height="2" />
                <rect x="4" y="11" width="16" height="2" />
                <rect x="4" y="17" width="16" height="2" />
              </svg>
            </button>
          </div>

          <div className="flex items-center space-x-3">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="relative focus:outline-none"
              >
                <BellIcon className="w-6 h-6 text-gray-700 dark:text-gray-200" />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1 text-xs font-bold text-white bg-red-600 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </button>

              {dropdownOpen && (
                <div   ref={dropdownRef} className="absolute right-0 z-50 w-80 mt-2 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg dark:bg-gray-800 dark:border-gray-700">
                  <div className="p-2 max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="text-gray-500 dark:text-gray-300 text-sm text-center py-4">
                        No new notifications
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif._id}
                          onClick={() => handleViewNotification(notif)}
                          className="cursor-pointer p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                        >
                          <p className="font-semibold text-sm text-gray-800 dark:text-white truncate">
                            {notif.title}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-300 mt-1 line-clamp-2">
                            {notif.description}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {notif.createdAt.toLocaleString()}
                          </p>
                          {notif.district && (
                            <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded mt-1 dark:bg-blue-900 dark:text-blue-200">
                              {notif.district}
                            </span>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <ThemeToggle />
            <hr className="w-px h-6 bg-gray-200 dark:bg-gray-700/60 border-none" />
            <UserMenu align="right" />
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;

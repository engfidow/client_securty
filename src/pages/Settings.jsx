import React, { useState, useEffect } from 'react';

const Settings = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">⚙️ Settings</h1>

      {user ? (
        <div className="bg-white p-6 rounded shadow w-full max-w-xl">
          <p className="text-lg mb-2">
            <strong>Name:</strong> {user.name}
          </p>
          <p className="text-lg mb-2">
            <strong>Email:</strong> {user.email}
          </p>
          <p className="text-lg mb-2">
            <strong>Phone:</strong> {user.phone}
          </p>
          <p className="text-lg mb-2">
            <strong>National ID:</strong> {user.nationalId}
          </p>
          <p className="text-lg mb-2">
            <strong>Role:</strong> {user.role}
          </p>
          <p className="text-lg mb-2">
            <strong>Status:</strong> {user.approved ? '✅ Approved' : '⏳ Pending'}
          </p>

          <div className="mt-4">
            <button
              onClick={() => alert('Coming soon')}
              className="px-4 py-2 bg-violet-600 text-white rounded hover:bg-violet-700"
            >
              Change Password
            </button>
          </div>
        </div>
      ) : (
        <p>Loading profile...</p>
      )}
    </div>
  );
};

export default Settings;

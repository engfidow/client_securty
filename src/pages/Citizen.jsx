import React, { useEffect, useState } from 'react';
import axios from 'axios';
import LoadingSkeleton from '../components/LoadingSkeleton';

const CitizenList = () => {
  const [citizens, setCitizens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [statusUpdates, setStatusUpdates] = useState({});
  const [message, setMessage] = useState(null);
  const [filter, setFilter] = useState('all');

  const fetchCitizens = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get('http://localhost:5000/api/users/citizens', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCitizens(res.data);
    } catch (err) {
      console.error('Error fetching citizens:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCitizens();
  }, []);

  const handleStatusChange = (userId, newStatus) => {
    setStatusUpdates((prev) => ({ ...prev, [userId]: newStatus }));
  };

  const handleUpdate = async (userId) => {
    const token = localStorage.getItem('token');
    setUpdatingId(userId);
    setMessage(null);
    try {
      const res = await axios.patch(
        `http://localhost:5000/api/users/approve/${userId}`,
        { status: statusUpdates[userId] },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchCitizens();
      setMessage({ type: 'success', text: res.data.message || 'Status updated successfully' });
    } catch (err) {
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Something went wrong while updating',
      });
    } finally {
      setUpdatingId(null);
      setTimeout(() => setMessage(null), 2000);
    }
  };

  const filteredCitizens = citizens.filter((user) => {
    if (filter === 'all') return true;
    return user.status === filter;
  });

  return (
    <div className="p-6 dark:bg-gray-900 min-h-screen">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-violet-600 dark:text-violet-400">Citizen Users</h2>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border px-3 py-1 rounded-md text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white"
        >
          <option value="all">All</option>
          <option value="active">Active Only</option>
          <option value="inactive">Inactive Only</option>
        </select>
      </div>

      {message && (
        <div
          className={`mb-4 px-4 py-3 rounded ${
            message.type === 'success'
              ? 'bg-green-100 text-green-700 dark:bg-green-200 dark:text-green-900'
              : 'bg-red-100 text-red-700 dark:bg-red-200 dark:text-red-900'
          }`}
        >
          {message.text}
        </div>
      )}

      {loading ? (
       <LoadingSkeleton rows={2} />
      ) : (
        <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded shadow">
          <table className="min-w-full text-sm text-left border dark:border-gray-700">
            <thead className="bg-violet-100 text-violet-700 dark:bg-gray-700 dark:text-violet-300">
              <tr>
                <th className="p-3">Image</th>
                <th className="p-3">National ID</th>
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Phone</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCitizens.map((user) => (
                <tr key={user._id} className="border-t dark:border-gray-700">
                  <td className="p-3">
                    <img
                      src={user.image ? `http://localhost:5000/uploads/${user.image}` : '/default-user.png'}
                      alt="user"
                      className="w-10 h-10 rounded-full object-cover border"
                    />
                  </td>
                  <td className="p-3 text-gray-800 dark:text-gray-100">{user.nationalId || '-'}</td>
                  <td className="p-3 text-gray-800 dark:text-gray-100">{user.name}</td>
                  <td className="p-3 text-gray-800 dark:text-gray-100">{user.email}</td>
                  <td className="p-3 text-gray-800 dark:text-gray-100">{user.phone}</td>
                  <td className="p-3">
                    <span
                      className={`inline-block px-2 py-1 text-xs rounded-full font-medium ${
                        (statusUpdates[user._id] || user.status) === 'active'
                          ? 'bg-green-100 text-green-700 dark:bg-green-300 dark:text-green-900'
                          : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-300 dark:text-yellow-900'
                      }`}
                    >
                      {statusUpdates[user._id] || user.status}
                    </span>
                  </td>
                  <td className="p-3 space-x-2">
                    <select
                      value={statusUpdates[user._id] || user.status}
                      onChange={(e) => handleStatusChange(user._id, e.target.value)}
                      className="border rounded px-2 py-1 text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                    <button
                      onClick={() => handleUpdate(user._id)}
                      disabled={updatingId === user._id}
                      className={`px-3 py-1 text-white rounded ${
                        updatingId === user._id
                          ? 'bg-gray-400 dark:bg-gray-600'
                          : 'bg-violet-600 hover:bg-violet-700 dark:bg-violet-500 dark:hover:bg-violet-600'
                      }`}
                    >
                      {updatingId === user._id ? 'Updating...' : 'Update'}
                    </button>
                  </td>
                </tr>
              ))}
              {filteredCitizens.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center text-gray-500 py-4 dark:text-gray-400">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CitizenList;

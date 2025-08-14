import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const API_BASE = 'https://seversecurity-production.up.railway.app';
const FILE_URL = (name) => `${API_BASE}/uploads/${name}`;

const CitizenList = () => {
  const [citizens, setCitizens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [statusUpdates, setStatusUpdates] = useState({});
  const [message, setMessage] = useState(null);
  const [filter, setFilter] = useState('all');

  // Sorting
  const [sortDir, setSortDir] = useState('desc'); // 'asc' | 'desc'

  // Modals
  const [selectedUser, setSelectedUser] = useState(null); // details modal
  const [previewImage, setPreviewImage] = useState(null); // full-screen image preview

  const token = useMemo(() => localStorage.getItem('token'), []);

  const fetchCitizens = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/api/users/citizens`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCitizens(res.data || []);
    } catch (err) {
      console.error('Error fetching citizens:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCitizens();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleStatusChange = (userId, newStatus) => {
    setStatusUpdates((prev) => ({ ...prev, [userId]: newStatus }));
  };

  const handleUpdate = async (userId) => {
    setUpdatingId(userId);
    setMessage(null);
    try {
      const res = await axios.patch(
        `${API_BASE}/api/users/approve/${userId}`,
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

  const filteredCitizens = useMemo(() => {
    const list =
      filter === 'all' ? citizens : citizens.filter((u) => (u.status || 'inactive') === filter);

    // Sort by createdAt
    return [...list].sort((a, b) => {
      const aTime = a?.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bTime = b?.createdAt ? new Date(b.createdAt).getTime() : 0;
      return sortDir === 'asc' ? aTime - bTime : bTime - aTime;
    });
  }, [citizens, filter, sortDir]);

  const toggleSort = () => setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));

  const renderSkeletonRows = () =>
    Array(6)
      .fill()
      .map((_, idx) => (
        <tr key={idx} className="border-t dark:border-gray-700">
          {Array(8)
            .fill()
            .map((__, col) => (
              <td key={col} className="p-3">
                <Skeleton height={20} className="dark:bg-gray-700" />
              </td>
            ))}
        </tr>
      ));

  const onRowClick = (user) => setSelectedUser(user);

  const stop = (e) => e.stopPropagation();

  return (
    <div className="p-6 dark:bg-gray-900 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <h2 className="text-2xl font-bold text-violet-600 dark:text-violet-400">Citizen Users</h2>

        <div className="flex items-center gap-3">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border px-3 py-1 rounded-md text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          >
            <option value="all">All</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>

          <button
            onClick={toggleSort}
            className="border px-3 py-1 rounded-md text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            title="Sort by Created At"
          >
            Sort: Created {sortDir === 'asc' ? '↑' : '↓'}
          </button>
        </div>
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

      <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded shadow">
        <table className="min-w-full text-sm text-left border dark:border-gray-700">
          <thead className="bg-violet-100 text-violet-700 dark:bg-gray-700 dark:text-violet-300">
            <tr>
              {/* <th className="p-3">Image</th> */}
              <th className="p-3">National ID</th>
              <th className="p-3">National ID Image</th>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Phone</th>
              <th
                className="p-3 cursor-pointer select-none"
                title="Click to toggle sort"
                onClick={toggleSort}
              >
                Created {sortDir === 'asc' ? '↑' : '↓'}
              </th>
              <th className="p-3">Status / Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading
              ? renderSkeletonRows()
              : filteredCitizens.map((user) => {
                  const currentStatus = statusUpdates[user._id] || user.status || 'inactive';
                  const createdLabel = user?.createdAt
                    ? new Date(user.createdAt).toLocaleString()
                    : '-';
                  return (
                    <tr
                      key={user._id}
                      className="border-t dark:border-gray-700 hover:bg-violet-50 dark:hover:bg-gray-700/40 transition"
                      onClick={() => onRowClick(user)}
                    >
                      {/* <td className="p-3">
                        <img
                          src={
                            user.image ? FILE_URL(user.image) : '/default-user.png'
                          }
                          alt="user"
                          className="w-10 h-10 rounded-full object-cover border"
                          onClick={stop}
                        />
                      </td> */}

                      <td className="p-3 text-gray-800 dark:text-gray-100">
                        {user.nationalId || '-'}
                      </td>

                      <td className="p-3">
                        {user.nationalIdImage ? (
                          <button
                            className="underline text-violet-600 dark:text-violet-300"
                            onClick={(e) => {
                              stop(e);
                              setPreviewImage(FILE_URL(user.nationalIdImage));
                            }}
                            title="View National ID Image"
                          >
                            View ID
                          </button>
                        ) : (
                          <span className="text-gray-500 dark:text-gray-400">No ID</span>
                        )}
                      </td>

                      <td className="p-3 text-gray-800 dark:text-gray-100">{user.name}</td>
                      <td className="p-3 text-gray-800 dark:text-gray-100">{user.email}</td>
                      <td className="p-3 text-gray-800 dark:text-gray-100">{user.phone}</td>

                      <td className="p-3 text-gray-800 dark:text-gray-100">{createdLabel}</td>

                      <td className="p-3 space-x-2" onClick={stop}>
                        {/* <span
                          className={`inline-block px-2 py-1 text-xs rounded-full font-medium mr-2 ${
                            currentStatus === 'active'
                              ? 'bg-green-100 text-green-700 dark:bg-green-300 dark:text-green-900'
                              : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-300 dark:text-yellow-900'
                          }`}
                        >
                          {currentStatus}
                        </span> */}

                        <select
                          value={currentStatus}
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
                  );
                })}

            {!loading && filteredCitizens.length === 0 && (
              <tr>
                <td colSpan="8" className="text-center text-gray-500 py-4 dark:text-gray-400">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Details Modal */}
      {selectedUser && (
        <div
          className="fixed inset-0 z-40 bg-black/60 flex items-center justify-center p-4"
          onClick={() => setSelectedUser(null)}
        >
          <div
            className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-4 p-5 border-b dark:border-gray-700">
              <img
                src={selectedUser?.image ? FILE_URL(selectedUser.image) : '/default-user.png'}
                alt="avatar"
                className="w-16 h-16 rounded-full object-cover border"
              />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {selectedUser?.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Role: {selectedUser?.role || 'citizen'}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Status: {selectedUser?.status || 'inactive'}
                </p>
              </div>
              <button
                className="ml-auto px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200"
                onClick={() => setSelectedUser(null)}
              >
                Close
              </button>
            </div>

            <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-xs uppercase text-gray-500 dark:text-gray-400">Email</p>
                <p className="text-sm text-gray-900 dark:text-gray-100 break-all">
                  {selectedUser?.email || '-'}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase text-gray-500 dark:text-gray-400">Phone</p>
                <p className="text-sm text-gray-900 dark:text-gray-100">
                  {selectedUser?.phone || '-'}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase text-gray-500 dark:text-gray-400">National ID</p>
                <p className="text-sm text-gray-900 dark:text-gray-100">
                  {selectedUser?.nationalId || '-'}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase text-gray-500 dark:text-gray-400">District</p>
                <p className="text-sm text-gray-900 dark:text-gray-100">
                  {selectedUser?.district || '-'}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase text-gray-500 dark:text-gray-400">Created At</p>
                <p className="text-sm text-gray-900 dark:text-gray-100">
                  {selectedUser?.createdAt
                    ? new Date(selectedUser.createdAt).toLocaleString()
                    : '-'}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase text-gray-500 dark:text-gray-400">Updated At</p>
                <p className="text-sm text-gray-900 dark:text-gray-100">
                  {selectedUser?.updatedAt
                    ? new Date(selectedUser.updatedAt).toLocaleString()
                    : '-'}
                </p>
              </div>

              {/* National ID Image */}
              <div className="sm:col-span-2">
                <p className="text-xs uppercase text-gray-500 dark:text-gray-400 mb-2">
                  National ID Image
                </p>
                {selectedUser?.nationalIdImage ? (
                  <img
                    src={FILE_URL(selectedUser.nationalIdImage)}
                    alt="National ID"
                    className="w-full max-h-72 object-contain rounded border cursor-zoom-in"
                    onClick={() => setPreviewImage(FILE_URL(selectedUser.nationalIdImage))}
                  />
                ) : (
                  <div className="text-sm text-gray-500 dark:text-gray-400">No ID image</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Full-screen Image Preview */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setPreviewImage(null)}
        >
          <img
            src={previewImage}
            alt="Preview"
            className="max-w-full max-h-full object-contain cursor-zoom-out"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            className="absolute top-4 right-4 bg-white/90 dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-1 rounded shadow"
            onClick={() => setPreviewImage(null)}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default CitizenList;

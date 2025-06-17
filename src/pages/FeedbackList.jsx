import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const FeedbackTable = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  const fetchFeedbacks = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/feedbacks/all');
      setFeedbacks(res.data);
    } catch (err) {
      console.error('Failed to load feedbacks:', err);
      setMessage({ type: 'error', text: 'Failed to load feedbacks.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-violet-600 dark:text-violet-400 mb-4">
        📝 Citizen Feedbacks
      </h2>

      {message && (
        <div
          className={`mb-4 px-4 py-2 rounded ${
            message.type === 'success'
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
          }`}
        >
          {message.text}
        </div>
      )}

      {loading ? (
        <Skeleton count={6} height={60} className="mb-3" />
      ) : (
        <div className="overflow-x-auto bg-white dark:bg-gray-800 shadow rounded-lg">
          <table className="w-full table-auto text-sm">
            <thead className="bg-violet-100 dark:bg-violet-900 text-violet-700 dark:text-violet-200">
              <tr>
                <th className="p-3 text-left">Report Title</th>
                <th className="p-3 text-left">District</th>
                <th className="p-3 text-left">User</th>
                <th className="p-3 text-center">Rating</th>
                <th className="p-3 text-left">Comment</th>
                <th className="p-3 text-left">Submitted</th>
              </tr>
            </thead>
            <tbody>
              {feedbacks.map((fb) => (
                <tr
                  key={fb._id}
                  className="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                >
                  <td className="p-3 font-medium text-gray-800 dark:text-gray-100">
                    {fb.report?.title || 'N/A'}
                  </td>
                  <td className="p-3 text-gray-600 dark:text-gray-300">
                    {fb.report?.district || 'N/A'}
                  </td>
                  <td className="p-3 text-gray-600 dark:text-gray-300">
                    {fb.user?.name || 'N/A'}
                  </td>
                  <td className="p-3 text-center text-yellow-500 font-bold">
                    ⭐ {fb.rating}
                  </td>
                  <td className="p-3 text-gray-700 dark:text-gray-300">
                    {fb.comment || '—'}
                  </td>
                  <td className="p-3 text-gray-500 dark:text-gray-400 text-xs">
                    {new Date(fb.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default FeedbackTable;

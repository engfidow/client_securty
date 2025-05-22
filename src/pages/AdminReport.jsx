import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend,
} from 'chart.js';
import { format } from 'date-fns';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AdminReport = () => {
  const [range, setRange] = useState('all');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [grouped, setGrouped] = useState([]);
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSolvedReports = async () => {
    setLoading(true);
    try {
      const params = { range };
      if (range === 'custom' && from && to) {
        params.from = from;
        params.to = to;
      }
      const res = await axios.get('https://security991.onrender.com/api/reports/solved-summary', { params });
      setGrouped(res.data.grouped);
      setList(res.data.list);
    } catch (err) {
      console.error('Error fetching report summary:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSolvedReports();
  }, [range, from, to]);

  const chartData = {
    labels: grouped.map((g) => g._id),
    datasets: [
      {
        label: 'Solved Crimes',
        data: grouped.map((g) => g.count),
        backgroundColor: 'rgba(99, 102, 241, 0.7)',
      },
    ],
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-violet-600 dark:text-violet-400">📊 Solved Crime Report Dashboard</h2>

      {/* Range Selectors */}
      <div className="flex flex-wrap gap-4 items-center mb-6">
        <select
          value={range}
          onChange={(e) => setRange(e.target.value)}
          className="px-3 py-2 border rounded dark:bg-gray-900 dark:text-white"
        >
             <option value="all">All Time</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="year">This Year</option>
         
          <option value="custom">Custom Range</option>
        </select>

        {range === 'custom' && (
          <>
            <input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="px-3 py-2 border rounded dark:bg-gray-900 dark:text-white"
            />
            <input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="px-3 py-2 border rounded dark:bg-gray-900 dark:text-white"
            />
          </>
        )}
      </div>

      {/* Chart */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow mb-8">
        {loading ? (
          <Skeleton height={280} />
        ) : (
          <Bar data={chartData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
        )}
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow overflow-x-auto">
        <h3 className="text-lg font-semibold mb-3 text-violet-600 dark:text-violet-300">📋 Solved Crime Records</h3>
        {loading ? (
          <Skeleton count={6} height={40} />
        ) : (
          <table className="w-full text-sm table-auto border dark:border-gray-700">
            <thead className="bg-violet-100 dark:bg-violet-900 text-violet-800 dark:text-violet-100">
              <tr>
                <th className="p-2 text-left">No</th>
                <th className="p-2 text-left">Image</th>
                <th className="p-2 text-left">Title</th>
                <th className="p-2 text-left">District</th>
                <th className="p-2 text-left">Branch</th>
                <th className="p-2 text-left">Date</th>
                <th className="p-2 text-left">Description</th>
              </tr>
            </thead>
            <tbody>
              {list.map((report, index) => (
                <tr key={report._id} className="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="p-2 font-medium">{index + 1}</td>
                  <td className="p-2">
                   <div className="flex gap-2 overflow-x-auto max-w-[200px]">
  {report.images && report.images.length > 0 ? (
    report.images.map((img, idx) => (
      <img
        key={idx}
        src={`https://security991.onrender.com/uploads/report/${img}`}
        alt={`crime-${idx}`}
        className="w-12 h-12 object-cover rounded border"
      />
    ))
  ) : (
    <span className="text-gray-400 italic">No image</span>
  )}
</div>

                  </td>
                  <td className="p-2">{report.title}</td>
                  <td className="p-2">{report.district}</td>
                  <td className="p-2">{report.branch || '-'}</td>
                  <td className="p-2">{format(new Date(report.createdAt), 'PPP')}</td>
                  <td className="p-2 text-gray-700 dark:text-gray-200">{report.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminReport;

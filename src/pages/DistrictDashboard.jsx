import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Skeleton from 'react-loading-skeleton';
import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';
import {
  FaChartPie,
  FaFileAlt,
  FaCheckCircle,
  FaClock,
  FaFire,
  FaLeaf,
} from 'react-icons/fa';

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const DistrictDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const district = JSON.parse(localStorage.getItem('user'))?.district;

  useEffect(() => {
    if (!district) return;
    const fetchData = async () => {
      try {
        const res = await axios.get(`https://seversecurity-production.up.railway.app/api/reports/district-dashboard/${district}`);
        setStats(res.data);
      } catch (err) {
        console.error('Error loading dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [district]);

  const pieData = {
    labels: ['Solved', 'Pending', 'Reviewed', 'Fake'],
    datasets: [
      {
        data: [
          stats?.solved || 0,
          stats?.pending || 0,
          stats?.reviewed || 0,
          stats?.fake || 0,
        ],
        backgroundColor: ['#10B981', '#F59E0B', '#3B82F6', '#EF4444'],
        borderWidth: 1,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      y: { beginAtZero: true, ticks: { stepSize: 1, color: '#6B7280' } },
      x: { ticks: { color: '#6B7280' } },
    },
  };

  const dangerData = {
    labels: stats?.mostDangerous?.map((b) => b._id || 'Unknown'),
    datasets: [
      {
        label: 'Reports',
        data: stats?.mostDangerous?.map((b) => b.count),
        backgroundColor: 'rgba(239, 68, 68, 0.8)',
      },
    ],
  };

  const peaceData = {
    labels: stats?.mostPeaceful?.map((b) => b._id || 'Unknown'),
    datasets: [
      {
        label: 'Reports',
        data: stats?.mostPeaceful?.map((b) => b.count),
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
      },
    ],
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-violet-600 dark:text-violet-400 mb-6">📊 District Dashboard</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {loading ? (
          <div className=" dark:bg-gray-800 p-4 rounded shadow mb-6 w-full">
            <Skeleton count={4} width={1140}  height={100} className='w-full'/>
            </div>
          
        ) : (
          <>
            <div className="flex items-center gap-4 bg-white dark:bg-gray-800 p-4 rounded shadow">
              <FaFileAlt className="text-3xl text-violet-500" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-300">Total Reports</p>
                <h3 className="text-xl font-bold text-violet-600">{stats.totalReports}</h3>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-white dark:bg-gray-800 p-4 rounded shadow">
              <FaCheckCircle className="text-3xl text-green-500" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-300">Solved</p>
                <h3 className="text-xl font-bold text-green-500">{stats.solved}</h3>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-white dark:bg-gray-800 p-4 rounded shadow">
              <FaClock className="text-3xl text-yellow-500" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-300">Pending</p>
                <h3 className="text-xl font-bold text-yellow-500">{stats.pending}</h3>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-white dark:bg-gray-800 p-4 rounded shadow">
              <FaChartPie className="text-3xl text-blue-500" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-300">Reviewed</p>
                <h3 className="text-xl font-bold text-blue-500">{stats.reviewed}</h3>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Pie Chart */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow mb-6 w-full">
        <h3 className="text-lg font-semibold text-violet-600 mb-3">📈 Report Status Distribution</h3>
        {loading ? <Skeleton height={200} /> : <div className="w-[300px] h-[300px] mx-auto"><Pie data={pieData} /></div>}
      </div>

      {/* Bar Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
          <h3 className="text-md font-bold text-red-600 dark:text-red-400 mb-2"><FaFire className="inline mr-2" /> Most Dangerous Branches</h3>
          {loading ? <Skeleton height={200} /> : <Bar data={dangerData} options={barOptions} />}
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
          <h3 className="text-md font-bold text-green-600 dark:text-green-400 mb-2"><FaLeaf className="inline mr-2" /> Most Peaceful Branches</h3>
          {loading ? <Skeleton height={200} /> : <Bar data={peaceData} options={barOptions} />}
        </div>
      </div>

      {/* Latest Reports */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
        <h3 className="text-lg font-semibold text-violet-600 mb-3">🆕 Latest Reports</h3>
        {loading ? (
          <Skeleton count={5} height={40} />
        ) : (
          <table className="w-full text-sm border dark:border-gray-700">
            <thead className="bg-violet-100 dark:bg-violet-900 text-violet-800 dark:text-violet-100">
              <tr>
                <th className="p-2 text-left">Title</th>
                <th className="p-2 text-left">Branch</th>
                <th className="p-2 text-left">Status</th>
                <th className="p-2 text-left">User</th>
              </tr>
            </thead>
            <tbody>
              {stats?.latest?.map((r) => (
                <tr key={r._id} className="border-t dark:border-gray-700">
                  <td className="p-2">{r.title}</td>
                  <td className="p-2">{r.branch || '-'}</td>
                  <td className="p-2 capitalize">
                    <span className={`text-xs font-semibold px-2 py-1 rounded text-white ${
                      r.status === 'solved' ? 'bg-green-600' :
                      r.status === 'pending' ? 'bg-yellow-500' :
                      r.status === 'reviewed' ? 'bg-blue-600' : 'bg-red-500'
                    }`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="p-2">{r.user?.name || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default DistrictDashboard;

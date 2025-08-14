import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import LiveMapModal from '../components/LiveMapModal';
import ReportPreviewModal from '../components/ReportPreviewModal';
import CrimeLiveModel from '../components/CrimeLiveModel';

const DisctrictCrime = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [message, setMessage] = useState(null);
  const [mapOpen, setMapOpen] = useState(false);
  const [trackingReport, setTrackingReport] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);

 const fetchReports = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user?._id;

    if (!userId) return console.error('User not found in localStorage');

    try {
      const res = await axios.get("https://seversecurity-production.up.railway.app/api/reports");
      const filtered = res.data.filter(
        (report) =>
          report.type === 'crime' &&
          report.district?.toLowerCase() === user?.district?.toLowerCase()
      );
      setReports(filtered);
    } catch (err) {
      console.error('Failed to load reports:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    setUpdatingId(id);
    try {
      const user = JSON.parse(localStorage.getItem('user')); // Get logged-in user
      const res = await axios.patch(`https://seversecurity-production.up.railway.app/api/reports/status/${id}`, {
        status: newStatus,
        updatedBy: user?._id,
      });
      setMessage({ type: 'success', text: res.data.message });
      fetchReports();
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'Failed to update status' });
    } finally {
      setUpdatingId(null);
      setTimeout(() => setMessage(null), 2000);
    }
  };

  const handleTrack = (report) => {
    setTrackingReport(report);
    setMapOpen(true);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-violet-600 dark:text-violet-400 mb-4">📋 Crime Reports</h2>

      {message && (
        <div className={`mb-4 px-4 py-2 rounded ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
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
                <th className="p-3">Images</th>
                <th className="p-3 text-left">Title</th>
                <th className="p-3">User</th>
                <th className="p-3">District</th>
                <th className="p-3">Branch</th>
                <th className="p-3">Type</th>
                <th className="p-3">Status</th>
                <th className="p-3">Track</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report._id} className="border-t dark:border-gray-700 cursor-pointer" onClick={() => setSelectedReport(report)}>
                  <td className="p-3">
                    <div className="flex flex-wrap gap-2">
                      {report.images?.map((img, i) => (
                        <img
                          key={i}
                          src={`https://seversecurity-production.up.railway.app/uploads/report/${img}`}
                          alt="crime"
                          className="w-12 h-12 object-cover rounded border"
                        />
                      ))}
                    </div>
                  </td>
                  <td className="p-3 font-medium text-gray-800 dark:text-gray-100">{report.title}</td>
                  <td className="p-3">{report.user?.name}</td>
                  <td className="p-3">{report.district}</td>
                  <td className="p-3">{report.branch || '-'}</td>
                  <td className="p-3 capitalize">{report.type}</td>
                  <td className="p-3">
                    <select
                      onClick={(e) => e.stopPropagation()}
                      value={report.status}
                      disabled={updatingId === report._id}
                      onChange={(e) => handleStatusChange(report._id, e.target.value)}
                      className="px-2 py-1 rounded border text-sm dark:bg-gray-900 dark:text-white"
                    >
                      
                      {report.status === "pending" && <option value="pending">Pending</option>}
                      <option value="reviewed">Reviewed</option>
                      <option value="solved">Solved</option>
                      <option value="fake">Fake</option>
                    </select>
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTrack(report);
                      }}
                      disabled={report.status !== "reviewed"}
                      className={`px-3 py-1 ${report.status === "reviewed" ? "bg-blue-600 hover:bg-blue-700":"bg-blue-300"} text-white text-xs rounded`}
                    >
                      Track
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {mapOpen && trackingReport && (
        // <CrimeLiveModel report={trackingReport} onClose={() => setMapOpen(false)} />

        <CrimeLiveModel
          report={trackingReport}
          onClose={() => {
            setMapOpen(false);
            setTrackingReport(null);
          }}
        />
       
      )}

      {selectedReport && (
        <ReportPreviewModal report={selectedReport} onClose={() => setSelectedReport(null)} />
      )}
    </div>
  );
};

export default DisctrictCrime;

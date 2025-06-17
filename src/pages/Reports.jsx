import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Reports = () => {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/reports');
        setReports(res.data);
      } catch (err) {
        console.error('Error fetching reports:', err.message);
      }
    };

    fetchReports();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">📄 Reports</h1>
      <div className="bg-white shadow rounded p-4 overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="bg-gray-100">
              <th>User</th>
              <th>Type</th>
              <th>Description</th>
              <th>Location</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((rpt) => (
              <tr key={rpt._id} className="border-b">
                <td>{rpt.user?.name}</td>
                <td>{rpt.type}</td>
                <td>{rpt.description}</td>
                <td>{rpt.location?.address || 'Lat: ' + rpt.location?.lat}</td>
                <td>{new Date(rpt.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reports;

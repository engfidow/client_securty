import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Citizens = () => {
  const [citizens, setCitizens] = useState([]);

  const fetchCitizens = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/users/citizens');
      setCitizens(res.data);
    } catch (err) {
      console.error('Failed to fetch citizens:', err.message);
    }
  };

  const updateApproval = async (id, approved) => {
    try {
      await axios.patch(`http://localhost:5000/api/users/approve/${id}`, { approved });
      fetchCitizens(); // Refresh
    } catch (err) {
      console.error('Approval failed:', err.message);
    }
  };

  useEffect(() => {
    fetchCitizens();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">👥 Citizens</h1>
      <div className="bg-white shadow rounded p-4 overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="bg-gray-100">
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Approved</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {citizens.map((citizen) => (
              <tr key={citizen._id} className="border-b">
                <td>{citizen.name}</td>
                <td>{citizen.email}</td>
                <td>{citizen.phone}</td>
                <td>{citizen.approved ? '✅' : '❌'}</td>
                <td>
                  <button
                    onClick={() => updateApproval(citizen._id, !citizen.approved)}
                    className={`px-3 py-1 rounded text-white ${
                      citizen.approved ? 'bg-red-500' : 'bg-green-600'
                    }`}
                  >
                    {citizen.approved ? 'Reject' : 'Approve'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Citizens;

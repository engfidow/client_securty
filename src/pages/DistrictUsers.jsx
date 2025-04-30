import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MdEdit, MdDelete, MdAddCircle } from 'react-icons/md';

const DistrictUsers = () => {
  const [usersByDistrict, setUsersByDistrict] = useState({});
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    district: '',
    password: '',
    confirmPassword: '',
    role: 'police',
    status: 'inactive',
  });
  const [image, setImage] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const districts = [
    "Abdiaziz", "Bondhere", "Daynile", "Dharkenley", "Hamar Jajab",
    "Hamar Weyne", "Hodan", "Howlwadaag", "Kahda", "Karaan",
    "Shangani", "Shibis", "Waberi", "Wadajir", "Warta Nabadda", "Yaqshid"
  ];

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get('http://localhost:5000/api/users/district-users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsersByDistrict(res.data);
    } catch (err) {
      console.error('Error fetching users by district:', err);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (user = null) => {
    setEditingUser(user);
    if (user) {
      setForm({
        name: user.name,
        email: user.email,
        phone: user.phone,
        district: user.district,
        password: '',
        confirmPassword: '',
        role: 'police',
        status: user.status || 'inactive',
      });
    } else {
      setForm({
        name: '',
        email: '',
        phone: '',
        district: '',
        password: '',
        confirmPassword: '',
        role: 'police',
        status: 'inactive',
      });
    }
    setErrors({});
    setImage(null);
    setModalOpen(true);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name) newErrors.name = 'Full Name is required';
    if (!form.email) newErrors.email = 'Email is required';
    if (!form.phone) newErrors.phone = 'Phone number is required';
    if (!form.district) newErrors.district = 'District is required';
    if (!editingUser && !form.password) newErrors.password = 'Password is required';
    if (form.password !== form.confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => formData.append(key, value));
    if (image) formData.append('image', image);

    const token = localStorage.getItem('token');
    try {
      if (editingUser) {
        await axios.put(`http://localhost:5000/api/users/update/${editingUser._id}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post(`http://localhost:5000/api/users/register`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      fetchUsers();
      setModalOpen(false);
    } catch (err) {
      console.error(err);
      setErrors({ general: err.response?.data?.message || 'Failed to save user' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (userId) => {
    const token = localStorage.getItem('token');
    if (window.confirm('Are you sure you want to delete this user?')) {
      await axios.delete(`http://localhost:5000/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-violet-600">Police Users by District</h2>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
        >
          <MdAddCircle size={20} /> Add Police
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        Object.entries(usersByDistrict).map(([district, users]) => (
          <div key={district} className="mb-8 bg-white p-4 rounded shadow-md">
            <h3 className="text-lg font-semibold text-violet-500 mb-4">{district}</h3>
            <table className="w-full text-sm text-left border">
              <thead className="bg-violet-100 text-violet-700">
                <tr>
                  <th className="p-2">Name</th>
                  <th className="p-2">Email</th>
                  <th className="p-2">Phone</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className="border-t">
                    <td className="p-2">{user.name}</td>
                    <td className="p-2">{user.email}</td>
                    <td className="p-2">{user.phone}</td>
                    <td className="p-2">{user.status}</td>
                    <td className="p-2 flex gap-2">
                      <button onClick={() => openModal(user)} className="text-blue-600 hover:underline"><MdEdit /></button>
                      <button onClick={() => handleDelete(user._id)} className="text-red-600 hover:underline"><MdDelete /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))
      )}

      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg">
            <h2 className="text-xl font-semibold mb-4">{editingUser ? 'Edit User' : 'Add Police'}</h2>
            {errors.general && <div className="mb-3 text-red-600 text-sm">{errors.general}</div>}
            <form onSubmit={handleSubmit} className="space-y-3">
              <input type="text" name="name" placeholder="Full Name" className="w-full border px-3 py-2 rounded" value={form.name} onChange={handleChange} />
              {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
              <input type="email" name="email" placeholder="Email" className="w-full border px-3 py-2 rounded" value={form.email} onChange={handleChange} />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
              <input type="text" name="phone" placeholder="Phone Number" className="w-full border px-3 py-2 rounded" value={form.phone} onChange={handleChange} />
              {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
              <select name="district" className="w-full border px-3 py-2 rounded" value={form.district} onChange={handleChange}>
                <option value="">Select District</option>
                {districts.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
              {errors.district && <p className="text-red-500 text-sm">{errors.district}</p>}
              <select name="status" className="w-full border px-3 py-2 rounded" value={form.status} onChange={handleChange}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              {!editingUser && (
                <>
                  <input type="password" name="password" placeholder="Password" className="w-full border px-3 py-2 rounded" value={form.password} onChange={handleChange} />
                  {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                  <input type="password" name="confirmPassword" placeholder="Confirm Password" className="w-full border px-3 py-2 rounded" value={form.confirmPassword} onChange={handleChange} />
                  {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
                </>
              )}
              <input type="file" onChange={(e) => setImage(e.target.files[0])} className="w-full" />
              <div className="flex justify-between mt-4">
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded">Cancel</button>
                <button type="submit" disabled={submitting} className="px-4 py-2 bg-violet-600 text-white hover:bg-violet-700 rounded">
                  {submitting ? 'Saving...' : editingUser ? 'Update' : 'Register'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DistrictUsers;

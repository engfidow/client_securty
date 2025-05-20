// DistrictUsers.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { MdEdit, MdDelete, MdAddCircle } from 'react-icons/md';

const DistrictUsers = () => {
  const [usersByDistrict, setUsersByDistrict] = useState({});
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [form, setForm] = useState({
    name: '', email: '', phone: '', district: '', password: '', confirmPassword: '',
    role: 'police', status: 'inactive'
  });
  const [image, setImage] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const districts = [
    "Abdiaziz", "Bondhere", "Daynile", "Dharkenley", "Hamar Jajab", "Hamar Weyne", "Hodan",
    "Howlwadaag", "Kahda", "Karaan", "Shangani", "Shibis", "Waberi", "Wadajir",
    "Warta Nabadda", "Yaqshid"
  ];

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get('http://localhost:5000/api/users/district-users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsersByDistrict(res.data);
      setAllUsers(Object.values(res.data).flat());
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (user = null) => {
    setEditingUser(user);
    setForm(user ? {
      name: user.name, email: user.email, phone: user.phone, district: user.district,
      password: '', confirmPassword: '', role: user.role || 'police', status: user.status || 'inactive'
    } : {
      name: '', email: '', phone: '', district: '', password: '', confirmPassword: '', role: 'police', status: 'inactive'
    });
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
    Object.entries(form).forEach(([key, val]) => formData.append(key, val));
    if (image) formData.append('image', image);
    const token = localStorage.getItem('token');

    try {
      const url = editingUser
        ? `http://localhost:5000/api/users/update/${editingUser._id}`
        : `http://localhost:5000/api/users/register`;
      const method = editingUser ? axios.put : axios.post;
      await method(url, formData, { headers: { Authorization: `Bearer ${token}` } });
      fetchUsers();
      setModalOpen(false);
    } catch (err) {
      setErrors({ general: err.response?.data?.message || 'Failed to save user' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (userId) => {
    const token = localStorage.getItem('token');
    if (window.confirm('Are you sure?')) {
      await axios.delete(`http://localhost:5000/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-900 text-gray-800 dark:text-white min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-violet-600 dark:text-violet-400">District User Management</h2>
        <button onClick={() => openModal()} className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
          <MdAddCircle size={20} /> Add User
        </button>
      </div>

      {loading ? (
        <Skeleton count={6} height={40} className="rounded mb-2" />
      ) : (
        <div className="overflow-x-auto rounded shadow bg-white dark:bg-gray-800">
          <table className="w-full text-sm text-left">
            <thead className="bg-violet-100 text-violet-700 dark:bg-gray-700 dark:text-violet-300">
              <tr>
                <th className="p-3">Name</th><th className="p-3">Email</th>
                <th className="p-3">Phone</th><th className="p-3">District</th>
                <th className="p-3">Role</th><th className="p-3">Status</th><th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {allUsers.map(user => (
                <tr key={user._id} className="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="p-3">{user.name}</td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3">{user.phone}</td>
                  <td className="p-3">{user.district}</td>
                  <td className="p-3 capitalize">{user.role}</td>
                  <td className="p-3 capitalize">{user.status}</td>
                  <td className="p-3 flex gap-2">
                    <button onClick={() => openModal(user)} className="bg-blue-600 p-2 rounded text-white hover:bg-blue-700"><MdEdit /></button>
                    <button onClick={() => handleDelete(user._id)} className="bg-red-600 p-2 rounded text-white hover:bg-red-700"><MdDelete /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-3xl">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">{editingUser ? 'Edit User' : 'Add User'}</h2>
            {errors.general && <div className="mb-3 text-red-600 text-sm">{errors.general}</div>}
            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><label className="text-sm font-medium">Full Name</label><input name="name" value={form.name} onChange={handleChange} className="w-full border px-3 py-2 rounded" />{errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}</div>
              <div><label className="text-sm font-medium">Email</label><input name="email" value={form.email} onChange={handleChange} className="w-full border px-3 py-2 rounded" />{errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}</div>
              <div><label className="text-sm font-medium">Phone</label><input name="phone" value={form.phone} onChange={handleChange} className="w-full border px-3 py-2 rounded" />{errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}</div>
              <div><label className="text-sm font-medium">District</label><select name="district" value={form.district} onChange={handleChange} className="w-full border px-3 py-2 rounded">
                <option value="">Select</option>{districts.map(d => <option key={d}>{d}</option>)}</select>{errors.district && <p className="text-red-500 text-sm">{errors.district}</p>}</div>
              <div><label className="text-sm font-medium">Role</label><select name="role" value={form.role} onChange={handleChange} className="w-full border px-3 py-2 rounded">
                <option value="police">Police</option><option value="branch">Branch</option></select></div>
              <div><label className="text-sm font-medium">Status</label><select name="status" value={form.status} onChange={handleChange} className="w-full border px-3 py-2 rounded">
                <option value="active">Active</option><option value="inactive">Inactive</option></select></div>
              {!editingUser && <>
                <div><label className="text-sm font-medium">Password</label><input type="password" name="password" value={form.password} onChange={handleChange} className="w-full border px-3 py-2 rounded" />{errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}</div>
                <div><label className="text-sm font-medium">Confirm Password</label><input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} className="w-full border px-3 py-2 rounded" />{errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}</div>
              </>}
              <div className="sm:col-span-2">
  <label className="block text-sm font-medium text-gray-700 mb-1">Upload Image</label>
  <div className="flex items-center justify-center w-full">
    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition">
      <div className="flex flex-col items-center justify-center pt-5 pb-6">
        <svg className="w-8 h-8 mb-3 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 16l-4-4m0 0l4-4m-4 4h18"></path>
        </svg>
        <p className="mb-1 text-sm text-gray-500"><span className="font-semibold">Click to upload</span></p>
        <p className="text-xs text-gray-500">PNG, JPG, JPEG </p>
      </div>
      <input type="file" className="hidden" onChange={(e) => setImage(e.target.files[0])} />
    </label>
  </div>
</div>

              <div className="sm:col-span-2 flex justify-between mt-4">
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

import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    district: '',
    password: '',
    confirmPassword: '',
    role: 'police',
  });
  const [image, setImage] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const districts = [
    "Abdiaziz", "Bondhere", "Daynile", "Dharkenley", "Hamar Jajab",
    "Hamar Weyne", "Hodan", "Howlwadaag", "Kahda", "Karaan",
    "Shangani", "Shibis", "Waberi", "Wadajir", "Warta Nabadda", "Yaqshid"
  ];

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
    if (!form.password) newErrors.password = 'Password is required';
    if (!form.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    if (form.password !== form.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => formData.append(key, value));
    if (image) formData.append('image', image);

    try {
      await axios.post('http://localhost:5000/api/users/register', formData);
      setLoading(false);
      navigate('/login');
    } catch (err) {
      setErrors({ general: err.response?.data?.message || 'Registration failed' });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center text-violet-600 dark:text-violet-400 mb-6">
          👮 Police Register
        </h2>

        {errors.general && (
          <div className="mb-4 bg-red-100 text-red-700 border border-red-300 rounded px-4 py-2 text-sm">
            ⚠️ {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
          <div>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              className="input-field w-full"
              value={form.name}
              onChange={handleChange}
            />
            {errors.name && <label className="text-red-500 text-sm">{errors.name}</label>}
          </div>

          <div>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              className="input-field w-full"
              value={form.email}
              onChange={handleChange}
            />
            {errors.email && <label className="text-red-500 text-sm">{errors.email}</label>}
          </div>

          <div>
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              className="input-field w-full"
              value={form.phone}
              onChange={handleChange}
            />
            {errors.phone && <label className="text-red-500 text-sm">{errors.phone}</label>}
          </div>

          <div>
            <select
              name="district"
              className="input-field w-full"
              value={form.district}
              onChange={handleChange}
            >
              <option value="">Select District</option>
              {districts.map((district) => (
                <option key={district} value={district}>
                  {district}
                </option>
              ))}
            </select>
            {errors.district && <label className="text-red-500 text-sm">{errors.district}</label>}
          </div>

          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="input-field w-full"
              value={form.password}
              onChange={handleChange}
            />
            {errors.password && <label className="text-red-500 text-sm">{errors.password}</label>}
          </div>

          <div>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              className="input-field w-full"
              value={form.confirmPassword}
              onChange={handleChange}
            />
            {errors.confirmPassword && (
              <label className="text-red-500 text-sm">{errors.confirmPassword}</label>
            )}
          </div>

          <div>
            <input
              type="file"
              name="image"
              onChange={(e) => setImage(e.target.files[0])}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md transition"
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-violet-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;

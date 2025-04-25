import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [form, setForm] = useState({
    name: '',
    nationalId: '',
    email: '',
    phone: '',
    password: '',
    role: 'police', // or 'citizen'
  });
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => formData.append(key, value));
    if (image) formData.append('image', image);

    try {
      await axios.post('http://localhost:5000/api/users/register', formData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl mb-4">Register</h1>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input type="text" name="name" placeholder="Name" onChange={handleChange} className="border p-2 w-full mb-2" />
        <input type="text" name="nationalId" placeholder="National ID" onChange={handleChange} className="border p-2 w-full mb-2" />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} className="border p-2 w-full mb-2" />
        <input type="text" name="phone" placeholder="Phone" onChange={handleChange} className="border p-2 w-full mb-2" />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} className="border p-2 w-full mb-2" />
        <select name="role" onChange={handleChange} className="border p-2 w-full mb-2">
          <option value="citizen">Citizen</option>
          <option value="police">Police</option>
        </select>
        <input type="file" name="image" onChange={(e) => setImage(e.target.files[0])} className="mb-2" />
        <button type="submit" className="bg-green-600 text-white px-4 py-2">Register</button>
      </form>
    </div>
  );
};

export default Register;
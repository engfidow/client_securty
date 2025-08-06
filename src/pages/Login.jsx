import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setLoading(true);

  try {
    const res = await axios.post('https://security991.onrender.com/api/users/login', {
      email,
      password,
    });

    const user = res.data.user;

    if (user.status === 'inactive') {
      setError('Your account is not active yet. Please wait for admin approval.');
      setLoading(false);
      return;
    }

    localStorage.setItem('token', res.data.token);
    localStorage.setItem('user', JSON.stringify(user));

    // Redirect based on role
    if (user.role === 'admin') {
      navigate('/dashboard');
    } else if (user.role === 'police') {
      navigate('/district-dashboard');
    } else {
      navigate('/branch-dashboard');
    }

  } catch (err) {
    setError(err.response?.data?.message || 'Login failed');
  } finally {
    setLoading(false);
  }
};

  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center text-violet-600 dark:text-violet-400 mb-6">
          👮 Police Login
        </h2>

        {error && (
          <div className="mb-4 bg-red-100 text-red-700 border border-red-300 rounded px-4 py-2 text-sm">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              className="mt-1 block w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Password
            </label>
            <input
              type="password"
              placeholder="password"
              className="mt-1 block w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full ${loading ? "bg-violet-200" : "bg-violet-600 hover:bg-violet-700"}    text-white font-semibold py-2 px-4 rounded-md transition` }
          >
            {loading ? 'Login...' : 'Login'}
          </button>

          <div className="flex justify-end ">
 
  <Link
    to="/forgot-password"
    className="text-sm text-violet-600 hover:underline"
  >
    Forgot Password?
  </Link>
</div>


        
        </form>
      </div>
    </div>
  );
};

export default Login;

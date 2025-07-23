import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../images/logo.png'; // Make sure you have a logo image in this path
import background from '../images/background.jpg'; // Background image path

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen bg-cover bg-center relative"
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className="absolute inset-0 bg-black/60 flex items-center justify-center px-4">
        <div className="max-w-3xl text-center text-white space-y-6">
          <img src={logo} alt="Logo" className="mx-auto w-28 h-28 rounded-full shadow-lg" />
          <h1 className="text-4xl md:text-5xl font-bold tracking-wide">Report System</h1>
          <p className="text-lg md:text-xl">
            A secure and efficient crime reporting platform designed to help citizens report
            incidents in real-time and assist law enforcement in maintaining public safety.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-semibold transition duration-300 shadow-lg"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

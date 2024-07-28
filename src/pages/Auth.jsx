import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../api/AuthContext';

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(true);
  const { signup, login } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    fullName: '',
    email: ''
  });
  const navigate = useNavigate();

  const toggleAuthMode = () => {
    setIsSignUp((prevMode) => !prevMode);
    setFormData({
      fullName: '',
      email: ''
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSignUp) {
      signup({
        fullName: formData.fullName,
        email: formData.email
      });
      navigate('/');
    } else {
      const success = login({
        email: formData.email
      });
      if (success) {
        navigate('/');
      } else {
        alert('Invalid email');
      }
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-bold text-center text-gray-700">
          {isSignUp ? 'Sign Up' : 'Log In'}
        </h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          {isSignUp && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="block w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="block w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
            >
              {isSignUp ? 'Sign Up' : 'Log In'}
            </button>
          </div>
        </form>
        <p className="text-sm text-center text-gray-600">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            onClick={toggleAuthMode}
            className="text-blue-500 hover:underline focus:outline-none"
          >
            {isSignUp ? 'Log In' : 'Sign Up'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Auth;

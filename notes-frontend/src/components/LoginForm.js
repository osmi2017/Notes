import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Logo } from './Logo';
import { InputField } from './InputField';
import API from './../utils/api'; // Update the import path to where you placed api.js

export function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Use react-router's useNavigate for navigation

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = { username, password };

    try {
      // Send POST request to get the token
      const response = await API.post('/token/', formData);

      console.log('Login response:', response.data); // Log response data

      // Check if response contains the access token
      if (response.data && response.data.access) {
        // Save the token to localStorage
        console.log(response.data)
      
        localStorage.setItem('token', response.data.access);
        localStorage.setItem('refresh_token', response.data.refresh);

        // Log token storage success
        console.log('Token saved to localStorage:', response.data.access);

        // Redirect to homepage
        navigate('/home');
        window.location.reload();
      } else {
        setError('Invalid username or password');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Invalid username or password');
    }
  };

  return (
    <div className="flex overflow-hidden flex-col px-20 pt-16 pb-56 bg-gradient-to-b from-slate-950 via-blue-800 to-purple-700 max-md:px-5 max-md:pb-24">
      <Logo />
      <div className="flex flex-col justify-center self-center px-20 py-12 mt-32 max-w-full bg-white rounded-3xl w-[540px] max-md:px-5 max-md:mt-10">
        <div className="w-full text-3xl font-semibold leading-none text-gray-900">
          Login to your account
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col mt-8 w-full">
          <InputField
            label="Username"
            value={username}
            placeholder="Enter your username"
            type="text"
            onChange={(e) => setUsername(e.target.value)}
          />
          <div className="mt-6">
            <InputField
              label="Password"
              value={password}
              placeholder="Enter your password"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
                
            />
          </div>
          {error && <div className="mt-4 text-red-500">{error}</div>}
          <div className="flex flex-col mt-8 w-full text-base leading-none">
            <button
              type="submit"
              className="gap-1.5 self-stretch px-4 py-5 w-full font-semibold text-gray-50 bg-blue-600 rounded-lg min-h-[52px]"
            >
              Login now
            </button>
            <div className="flex gap-2 items-start self-center mt-6 capitalize">
              <div className="text-gray-400">Don't have an account?</div>
              <button
                type="button"
                className="text-blue-600"
                onClick={() => navigate('/signup')} // Navigate to SignupForm
              >
                Sign up
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

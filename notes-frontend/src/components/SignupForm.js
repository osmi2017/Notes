import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Logo } from './Logo';
import { InputField } from './InputField';
import API from './../utils/api'; // Update the import path to where you placed api.js

export function SignupForm() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const formData = { username, email, password };

    try {
      const response = await API.post('/users/create/', formData);
      console.log('Signup response:', response.data);

      setSuccessMessage('Account created successfully. Redirecting to login...');
      setError(null);

      setTimeout(() => {
        navigate('/'); // Redirect to login page
      }, 3000);
    } catch (err) {
      console.error('Signup error:', err);
      setError('Failed to create account. Please try again.');
    }
  };

  return (
    <div className="flex overflow-hidden flex-col px-20 pt-16 pb-56 bg-gradient-to-b from-slate-950 via-blue-800 to-purple-700 max-md:px-5 max-md:pb-24">
      <Logo />
      <div className="flex flex-col justify-center self-center px-20 py-12 mt-32 max-w-full bg-white rounded-3xl w-[540px] max-md:px-5 max-md:mt-10">
        <div className="w-full text-3xl font-semibold leading-none text-gray-900">
          Create a new account
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
              label="Email"
              value={email}
              placeholder="Enter your email"
              type="email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mt-6">
            <InputField
              label="Password"
              value={password}
              placeholder="Enter your password"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="mt-6">
            <InputField
              label="Confirm Password"
              value={confirmPassword}
              placeholder="Confirm your password"
              type="password"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          {error && (
            <div className="mt-4 text-red-500">{error}</div>
          )}
          {successMessage && (
            <div className="mt-4 text-green-500">{successMessage}</div>
          )}
          <div className="flex flex-col mt-8 w-full text-base leading-none">
            <button
              type="submit"
              className="gap-1.5 self-stretch px-4 py-5 w-full font-semibold text-gray-50 bg-blue-600 rounded-lg min-h-[52px]"
            >
              Sign up now
            </button>
            <div className="flex gap-2 items-start self-center mt-6 capitalize">
              <div className="text-gray-400">Already have an account?</div>
              <button
                type="button"
                className="text-blue-600"
                onClick={() => navigate('/')}
              >
                Login
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

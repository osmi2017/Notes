import React from 'react';

import { Logo } from './Logo';


const Navbar = ({ onLogout }) => {


  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    window.location.href = '/'; // Or use a routing method if you have React Router
  };

  return (
    <nav className="navbar fixed top-0 left-0 right-0 z-20 bg-transparent backdrop-blur-md shadow-md px-6 py-4">
    <div className="navbar-content flex justify-between items-center">
       <Logo />
      <button
        onClick={handleLogout}
        className="bg-red-600 px-4 py-2 rounded-lg text-white hover:bg-red-700 transition-colors duration-300"
      >
        Logout
      </button>
    </div>
  </nav>
  
  );
};

export default Navbar;

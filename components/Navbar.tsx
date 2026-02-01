import React from 'react';
import { useAuth } from '../context/AuthContext';
import Button from './Button';
import { useNavigate } from 'react-router-dom';

interface NavbarProps {
  userName: string | null;
}

const Navbar: React.FC<NavbarProps> = ({ userName }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gray-800 p-4 shadow-md sticky top-0 z-10">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-xl font-bold text-gray-100 flex items-center">
          <svg className="h-6 w-6 mr-2 text-yellow-500" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm.892 15.65h-1.784l-.547-2.628h2.878l.547 2.628zm-2.074-3.528h-.878l-.348-1.666h1.565l.348 1.666zm-.058-2.584h-1.107l-.347-1.66h1.802l-.348 1.66zm-.058-2.583h-1.107l-.348-1.66h1.802l-.347 1.66zM15.46 9.53h-.84l-.348-1.66h1.536l-.348 1.66zm-1.157 2.518h-.84l-.348-1.66h1.536l-.348 1.66zm-.058 2.583h-1.107l-.347-1.66h1.802l-.348 1.66zM12 4.19c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zM12 19.81c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
          </svg>
          Bitcoin Market Monitor
        </div>
        <div className="flex items-center space-x-4">
          {userName && <span className="text-gray-300 hidden sm:block">Welcome, {userName}!</span>}
          <Button onClick={handleLogout} variant="secondary" size="sm">
            Logout
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = '' }) => {
  return (
    <Link to="/" className={`flex items-center ${className}`}>
      <div className="font-bold text-xl tracking-tight">
        <span className="text-purple-600">PURPLE</span>
        <span className="text-pink-500">STARTUPS</span>
      </div>
    </Link>
  );
};

export default Logo; 
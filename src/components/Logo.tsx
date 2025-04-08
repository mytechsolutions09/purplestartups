import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface LogoProps {
  className?: string;
  resetAppState?: () => void;
}

const Logo: React.FC<LogoProps> = ({ className = "", resetAppState }) => {
  const navigate = useNavigate();
  
  const handleLogoClick = (e: React.MouseEvent) => {
    if (resetAppState) {
      e.preventDefault();
      resetAppState();
      navigate('/');
    }
  };
  
  return (
    <Link 
      to="/" 
      className={`flex items-center ${className} cursor-pointer`}
      onClick={handleLogoClick}
    >
      <div className="logo-container flex items-center">
        <span className="text-[#7B00FF] font-bold text-xl">PURPLE</span>
        <span className="text-[#FF0185] font-bold text-xl ml-2">STARTUPS</span>
      </div>
    </Link>
  );
};

export default Logo;

// Alternative JSX implementation if you want to use text styling instead of an image:
// 
// const Logo: React.FC = () => {
//   return (
//     <div className="logo-container">
//       <span className="text-purple-700 font-bold text-2xl">PURPLE</span>
//       <span className="text-pink-600 font-bold text-2xl">STARTUPS</span>
//     </div>
//   );
// }; 
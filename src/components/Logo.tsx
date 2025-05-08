import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface LogoProps {
  className?: string;
  resetAppState?: () => void;
  asLink?: boolean;
  linkTo?: string;
}

const Logo: React.FC<LogoProps> = ({ 
  className = '',
  resetAppState,
  asLink = true,
  linkTo = '/'
}) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    if (resetAppState) {
      resetAppState();
    }
    
    if (!asLink) {
      navigate(linkTo);
    }
  };
  
  const logoContent = (
    <div className="logo-container flex items-center">
      <span className="text-[#7B00FF] font-bold text-xl">PURPLE</span>
      <span className="text-[#FF0185] font-bold text-xl ml-2">STARTUPS</span>
    </div>
  );
  
  if (asLink) {
    return (
      <Link 
        to={linkTo}
        className={`${className}`}
        onClick={resetAppState}
      >
        {logoContent}
      </Link>
    );
  }
  
  return (
    <div 
      className={`cursor-pointer ${className}`}
      onClick={handleClick}
    >
      {logoContent}
    </div>
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
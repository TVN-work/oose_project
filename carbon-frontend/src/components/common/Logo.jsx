import React from 'react';

const Logo = ({ className = '', ...props }) => {
  return (
    <img 
      src="/logo.png" 
      alt="Carbon Credit Marketplace" 
      className={className}
      {...props}
    />
  );
};

export default Logo;


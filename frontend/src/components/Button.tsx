import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'gold';
}

const variantStyles = {
  primary: 'bg-[#3B82F6] text-white shadow-lg hover:bg-[#1E293B] hover:text-[#E3C77A] hover:scale-105',
  secondary: 'bg-[#F5E9DA] text-[#3B82F6] shadow hover:bg-[#3B82F6] hover:text-[#F5E9DA] hover:scale-105',
  gold: 'bg-[#E3C77A] text-[#1E293B] shadow-lg hover:bg-[#3B82F6] hover:text-white hover:scale-105',
};

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', className = '', ...props }) => {
  return (
    <button
      className={`transition-all duration-200 px-6 py-2 rounded-full font-bold text-lg focus:outline-none focus:ring-2 focus:ring-[#abd3f2] active:scale-95 ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button; 
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => (
  <div className={`bg-white rounded-3xl shadow-xl p-8 transition-all duration-200 hover:shadow-2xl ${className}`}>
    {children}
  </div>
);

export default Card; 
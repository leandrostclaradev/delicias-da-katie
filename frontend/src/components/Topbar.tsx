import React from 'react';

interface TopbarProps {
  title: string;
}

const Topbar: React.FC<TopbarProps> = ({ title }) => {
  return (
    <header className="flex flex-col items-start px-10 py-4 bg-white/80 backdrop-blur-md shadow-sm mb-8 w-full">
      <h1 className="text-2xl font-extrabold text-[#1E293B] tracking-tight drop-shadow">{title}</h1>
    </header>
  );
};

export default Topbar; 
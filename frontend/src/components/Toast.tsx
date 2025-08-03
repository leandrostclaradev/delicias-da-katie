import React from 'react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error';
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type = 'success', onClose }) => {
  return (
    <div className={`fixed top-6 right-6 z-50 px-6 py-3 rounded shadow-lg text-white font-semibold transition-all
      ${type === 'success' ? 'bg-[#abd3f2]' : 'bg-red-500'}`}
      onClick={onClose}
      role="alert"
    >
      {message}
    </div>
  );
};

export default Toast; 
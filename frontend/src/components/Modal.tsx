import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  customSize?: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = 'md', customSize }) => {
  if (!isOpen) return null;

  const getSizeClasses = () => {
    if (customSize) return customSize;
    
    switch (size) {
      case 'sm':
        return 'w-full max-w-sm mx-4';
      case 'md':
        return 'w-full max-w-md mx-4';
      case 'lg':
        return 'w-full max-w-lg mx-4';
      case 'xl':
        return 'w-full max-w-xl mx-4';
      case 'full':
        return 'w-full max-w-7xl mx-4';
      default:
        return 'w-full max-w-md mx-4';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`bg-white rounded-lg p-6 ${getSizeClasses()}`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-[#1E293B]">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal; 
import React, { useState } from 'react';

interface PasswordInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  error?: string;
}

const PasswordInput: React.FC<PasswordInputProps> = ({ label, error, className = '', value, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="relative w-full mb-6">
      <input
        className={`peer w-full px-4 py-3 pr-12 border-2 rounded-xl bg-white text-[#222] placeholder-transparent focus:outline-none focus:border-[#abd3f2] transition-all duration-200 shadow-sm ${error ? 'border-red-400' : 'border-[#d8c7b5]'} ${className}`}
        placeholder={label}
        type={showPassword ? 'text' : 'password'}
        value={value}
        {...props}
      />
      <label
        className={`absolute left-4 text-[#d8c7b5] bg-white px-1 transition-all duration-200 pointer-events-none ${
          value && value.toString().length > 0 
            ? '-top-5 text-xs text-[#abd3f2] bg-white px-1' 
            : 'top-3 text-base peer-focus:-top-5 peer-focus:text-xs peer-focus:text-[#abd3f2] peer-focus:bg-white peer-focus:px-1'
        }`}
      >
        {label}
      </label>
      
      {/* Botão de mostrar/ocultar senha */}
      <button
        type="button"
        onClick={togglePasswordVisibility}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-500 hover:text-[#abd3f2] transition-colors duration-200 focus:outline-none"
        title={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
      >
        {showPassword ? (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        )}
      </button>
      
      {error && <span className="text-xs text-red-500 mt-1 block">{error}</span>}
    </div>
  );
};

export default PasswordInput; 
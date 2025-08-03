import React from 'react';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const FormInput: React.FC<FormInputProps> = ({ label, error, className = '', value, ...props }) => {
  return (
    <div className="relative w-full mb-6">
      <input
        className={`peer w-full px-4 py-3 border-2 rounded-xl bg-white text-[#222] placeholder-transparent focus:outline-none focus:border-[#abd3f2] transition-all duration-200 shadow-sm ${error ? 'border-red-400' : 'border-[#d8c7b5]'} ${className}`}
        placeholder={label}
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
      {error && <span className="text-xs text-red-500 mt-1 block">{error}</span>}
    </div>
  );
};

export default FormInput; 
import React from 'react';

export const Button = ({ label, onClick, variant = "primary" }) => {
  const baseStyle = "px-6 py-2 rounded-lg font-semibold transition";
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-100 text-gray-800 hover:bg-gray-200"
  };

  return (
    <button onClick={onClick} className={`${baseStyle} ${variants[variant]}`}>
      {label}
    </button>
  );
};
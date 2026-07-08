import React from 'react';

export const StatCard = ({ title, value, color = "blue" }) => (
  <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
    <p className="text-sm text-gray-500 font-medium uppercase">{title}</p>
    <p className={`text-3xl font-bold text-${color}-600 mt-2`}>{value}</p>
  </div>
);
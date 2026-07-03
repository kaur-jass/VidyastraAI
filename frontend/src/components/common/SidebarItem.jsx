import React from 'react';

export const SidebarItem = ({ label, icon: Icon, path }) => (
  <a 
    href={path} 
    className="flex items-center gap-3 p-3 text-gray-300 hover:bg-slate-800 hover:text-white rounded-lg transition"
  >
    {Icon && <Icon size={20} />}
    <span className="font-medium">{label}</span>
  </a>
);
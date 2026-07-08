import React from 'react';
import { LayoutDashboard, BookOpen, Video, Users, Settings } from 'lucide-react';

const DashboardLayout = ({ children, role }) => {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white p-6">
        <h1 className="text-2xl font-bold mb-10 text-blue-400">Vidyastra AI</h1>
        <nav className="space-y-4">
          <a href="#" className="flex items-center gap-3 p-2 hover:bg-slate-800 rounded transition"><LayoutDashboard size={20}/> Dashboard</a>
          <a href="#" className="flex items-center gap-3 p-2 hover:bg-slate-800 rounded transition"><BookOpen size={20}/> My Courses</a>
          <a href="#" className="flex items-center gap-3 p-2 hover:bg-slate-800 rounded transition"><Video size={20}/> Live Classes</a>
          <a href="#" className="flex items-center gap-3 p-2 hover:bg-slate-800 rounded transition"><Settings size={20}/> Settings</a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-semibold text-gray-800">Welcome back, {role === 'faculty' ? 'Prof. Amit' : 'Ram'}</h2>
          <div className="bg-white p-2 px-4 rounded-full shadow-sm border border-gray-200">User Profile</div>
        </header>
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
import React from 'react';

interface AdminNavLinkProps {
  icon: React.ReactNode;
  label: string;
  path: string;
  isActive?: boolean;
  onClick?: () => void;
}

export function AdminNavLink({ icon, label, isActive = false, onClick }: AdminNavLinkProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
        isActive
          ? 'bg-indigo-50 text-indigo-600'
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
      }`}
    >
      <div
        className={`mr-3 flex-shrink-0 h-6 w-6 ${
          isActive ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-500'
        }`}
      >
        {icon}
      </div>
      {label}
    </button>
  );
}
import React from 'react';
import { User, Briefcase } from 'lucide-react';

interface RegisterCardProps {
  title: string;
  description: string;
  icon: 'parent' | 'professional';
  onClick: () => void;
}

export function RegisterCard({ title, description, icon, onClick }: RegisterCardProps) {
  return (
    <button
      onClick={onClick}
      className="w-full p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow text-left"
    >
      <div className="flex items-center space-x-4">
        <div className="flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-full">
          {icon === 'parent' ? (
            <User className="w-6 h-6 text-indigo-600" />
          ) : (
            <Briefcase className="w-6 h-6 text-indigo-600" />
          )}
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
          <p className="mt-1 text-gray-600">{description}</p>
        </div>
      </div>
    </button>
  );
}
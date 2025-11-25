import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  colorClass: string;
  description?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon, colorClass, description }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex items-start justify-between transition-all hover:shadow-md">
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
        {description && <p className="text-xs text-gray-400 mt-2">{description}</p>}
      </div>
      <div className={`p-3 rounded-lg ${colorClass} text-white`}>
        {icon}
      </div>
    </div>
  );
};

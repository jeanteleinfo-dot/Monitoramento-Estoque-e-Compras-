import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { Project, SLAStatus } from '../types';
import { SLA_DAYS_WARNING, SLA_DAYS_CRITICAL } from '../constants';

interface ChartsProps {
  projects: Project[];
}

const COLORS = {
  OK: '#22c55e',      // green-500
  WARNING: '#eab308', // yellow-500
  CRITICAL: '#ef4444' // red-500
};

export const Charts: React.FC<ChartsProps> = ({ projects }) => {
  // Data for Pie Chart
  const statusCounts = projects.reduce((acc, curr) => {
    if (curr.diasNaFase > SLA_DAYS_CRITICAL) acc.critical++;
    else if (curr.diasNaFase > SLA_DAYS_WARNING) acc.warning++;
    else acc.ok++;
    return acc;
  }, { ok: 0, warning: 0, critical: 0 });

  const pieData = [
    { name: 'No Prazo (<=5d)', value: statusCounts.ok, color: COLORS.OK },
    { name: 'Atenção (>5d)', value: statusCounts.warning, color: COLORS.WARNING },
    { name: 'Atrasado (>7d)', value: statusCounts.critical, color: COLORS.CRITICAL },
  ].filter(d => d.value > 0);

  // Data for Bar Chart (Top 10 Longest Duration)
  const barData = [...projects]
    .sort((a, b) => b.diasNaFase - a.diasNaFase)
    .slice(0, 10)
    .map(p => ({
      name: p.titulo.length > 20 ? p.titulo.substring(0, 20) + '...' : p.titulo,
      days: p.diasNaFase,
      fullTitle: p.titulo
    }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Bar Chart */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Top 10 - Mais Tempo na Fase</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" hide />
              <YAxis 
                dataKey="name" 
                type="category" 
                width={150} 
                tick={{fontSize: 11, fill: '#64748b'}}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                formatter={(value: number) => [`${value.toFixed(1)} dias`, 'Tempo']}
                labelFormatter={(label) => barData.find(b => b.name === label)?.fullTitle || label}
              />
              <Bar dataKey="days" radius={[0, 4, 4, 0]}>
                {barData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={
                    entry.days > SLA_DAYS_CRITICAL ? COLORS.CRITICAL : 
                    entry.days > SLA_DAYS_WARNING ? COLORS.WARNING : COLORS.OK
                  } />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pie Chart */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Distribuição por Status SLA</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '8px', border: 'none' }} />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};


import React, { useState, useRef, useMemo } from 'react';
import { MultiPhaseProject } from '../types';
import { parseMultiPhaseCSV } from '../utils/csvHelpers';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';
import { StatCard } from './StatCard';

export const SLAControlView: React.FC = () => {
  const [projects, setProjects] = useState<MultiPhaseProject[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (text) {
        const imported = parseMultiPhaseCSV(text);
        if (imported.length > 0) {
          setProjects(imported);
        } else {
          alert('Não foi possível ler o CSV. Certifique-se que o formato é: Titulo; Nº Projeto; Triagem; Kickoff; Estoque');
        }
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const averages = useMemo(() => {
    if (projects.length === 0) return { triagem: 0, kickoff: 0, estoque: 0 };
    
    const total = projects.length;
    return {
      triagem: projects.reduce((acc, p) => acc + p.diasTriagem, 0) / total,
      kickoff: projects.reduce((acc, p) => acc + p.diasKickoff, 0) / total,
      estoque: projects.reduce((acc, p) => acc + p.diasEstoque, 0) / total,
    };
  }, [projects]);

  const chartData = [
    { name: 'Triagem', dias: parseFloat(averages.triagem.toFixed(2)), fill: '#3b82f6' },
    { name: 'Kickoff', dias: parseFloat(averages.kickoff.toFixed(2)), fill: '#8b5cf6' },
    { name: 'Estoque', dias: parseFloat(averages.estoque.toFixed(2)), fill: '#f59e0b' },
  ];

  const topProjectsData = [...projects]
    .sort((a, b) => (b.diasTriagem + b.diasKickoff + b.diasEstoque) - (a.diasTriagem + a.diasKickoff + a.diasEstoque))
    .slice(0, 10)
    .map(p => ({
        name: p.titulo.length > 15 ? p.titulo.substring(0, 15) + '...' : p.titulo,
        fullTitle: p.titulo,
        Triagem: p.diasTriagem,
        Kickoff: p.diasKickoff,
        Estoque: p.diasEstoque
    }));

  return (
    <div className="animate-fade-in space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-slate-800">Controle de SLA por Fase</h2>
          <p className="text-sm text-gray-500">Comparativo e análise média de tempo em cada etapa.</p>
        </div>
        
        <div className="flex items-center gap-4">
            <input 
               type="file" 
               accept=".csv" 
               ref={fileInputRef}
               className="hidden"
               onChange={handleFileUpload}
             />
             <button 
               onClick={() => fileInputRef.current?.click()}
               className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white border border-transparent rounded-lg text-sm font-medium transition-all shadow-md"
             >
               <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
               </svg>
               Importar Dados SLA
             </button>
        </div>
      </div>

      {projects.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-gray-300 rounded-xl p-12 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900">Nenhum dado carregado</h3>
            <p className="text-gray-500 mt-1">Importe um arquivo CSV com as colunas: Título, Nº Projeto, Triagem, Kickoff, Estoque.</p>
            <button 
               onClick={() => fileInputRef.current?.click()}
               className="mt-4 text-indigo-600 hover:text-indigo-800 font-medium"
            >
                Selecionar Arquivo
            </button>
        </div>
      ) : (
        <>
            {/* Average Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard 
                    title="Média Triagem"
                    value={`${averages.triagem.toFixed(1)} dias`}
                    icon={<span className="text-xl font-bold">T</span>}
                    colorClass="bg-blue-500"
                />
                <StatCard 
                    title="Média Kickoff"
                    value={`${averages.kickoff.toFixed(1)} dias`}
                    icon={<span className="text-xl font-bold">K</span>}
                    colorClass="bg-purple-500"
                />
                <StatCard 
                    title="Média Estoque"
                    value={`${averages.estoque.toFixed(1)} dias`}
                    icon={<span className="text-xl font-bold">E</span>}
                    colorClass="bg-amber-500"
                />
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Average Comparison Chart */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-6">Comparativo de Média por Fase</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} layout="vertical" margin={{ left: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={true} />
                                <XAxis type="number" />
                                <YAxis dataKey="name" type="category" />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                    formatter={(value: number) => [`${value} dias`, 'Média']}
                                />
                                <Bar dataKey="dias" radius={[0, 4, 4, 0]}>
                                    {/* Colors are handled in data payload or via cell, but simpler here since data has fill */}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Top 10 Stacked Chart */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-6">Top 10 Projetos Mais Longos (Soma das Fases)</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={topProjectsData} margin={{ left: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" tick={{fontSize: 10}} interval={0} angle={-15} textAnchor="end" height={60} />
                                <YAxis />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                    labelFormatter={(label) => topProjectsData.find(p => p.name === label)?.fullTitle || label}
                                />
                                <Legend verticalAlign="top" height={36}/>
                                <Bar dataKey="Triagem" stackId="a" fill="#3b82f6" />
                                <Bar dataKey="Kickoff" stackId="a" fill="#8b5cf6" />
                                <Bar dataKey="Estoque" stackId="a" fill="#f59e0b" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Detailed Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-5 border-b border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800">Detalhamento dos Projetos Importados</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4">Projeto</th>
                                <th className="px-6 py-4 text-center">Triagem (dias)</th>
                                <th className="px-6 py-4 text-center">Kickoff (dias)</th>
                                <th className="px-6 py-4 text-center">Estoque (dias)</th>
                                <th className="px-6 py-4 text-center font-bold">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {projects.map((project) => (
                                <tr key={project.id} className="hover:bg-slate-50">
                                    <td className="px-6 py-4 font-medium text-gray-800">
                                        {project.titulo}
                                        <span className="block text-xs text-gray-400 font-normal">{project.numeroProjeto}</span>
                                    </td>
                                    <td className="px-6 py-4 text-center text-blue-600">{project.diasTriagem.toFixed(2)}</td>
                                    <td className="px-6 py-4 text-center text-purple-600">{project.diasKickoff.toFixed(2)}</td>
                                    <td className="px-6 py-4 text-center text-amber-600">{project.diasEstoque.toFixed(2)}</td>
                                    <td className="px-6 py-4 text-center font-bold text-gray-800">
                                        {(project.diasTriagem + project.diasKickoff + project.diasEstoque).toFixed(2)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
      )}
    </div>
  );
};

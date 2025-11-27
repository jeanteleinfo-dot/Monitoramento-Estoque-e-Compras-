
import React, { useState, useMemo, useRef } from 'react';
import { Project } from '../types';
import { StatCard } from './StatCard';
import { Charts } from './Charts';
import { ProjectTable } from './ProjectTable';
import { EmailModal } from './EmailModal';
import { SLA_DAYS_WARNING, SLA_DAYS_CRITICAL } from '../constants';
import { parseProjectsCSV } from '../utils/csvHelpers';

interface StockMonitoringViewProps {
  projects: Project[];
  onUpdateProjects: (projects: Project[]) => void;
}

export const StockMonitoringView: React.FC<StockMonitoringViewProps> = ({ projects, onUpdateProjects }) => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Calculate Summary Stats
  const stats = useMemo(() => {
    const total = projects.length;
    const delayed = projects.filter(p => p.diasNaFase > SLA_DAYS_CRITICAL).length;
    const warning = projects.filter(p => p.diasNaFase > SLA_DAYS_WARNING && p.diasNaFase <= SLA_DAYS_CRITICAL).length;
    const onTime = projects.filter(p => p.diasNaFase <= SLA_DAYS_WARNING).length;
    const avgDays = total > 0 ? projects.reduce((acc, curr) => acc + curr.diasNaFase, 0) / total : 0;

    return { total, delayed, warning, onTime, avgDays };
  }, [projects]);

  const handleEmailClick = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (text) {
        const importedProjects = parseProjectsCSV(text);
        if (importedProjects.length > 0) {
          onUpdateProjects(importedProjects);
          alert(`${importedProjects.length} projetos importados com sucesso!`);
        } else {
          alert('Não foi possível ler os projetos do arquivo CSV. Verifique o formato.');
        }
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  return (
    <div className="animate-fade-in">
      {/* Sub-Header / Actions */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-slate-800">Painel de Estoque e Compras</h2>
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
               className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600 hover:border-blue-300 transition-all shadow-sm"
             >
               <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
               </svg>
               Importar CSV
             </button>
             
             <div className="h-8 w-px bg-gray-200 hidden sm:block"></div>
             
             <div className="flex items-center gap-2 hidden sm:flex">
               <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                <span className="text-sm font-medium text-gray-600">Ao Vivo</span>
             </div>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Total de Projetos" 
          value={stats.total} 
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>}
          colorClass="bg-blue-500"
        />
        <StatCard 
          title="Média de Dias na Fase" 
          value={stats.avgDays.toFixed(1)} 
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          colorClass="bg-indigo-500"
          description="Objetivo: 5.0"
        />
        <StatCard 
          title="Projetos em Alerta (>5d)" 
          value={stats.warning} 
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>}
          colorClass="bg-yellow-500"
        />
        <StatCard 
          title="Projetos Atrasados (>7d)" 
          value={stats.delayed} 
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          colorClass="bg-red-500"
        />
      </div>

      {/* Charts Section */}
      <Charts projects={projects} />

      {/* List Section */}
      <ProjectTable projects={projects} onEmailClick={handleEmailClick} />

      {/* Modals */}
      <EmailModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        project={selectedProject} 
      />
    </div>
  );
};

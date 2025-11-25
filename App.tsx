import React, { useState, useMemo } from 'react';
import { INITIAL_PROJECTS, SLA_DAYS_WARNING, SLA_DAYS_CRITICAL } from './constants';
import { ProjectTable } from './components/ProjectTable';
import { StatCard } from './components/StatCard';
import { Charts } from './components/Charts';
import { EmailModal } from './components/EmailModal';
import { Project } from './types';

function App() {
  const [projects] = useState<Project[]>(INITIAL_PROJECTS);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Calculate Summary Stats
  const stats = useMemo(() => {
    const total = projects.length;
    const delayed = projects.filter(p => p.diasNaFase > SLA_DAYS_CRITICAL).length;
    const warning = projects.filter(p => p.diasNaFase > SLA_DAYS_WARNING && p.diasNaFase <= SLA_DAYS_CRITICAL).length;
    const onTime = projects.filter(p => p.diasNaFase <= SLA_DAYS_WARNING).length;
    const avgDays = projects.reduce((acc, curr) => acc + curr.diasNaFase, 0) / total;

    return { total, delayed, warning, onTime, avgDays };
  }, [projects]);

  const handleEmailClick = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">Monitoramento Estoque e Compras</h1>
          </div>
          <div className="flex items-center gap-4">
             <div className="text-right hidden sm:block">
               <p className="text-xs text-gray-400 font-medium">SLA Objetivo</p>
               <p className="text-sm font-bold text-slate-700">5 Dias</p>
             </div>
             <div className="h-8 w-px bg-gray-200 hidden sm:block"></div>
             <div className="flex items-center gap-2">
               <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                <span className="text-sm font-medium text-gray-600">Atualizado Agora</span>
             </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
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

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500">
          <p>© 2024 Monitoramento de Projetos. Todos os direitos reservados.</p>
        </div>
      </footer>

      {/* Modals */}
      <EmailModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        project={selectedProject} 
      />
    </div>
  );
}

export default App;

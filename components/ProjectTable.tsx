import React, { useState } from 'react';
import { Project, SLAStatus } from '../types';
import { SLA_DAYS_WARNING, SLA_DAYS_CRITICAL } from '../constants';

interface ProjectTableProps {
  projects: Project[];
  onEmailClick: (project: Project) => void;
}

const getSLAStatus = (days: number): SLAStatus => {
  if (days > SLA_DAYS_CRITICAL) return SLAStatus.CRITICAL;
  if (days > SLA_DAYS_WARNING) return SLAStatus.WARNING;
  return SLAStatus.OK;
};

export const ProjectTable: React.FC<ProjectTableProps> = ({ projects, onEmailClick }) => {
  const [filter, setFilter] = useState<'ALL' | 'DELAYED' | 'WARNING'>('ALL');

  const filteredProjects = projects.filter(p => {
    const status = getSLAStatus(p.diasNaFase);
    if (filter === 'DELAYED') return status === SLAStatus.CRITICAL;
    if (filter === 'WARNING') return status === SLAStatus.WARNING;
    return true;
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-5 border-b border-gray-100 flex justify-between items-center">
        <h3 className="text-lg font-bold text-gray-800">Detalhamento dos Projetos</h3>
        <div className="flex gap-2">
          <button 
            onClick={() => setFilter('ALL')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-colors ${filter === 'ALL' ? 'bg-slate-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            Todos
          </button>
           <button 
            onClick={() => setFilter('WARNING')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-colors ${filter === 'WARNING' ? 'bg-yellow-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            Atenção ({projects.filter(p => getSLAStatus(p.diasNaFase) === SLAStatus.WARNING).length})
          </button>
          <button 
            onClick={() => setFilter('DELAYED')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-colors ${filter === 'DELAYED' ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            Atrasados ({projects.filter(p => getSLAStatus(p.diasNaFase) === SLAStatus.CRITICAL).length})
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
            <tr>
              <th className="px-6 py-4">Projetos</th>
              <th className="px-6 py-4">Centro de Controle</th>
              <th className="px-6 py-4">Início na Fase</th>
              <th className="px-6 py-4 text-center">Dias na Fase</th>
              <th className="px-6 py-4 text-center">Status</th>
              <th className="px-6 py-4 text-center">Entrega Teleinfo</th>
              <th className="px-6 py-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredProjects.map((project) => {
              const status = getSLAStatus(project.diasNaFase);
              return (
                <tr key={project.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4 font-medium text-gray-800 max-w-xs truncate" title={project.titulo}>
                    {project.titulo}
                  </td>
                  <td className="px-6 py-4 text-gray-600 text-xs max-w-[200px] truncate" title={project.numeroProjeto}>
                    {project.numeroProjeto}
                  </td>
                  <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                    {new Date(project.inicioFase).toLocaleDateString('pt-BR')}
                    <span className="block text-xs text-gray-400">
                      {new Date(project.inicioFase).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-block px-3 py-1 rounded-md font-bold text-sm ${
                      status === SLAStatus.CRITICAL ? 'bg-red-50 text-red-600' :
                      status === SLAStatus.WARNING ? 'bg-yellow-50 text-yellow-600' :
                      'bg-green-50 text-green-600'
                    }`}>
                      {project.diasNaFase.toFixed(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                     {status === SLAStatus.CRITICAL && <span className="text-xs font-bold text-red-500 uppercase tracking-wider">Crítico</span>}
                     {status === SLAStatus.WARNING && <span className="text-xs font-bold text-yellow-500 uppercase tracking-wider">Atenção</span>}
                     {status === SLAStatus.OK && <span className="text-xs font-bold text-green-500 uppercase tracking-wider">No Prazo</span>}
                  </td>
                  <td className="px-6 py-4 text-center text-gray-500 whitespace-nowrap">
                    {project.entregaTeleinfo ? new Date(project.entregaTeleinfo).toLocaleDateString('pt-BR') : '-'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => onEmailClick(project)}
                      className="text-gray-400 hover:text-blue-600 p-2 rounded-full hover:bg-blue-50 transition-all"
                      title="Enviar Email de Cobrança"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filteredProjects.length === 0 && (
          <div className="p-8 text-center text-gray-400">
            Nenhum projeto encontrado com este filtro.
          </div>
        )}
      </div>
    </div>
  );
};

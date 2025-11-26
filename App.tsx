
import React, { useState } from 'react';
import { INITIAL_PROJECTS } from './constants';
import { StockMonitoringView } from './components/StockMonitoringView';
import { SLAControlView } from './components/SLAControlView';

function App() {
  const [activeTab, setActiveTab] = useState<'STOCK' | 'SLA'>('STOCK');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg shadow-blue-200 shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight hidden md:block">Gestão de Projetos</h1>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight md:hidden">Gestão</h1>
          </div>
          
          {/* Tabs Navigation */}
          <nav className="flex space-x-1 rounded-lg bg-slate-100 p-1">
             <button
               onClick={() => setActiveTab('STOCK')}
               className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                 activeTab === 'STOCK' 
                 ? 'bg-white text-blue-700 shadow-sm' 
                 : 'text-gray-500 hover:text-gray-700'
               }`}
             >
               Estoque & Compras
             </button>
             <button
               onClick={() => setActiveTab('SLA')}
               className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                 activeTab === 'SLA' 
                 ? 'bg-white text-indigo-700 shadow-sm' 
                 : 'text-gray-500 hover:text-gray-700'
               }`}
             >
               Controle SLA (Fases)
             </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'STOCK' ? (
           <StockMonitoringView initialProjects={INITIAL_PROJECTS} />
        ) : (
           <SLAControlView />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500">
          <p>© 2024 Gestão de Projetos Integrada. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;

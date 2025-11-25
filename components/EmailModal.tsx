import React, { useState, useEffect } from 'react';
import { Project } from '../types';
import { generateEmailDraft } from '../services/geminiService';

interface EmailModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

export const EmailModal: React.FC<EmailModalProps> = ({ project, isOpen, onClose }) => {
  const [draft, setDraft] = useState('');
  const [recipient, setRecipient] = useState('');
  const [subject, setSubject] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && project) {
      setLoading(true);
      setRecipient(''); // Reset recipient
      setSubject(`Acompanhamento: ${project.titulo}`); // Set default subject
      
      generateEmailDraft({
        projectName: project.titulo,
        daysInPhase: project.diasNaFase
      })
      .then(text => setDraft(text))
      .catch(() => setDraft("Erro ao gerar rascunho."))
      .finally(() => setLoading(false));
    } else {
      setDraft('');
    }
  }, [isOpen, project]);

  const handleSendEmail = () => {
    if (!recipient) {
      alert("Por favor, preencha o campo 'Para' com o email do responsável.");
      return;
    }

    // Create mailto link to open default mail client
    const mailtoLink = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(draft)}`;
    
    // Open the mail client
    window.location.href = mailtoLink;
    
    // Close modal
    onClose();
  };

  if (!isOpen || !project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-fade-in">
        <div className="bg-slate-900 px-6 py-4 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
            Enviar Cobrança
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-6 bg-white">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Para:</label>
            <input 
              type="email" 
              className="w-full border-gray-300 border rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white text-gray-900 placeholder-gray-400"
              placeholder="responsavel@empresa.com.br" 
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
            />
          </div>

          <div className="mb-4">
             <label className="block text-sm font-medium text-gray-700 mb-1">Assunto:</label>
             <input 
              type="text" 
              className="w-full border-gray-300 border rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white text-gray-900"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mensagem (Gerada por IA):
            </label>
            <div className="relative">
              {loading && (
                <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center z-10 rounded-lg">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              )}
              <textarea 
                className="w-full h-64 border-gray-300 border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none font-sans text-sm leading-relaxed bg-white text-gray-900"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2 text-right">
              Powered by Gemini 2.5 Flash
            </p>
          </div>

          <div className="flex justify-end gap-3">
            <button 
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
            >
              Cancelar
            </button>
            <button 
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-md transition-all flex items-center gap-2"
              onClick={handleSendEmail}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
              Abrir no Email
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
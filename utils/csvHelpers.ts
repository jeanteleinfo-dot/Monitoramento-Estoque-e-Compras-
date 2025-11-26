
import { Project, MultiPhaseProject } from '../types';

export const parseProjectsCSV = (csvText: string): Project[] => {
  const lines = csvText.split(/\r?\n/);
  const projects: Project[] = [];
  
  let startIndex = 0;
  if (lines[0] && (lines[0].includes('Título') || lines[0].includes('Projeto'))) {
    startIndex = 1;
  }
  
  for (let i = startIndex; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const columns = line.split(';');
    
    if (columns.length < 4) continue;
    
    const daysString = columns[3]?.replace(',', '.') || '0';
    const dias = parseFloat(daysString);
    
    projects.push({
      id: `imported-${Date.now()}-${i}`,
      titulo: columns[0]?.trim() || 'Sem Título',
      numeroProjeto: columns[1]?.trim() || '',
      inicioFase: columns[2]?.trim() || '',
      diasNaFase: isNaN(dias) ? 0 : dias,
      entregaTeleinfo: columns[4]?.trim() || ''
    });
  }
  
  return projects;
};

export const parseMultiPhaseCSV = (csvText: string): MultiPhaseProject[] => {
  const lines = csvText.split(/\r?\n/);
  const projects: MultiPhaseProject[] = [];
  
  // Header detection logic
  let startIndex = 0;
  if (lines[0] && (lines[0].toLowerCase().includes('titulo') || lines[0].toLowerCase().includes('título'))) {
    startIndex = 1;
  }
  
  for (let i = startIndex; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const columns = line.split(';');
    
    // Expecting: Titulo; Nº Projeto; Triagem; Kickoff; Estoque_Compras
    if (columns.length < 5) continue;
    
    const parseDays = (val: string) => {
        const num = parseFloat(val?.replace(',', '.') || '0');
        return isNaN(num) ? 0 : num;
    };

    projects.push({
      id: `phase-${Date.now()}-${i}`,
      titulo: columns[0]?.trim() || 'Sem Título',
      numeroProjeto: columns[1]?.trim() || '',
      diasTriagem: parseDays(columns[2]),
      diasKickoff: parseDays(columns[3]),
      diasEstoque: parseDays(columns[4]),
    });
  }
  
  return projects;
}

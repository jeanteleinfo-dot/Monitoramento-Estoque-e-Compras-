import { Project } from '../types';

export const parseProjectsCSV = (csvText: string): Project[] => {
  const lines = csvText.split(/\r?\n/);
  const projects: Project[] = [];
  
  // Start from index 1 to skip header if it exists
  // We detect if the first line is a header by checking for "Título" or "Projeto"
  let startIndex = 0;
  if (lines[0] && (lines[0].includes('Título') || lines[0].includes('Projeto'))) {
    startIndex = 1;
  }
  
  for (let i = startIndex; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    // Split by semicolon as per the user's file format
    const columns = line.split(';');
    
    // Ensure we have enough columns (at least 4 based on the sample)
    // 0: Título
    // 1: Nº Projeto (Centro de controle)
    // 2: Primeira vez que entrou na fase ESTOQUE_COMPRAS
    // 3: Tempo total na fase ESTOQUE_COMPRAS (dias)
    // 4: Entrega Teleinfo
    if (columns.length < 4) continue;
    
    // Parse the days, replacing comma with dot for float conversion
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
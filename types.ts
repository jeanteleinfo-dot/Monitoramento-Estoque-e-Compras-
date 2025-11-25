export interface Project {
  id: string;
  titulo: string; // "Projetos"
  numeroProjeto: string; // "Nº Projeto"
  inicioFase: string; // "Primeira vez que entrou..."
  diasNaFase: number; // "Tempo total..."
  entregaTeleinfo: string;
}

export enum SLAStatus {
  OK = 'OK',
  WARNING = 'WARNING',
  CRITICAL = 'CRITICAL',
}

export interface EmailDraftRequest {
  projectName: string;
  daysInPhase: number;
  managerName?: string;
}

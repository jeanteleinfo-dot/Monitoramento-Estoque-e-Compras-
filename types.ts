
export interface Project {
  id: string;
  titulo: string; // "Projetos"
  numeroProjeto: string; // "Nº Projeto"
  inicioFase: string; // "Primeira vez que entrou..."
  diasNaFase: number; // "Tempo total..."
  entregaTeleinfo: string;
}

export interface MultiPhaseProject {
  id: string;
  titulo: string;
  numeroProjeto: string;
  diasTriagem: number;
  diasKickoff: number;
  diasEstoque: number;
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

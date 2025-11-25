import { Project } from './types';

export const INITIAL_PROJECTS: Project[] = [
  {
    id: '1',
    titulo: 'AUTOMAÇÃO HIDRÔMETRO TB04',
    numeroProjeto: '01.04.25.071 - ENGENHARIA', // Corrected mapping based on context if needed, kept strict to row
    inicioFase: '2025-11-10 11:42:06',
    diasNaFase: 15.24,
    entregaTeleinfo: ''
  },
  {
    id: '2',
    titulo: 'BUAUTOMAÇÃO_HCOR_MPC18A',
    numeroProjeto: '05.04.25.100 - TECNOLOGIA',
    inicioFase: '2025-11-12 14:53:54',
    diasNaFase: 13.10,
    entregaTeleinfo: ''
  },
  {
    id: '3',
    titulo: 'BUAUTOMAÇÃO_HCOR_PME',
    numeroProjeto: '05.04.25.096 - TECNOLOGIA',
    inicioFase: '2025-11-12 14:58:35',
    diasNaFase: 13.10,
    entregaTeleinfo: ''
  },
  {
    id: '4',
    titulo: 'BUAUTOMAÇÃO_HSL_ACESSÓRIO_ACIONADOR_WC',
    numeroProjeto: '05.04.25.072 - TECNOLOGIA',
    inicioFase: '2025-07-29 15:52:55',
    diasNaFase: 119.06,
    entregaTeleinfo: ''
  },
  {
    id: '5',
    titulo: 'BUINFRA_SCALA DC_ATERRAMENTO DO GRADIL PERIMETRAL - JUNDIAÍ',
    numeroProjeto: '01.04.25.051 Teleinfo Engenharia',
    inicioFase: '2025-07-29 11:57:56',
    diasNaFase: 119.23,
    entregaTeleinfo: ''
  },
  {
    id: '6',
    titulo: 'BUINFRA_SCALA_2 PTS TB04',
    numeroProjeto: '01.04.25.071 - ENGENHARIA',
    inicioFase: '2025-11-13 12:49:48',
    diasNaFase: 12.19,
    entregaTeleinfo: ''
  },
  {
    id: '7',
    titulo: 'BUINFRA_VEDACIT - PROPOSTA CÉLULAS DE CARGA - AUTOMAÇÃO P140 - ITATIBA',
    numeroProjeto: '01.04.25.068',
    inicioFase: '2025-11-12 14:51:54',
    diasNaFase: 13.11,
    entregaTeleinfo: '2025-11-27 14:00:41'
  },
  {
    id: '8',
    titulo: 'BUSEGURAÇA_QUALICORP_BOTÃO_LIBERAÇÃO_ADICIONAL',
    numeroProjeto: '05.04.25.105 - TECNOLOGIA',
    inicioFase: '2025-11-25 15:32:03',
    diasNaFase: 0.08,
    entregaTeleinfo: ''
  },
  {
    id: '9',
    titulo: 'BUSEGURANÇA_EINSTEIN GOIÂNIA_INSTALAÇÃO DE CÂMERAS_FARMÁCIA - MEDICAMENTO DE ALTO CUSTO',
    numeroProjeto: '01.04.25.073 - ENGENHARIA',
    inicioFase: '2025-11-25 10:20:49',
    diasNaFase: 0.29,
    entregaTeleinfo: ''
  },
  {
    id: '10',
    titulo: 'BUSEGURANÇA_HSL - 01 PORTA CONTROLE DE ACESSO',
    numeroProjeto: '01.04.25.074 - ENGENHARIA/TECNOLOGIA',
    inicioFase: '2025-11-25 15:23:37',
    diasNaFase: 0.08,
    entregaTeleinfo: ''
  },
  {
    id: '11',
    titulo: 'BUSEGURANÇA_HSL - 11C - 02 PORTAS CONTROLE DE ACESSO',
    numeroProjeto: '01.04.25.075 - ENG E TECNOLOGIA',
    inicioFase: '2025-11-19 12:46:41',
    diasNaFase: 5.20,
    entregaTeleinfo: ''
  },
  {
    id: '12',
    titulo: 'BUSEGURANÇA_HSL - FORNECIMENTO DE CÂMERA - M3057',
    numeroProjeto: '05.04.25.087 Tecnologia',
    inicioFase: '2025-09-22 10:31:56',
    diasNaFase: 64.29,
    entregaTeleinfo: ''
  },
  {
    id: '13',
    titulo: 'BUSEGURANÇA_HSL BSB - FORNECIMENTO DE DECODER',
    numeroProjeto: '05.04.25.093 - TECNOLOGIA',
    inicioFase: '2025-09-29 14:08:49',
    diasNaFase: 43.15,
    entregaTeleinfo: '2026-01-03 09:00:10'
  },
  {
    id: '14',
    titulo: 'BUTI_HCOR_HEMODINÂMICA_ARUBA',
    numeroProjeto: '05.04.25.073',
    inicioFase: '2025-08-04 10:23:10',
    diasNaFase: 113.29,
    entregaTeleinfo: ''
  },
  {
    id: '15',
    titulo: 'BUTI_UNIMED_Gbics IDC 509675',
    numeroProjeto: '05.04.25.098 - TECNOLOGIA',
    inicioFase: '2025-11-11 14:24:00',
    diasNaFase: 14.13,
    entregaTeleinfo: ''
  },
  {
    id: '16',
    titulo: 'BUTI_UNIMED_Gbics IDC 518854',
    numeroProjeto: '05.04.25.106 - TECNOLOGIA',
    inicioFase: '2025-11-19 12:18:17',
    diasNaFase: 6.21,
    entregaTeleinfo: ''
  }
];

export const SLA_DAYS_WARNING = 5;
export const SLA_DAYS_CRITICAL = 7;

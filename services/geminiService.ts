import { GoogleGenAI } from "@google/genai";
import { EmailDraftRequest, SLAStatus } from '../types';
import { SLA_DAYS_WARNING, SLA_DAYS_CRITICAL } from '../constants';

const getStatus = (days: number): SLAStatus => {
  if (days > SLA_DAYS_CRITICAL) return SLAStatus.CRITICAL;
  if (days > SLA_DAYS_WARNING) return SLAStatus.WARNING;
  return SLAStatus.OK;
};

export const generateEmailDraft = async (request: EmailDraftRequest): Promise<string> => {
  if (!process.env.API_KEY) {
    return "Erro: Chave de API não configurada. Por favor, configure a variável de ambiente API_KEY.";
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const status = getStatus(request.daysInPhase);
  
  const tone = status === SLAStatus.CRITICAL ? "urgente e firme, mas profissional" : "informativo e solicitando atualização";
  
  const prompt = `
    Você é um assistente administrativo eficiente.
    Escreva um rascunho de e-mail profissional para o responsável pelo projeto "${request.projectName}".
    
    Contexto:
    - O projeto está na fase "Estoque e Compras".
    - Tempo atual na fase: ${request.daysInPhase} dias.
    - O SLA ideal é de 5 dias.
    - Status atual: ${status === SLAStatus.CRITICAL ? "CRÍTICO (Atraso Grave)" : status === SLAStatus.WARNING ? "ATENÇÃO (Atraso Leve)" : "Dentro do prazo"}.
    
    O tom deve ser ${tone}.
    O objetivo é solicitar uma previsão de conclusão ou justificativa para a demora, se houver atraso.
    Se estiver no prazo, apenas confirme o recebimento e pergunte se há impedimentos.
    
    Retorne apenas o corpo do e-mail, sem "Assunto:" ou preâmbulos.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "Não foi possível gerar o rascunho.";
  } catch (error) {
    console.error("Error generating email:", error);
    return "Houve um erro ao se comunicar com a IA para gerar o e-mail.";
  }
};

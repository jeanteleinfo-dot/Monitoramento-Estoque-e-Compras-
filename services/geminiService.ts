import { GoogleGenAI } from "@google/genai";
import { EmailDraftRequest, SLAStatus } from '../types';
import { SLA_DAYS_WARNING, SLA_DAYS_CRITICAL } from '../constants';

const getStatus = (days: number): SLAStatus => {
  if (days > SLA_DAYS_CRITICAL) return SLAStatus.CRITICAL;
  if (days > SLA_DAYS_WARNING) return SLAStatus.WARNING;
  return SLAStatus.OK;
};

// Template padrão caso a IA falhe ou não tenha chave configurada
const getFallbackTemplate = (request: EmailDraftRequest, status: SLAStatus) => {
  const urgencyText = status === SLAStatus.CRITICAL 
    ? "Ressaltamos que o prazo excedeu o limite crítico, o que impacta nosso cronograma." 
    : status === SLAStatus.WARNING 
    ? "Observamos que o prazo ideal foi ultrapassado." 
    : "Gostaríamos apenas de confirmar se o processo segue conforme o planejado.";

  return `Prezados Departamento de Estoque & Compras,

Gostaria de solicitar uma atualização referente ao status do projeto: "${request.projectName}".

Identificamos que o mesmo encontra-se na fase de Estoque e Compras há ${request.daysInPhase.toFixed(1)} dias.

${urgencyText}

Poderiam por favor informar a previsão de conclusão ou se existe alguma pendência técnica/administrativa impedindo o avanço?

Desde já agradeço a atenção.

Atenciosamente,
Gestão de Projetos`;
};

export const generateEmailDraft = async (request: EmailDraftRequest): Promise<string> => {
  const status = getStatus(request.daysInPhase);

  // Se não tiver chave, retorna o template imediatamente (sem erro)
  if (!process.env.API_KEY) {
    console.warn("API Key não encontrada. Usando template padrão.");
    return getFallbackTemplate(request, status);
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const tone = status === SLAStatus.CRITICAL ? "urgente, firme e objetivo" : "formal e solicitando previsão";
  
  const prompt = `
    Aja como um gerente de projetos.
    Escreva um corpo de e-mail formal endereçado ao "Departamento de Estoque & Compras".
    
    Assunto do Projeto: "${request.projectName}"
    Tempo na fase atual: ${request.daysInPhase.toFixed(1)} dias.
    SLA Ideal: 5 dias.
    Situação: ${status === SLAStatus.CRITICAL ? "CRÍTICO (Atraso Grave)" : status === SLAStatus.WARNING ? "ATENÇÃO (Atraso Leve)" : "No Prazo"}.
    
    O tom deve ser ${tone}.
    Solicite uma previsão de entrega dos materiais/insumos ou justificativa para o tempo decorrido.
    
    Importante: Não use "Assunto:" no texto. Comece com "Prezados," ou similar.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || getFallbackTemplate(request, status);
  } catch (error) {
    console.error("Erro ao gerar email com IA, usando template padrão:", error);
    // Em caso de erro na API (ex: quota, network), usa o template
    return getFallbackTemplate(request, status);
  }
};
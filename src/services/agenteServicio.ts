import { GoogleGenerativeAI } from '@google/generative-ai';
import type { Politica } from '../types';
import { buscar_politica_por_texto } from './consultasServicio';

// Inicializa el SDK de Gemini. Asegúrate de tener VITE_GEMINI_API_KEY en el archivo .env
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
let genAI: GoogleGenerativeAI | null = null;
if (apiKey) {
  genAI = new GoogleGenerativeAI(apiKey);
}

export const consultarAgenteIA = async (
  pregunta: string,
  politicas: Politica[]
): Promise<string> => {
  if (!genAI) {
    console.warn("VITE_GEMINI_API_KEY no detectada. Usando agente simulado localmente.");
    return simularAgenteIA(pregunta, politicas);
  }

  // Preparamos el contexto con las políticas disponibles para inyectarlas en el prompt del sistema
  const contextoPoliticas = politicas.map(p => 
    `--- Título: ${p.titulo} ---\nCategoría: ${p.categoria}\nContenido: ${p.contenido}`
  ).join('\n\n');

  // Construcción del System Prompt con las reglas estrictas
  const systemInstruction = `Eres el "Agente de Consultas 24/7" de Garnier. Tu único propósito es resolver dudas de los colaboradores sobre recursos humanos, incluyendo vacaciones, teletrabajo, normativas internas y políticas oficiales vigentes de Garnier.

Sigue estrictamente estas reglas de comportamiento:

1. TONO Y ESTILO:
   - Responde siempre en español, de manera educada, transparente, empática y profesional.
   - Sé conciso y ve al grano para mejorar la satisfacción del usuario.

2. TRANSPARENCIA Y LIMITACIONES:
   - Responde basándote ÚNICAMENTE en la documentación oficial de políticas proporcionada en el contexto.
   - Si la información no está en los documentos o la pregunta requiere una excepción humana, di textualmente: "No encuentro esa información detallada en las políticas actuales. Te recomiendo validar directamente con el equipo de Recursos Humanos para darte una respuesta exacta."

3. MANEJO DE PREGUNTAS FUERA DE CONTEXTO (Out of Scope):
   - Si el usuario hace preguntas que no tienen absolutamente nada que ver con la empresa, el trabajo o recursos humanos (por ejemplo: preguntas sobre cultura popular, anime, ciencia general, tareas escolares, etc.), debes responder de forma amable pero firme, declinando la respuesta y redirigiendo al foco.
   - Ejemplo de respuesta para fuera de contexto: "Como tu Agente de Consultas de Recursos Humanos de Garnier, solo puedo ayudarte con dudas relacionadas con normativas internas, vacaciones, teletrabajo o políticas de la empresa. ¿Hay alguna consulta de este tipo en la que te pueda colaborar hoy?"

4. SEGURIDAD:
   - Nunca inventes datos, nombres de políticas, ni enlaces que no estén explícitamente en tu base de conocimientos proporcionada.

BASE DE CONOCIMIENTOS (Políticas oficiales vigentes):
${contextoPoliticas}
`;

  try {
    // Usamos la conexión directa a la API (Google APIs soporta CORS nativamente)
    const model = genAI.getGenerativeModel(
      { 
        model: 'gemini-1.5-flash',
        systemInstruction: systemInstruction 
      }
    );

    const result = await model.generateContent(pregunta);
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error("Error al consultar a Gemini:", error);
    console.warn("Fallando al agente simulado localmente debido a un error con la API de Gemini.");
    return simularAgenteIA(pregunta, politicas);
  }
};

/**
 * Función de respaldo (fallback) que simula localmente las reglas del agente IA 
 * en caso de que el usuario no haya configurado la clave de Gemini.
 */
const simularAgenteIA = async (pregunta: string, politicas: Politica[]): Promise<string> => {
  // Simular tiempo de procesamiento
  await new Promise(res => setTimeout(res, 1200));

  const texto_limpio = pregunta.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  // 1. Regla: MANEJO DE PREGUNTAS FUERA DE CONTEXTO
  const fuera_de_contexto = ['anime', 'pelicula', 'ciencia', 'clima', 'receta', 'deporte'];
  if (fuera_de_contexto.some(kw => texto_limpio.includes(kw))) {
    return "Como tu Agente de Consultas de Recursos Humanos de Garnier, solo puedo ayudarte con dudas relacionadas con normativas internas, vacaciones, teletrabajo o políticas de la empresa. ¿Hay alguna consulta de este tipo en la que te pueda colaborar hoy?";
  }

  // 2. Buscamos en el contexto local
  const politica_encontrada = politicas.find((pol) =>
    pol.palabras_clave.some((kw) => texto_limpio.includes(kw))
  );

  // 3. Regla: TRANSPARENCIA Y LIMITACIONES (si no lo encuentra)
  if (!politica_encontrada) {
    return "No encuentro esa información detallada en las políticas actuales. Te recomiendo validar directamente con el equipo de Recursos Humanos para darte una respuesta exacta.";
  }

  // 4. Regla: TONO Y ESTILO / TRANSPARENCIA (respuesta encontrada)
  return `¡Hola! Basado en la política vigente "${politica_encontrada.titulo}", te comparto la siguiente información:\n\n${politica_encontrada.contenido}\n\nEspero que esta información te sea de utilidad. ¿Te puedo ayudar con algo más?`;
};

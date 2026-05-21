import { GoogleGenerativeAI } from '@google/generative-ai';
import type { Politica, RespuestaAgente } from '../types';

// Inicializa el SDK de Gemini. Asegúrate de tener VITE_GEMINI_API_KEY en el archivo .env
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
let genAI: GoogleGenerativeAI | null = null;
if (apiKey) {
  genAI = new GoogleGenerativeAI(apiKey);
}

/**
 * RESPUESTA POR DEFECTO DE ERROR
 * Se usa cuando la IA no devuelve un JSON válido o falla la conexión.
 */
const RESPUESTA_ERROR_DEFAULT: RespuestaAgente = {
  estado_proceso: 'error',
  mensaje_usuario: 'Lo siento, ocurrió un error inesperado al intentar procesar tu consulta con la inteligencia artificial. Por favor, intenta de nuevo más tarde o contacta directamente a Talento Humano.',
  datos_rrhh: {
    accion_requerida: 'escalar_a_soporte_th',
    prioridad: 'media',
    analisis_detalle: 'Error técnico en la conexión con el agente IA. Se requiere revisión del equipo de soporte.',
  },
};

/**
 * Construye el System Prompt con las reglas estrictas de comportamiento y el formato JSON.
 */
function construirSystemPrompt(politicas: Politica[]): string {
  const contextoPoliticas = politicas.map(p =>
    `--- Título: ${p.titulo} ---\nCategoría: ${p.categoria}\nContenido: ${p.contenido}\nDocumento Referencia: ${p.documento_referencia}`
  ).join('\n\n');

  return `[ROL Y CONTEXTO]
Eres la API central de Inteligencia Artificial para el Sistema Automatizado de Recursos Humanos de Garnier & Garnier. Tu objetivo es procesar solicitudes de empleados, evaluar perfiles y generar reportes con absoluta precisión técnica, empatía profesional y total consistencia en el formato de datos.

[REGLAS ESTRICTAS DE COMPORTAMIENTO]
1. Datos Estructurados: Tu respuesta debe ser EXCLUSIVAMENTE en formato JSON válido. No incluyas texto introductorio ("Aquí está el resultado:"), ni notas al pie, ni bloques de código de Markdown adicionales. Si tu respuesta no es un JSON limpio, el sistema fallará.
2. Manejo de Funciones: Cuando proceses flujos de trabajo, mapea las salidas directamente a las acciones del backend.
3. Idioma: Todo el análisis e interacción con el usuario final debe ser en español.
4. Seguridad: Nunca reveles datos sensibles de empleados (IDs de gobierno, contraseñas) a menos que la consulta provenga del administrador del sistema verificado.
5. Transparencia: Responde basándote ÚNICAMENTE en la base de conocimientos proporcionada. Si la información no está disponible, indica que el empleado debe consultar directamente con el equipo de Talento Humano.
6. Fuera de Contexto: Si el usuario hace preguntas que no tienen nada que ver con la empresa o recursos humanos, declina amablemente y redirige al foco de RRHH.

[FORMATO DE SALIDA REQUERIDO]
Devuelve siempre un objeto JSON con la siguiente estructura exacta:
{
  "estado_proceso": "exitoso" | "error",
  "mensaje_usuario": "Mensaje claro y profesional para el empleado.",
  "datos_rrhh": {
    "accion_requerida": "Nombre de la función interna en el backend",
    "prioridad": "alta" | "media" | "baja",
    "analisis_detalle": "Breve resumen del caso para el departamento de Recursos Humanos."
  }
}

[MAPEO DE ACCIONES DEL BACKEND]
Usa estas funciones internas según el tipo de consulta:
- "consultar_politica_vacaciones" → Consultas sobre vacaciones, días libres, cumpleaños
- "consultar_politica_teletrabajo" → Consultas sobre trabajo remoto, Garnier Flex, horarios
- "consultar_politica_salud" → Consultas sobre incapacidades, citas médicas, CCSS
- "registrar_solicitud_vacaciones" → Cuando el empleado solicita vacaciones explícitamente
- "registrar_solicitud_teletrabajo" → Cuando el empleado solicita trabajo remoto
- "escalar_a_soporte_th" → Consultas que requieren intervención humana directa
- "consulta_general_rrhh" → Consultas generales sobre la empresa o normativas
- "declinar_fuera_de_contexto" → Preguntas que no tienen relación con RRHH

BASE DE CONOCIMIENTOS (Políticas oficiales vigentes de Garnier & Garnier):
${contextoPoliticas}`;
}

/**
 * Intenta parsear la respuesta del modelo como JSON válido.
 * Maneja casos donde el modelo devuelve JSON envuelto en backticks de Markdown.
 */
function parsearRespuestaJSON(textoRespuesta: string): RespuestaAgente {
  let textoLimpio = textoRespuesta.trim();

  // Quitar posibles bloques de código Markdown (```json ... ```)
  const bloqueJSON = textoLimpio.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (bloqueJSON) {
    textoLimpio = bloqueJSON[1].trim();
  }

  try {
    const respuestaParsed = JSON.parse(textoLimpio) as RespuestaAgente;

    // Validar que tenga la estructura mínima esperada
    if (!respuestaParsed.estado_proceso || !respuestaParsed.mensaje_usuario || !respuestaParsed.datos_rrhh) {
      console.warn('Respuesta JSON incompleta del modelo:', respuestaParsed);
      return {
        ...RESPUESTA_ERROR_DEFAULT,
        estado_proceso: 'exitoso',
        mensaje_usuario: respuestaParsed.mensaje_usuario || textoRespuesta,
        datos_rrhh: {
          accion_requerida: respuestaParsed.datos_rrhh?.accion_requerida || 'consulta_general_rrhh',
          prioridad: respuestaParsed.datos_rrhh?.prioridad || 'media',
          analisis_detalle: respuestaParsed.datos_rrhh?.analisis_detalle || 'Respuesta parcial del modelo.',
        },
      };
    }

    return respuestaParsed;
  } catch {
    console.error('Error al parsear JSON de la respuesta del modelo. Respuesta cruda:', textoLimpio);
    return {
      ...RESPUESTA_ERROR_DEFAULT,
      mensaje_usuario: textoRespuesta,
    };
  }
}

/**
 * Punto de entrada principal del agente IA.
 * Consulta a Gemini con el system prompt estructurado o usa el fallback local.
 */
export const consultarAgenteIA = async (
  pregunta: string,
  politicas: Politica[]
): Promise<RespuestaAgente> => {
  if (!genAI) {
    console.warn("VITE_GEMINI_API_KEY no detectada. Usando agente simulado localmente.");
    return simularAgenteIA(pregunta, politicas);
  }

  const systemInstruction = construirSystemPrompt(politicas);

  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
      systemInstruction: systemInstruction,
    });

    const result = await model.generateContent(pregunta);
    const response = result.response;
    const textoRespuesta = response.text();

    return parsearRespuestaJSON(textoRespuesta);
  } catch (error) {
    console.error("Error al consultar a Gemini:", error);
    console.warn("Cayendo al agente simulado localmente debido a un error con la API de Gemini.");
    return simularAgenteIA(pregunta, politicas);
  }
};

/**
 * Función de respaldo (fallback) que simula localmente las reglas del agente IA
 * en caso de que el usuario no haya configurado la clave de Gemini.
 * Ahora retorna la estructura JSON estandarizada.
 */
const simularAgenteIA = async (pregunta: string, politicas: Politica[]): Promise<RespuestaAgente> => {
  // Simular tiempo de procesamiento
  await new Promise(res => setTimeout(res, 1200));

  const texto_limpio = pregunta.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  // 1. Regla: MANEJO DE PREGUNTAS FUERA DE CONTEXTO
  const fuera_de_contexto = ['anime', 'pelicula', 'ciencia', 'receta', 'deporte', 'futbol', 'goku', 'dragon ball'];
  if (fuera_de_contexto.some(kw => texto_limpio.includes(kw))) {
    return {
      estado_proceso: 'exitoso',
      mensaje_usuario: 'Como tu Agente de Consultas de Recursos Humanos de Garnier, solo puedo ayudarte con dudas relacionadas con normativas internas, vacaciones, teletrabajo o políticas de la empresa. ¿Hay alguna consulta de este tipo en la que te pueda colaborar hoy?',
      datos_rrhh: {
        accion_requerida: 'declinar_fuera_de_contexto',
        prioridad: 'baja',
        analisis_detalle: 'La consulta del empleado no corresponde al dominio de Recursos Humanos. Se declinó la respuesta y se redirigió al foco corporativo.',
      },
    };
  }

  // 2. Detectar solicitudes explícitas (verbos de acción)
  const es_solicitud_vacaciones = /\b(solicito|pido|quiero|necesito)\b.*\b(vacacion|dias libre|descanso)/i.test(texto_limpio);
  const es_solicitud_teletrabajo = /\b(solicito|pido|quiero|necesito)\b.*\b(teletrabajo|remoto|casa)/i.test(texto_limpio);

  if (es_solicitud_vacaciones) {
    const politica = politicas.find(p => p.categoria === 'vacaciones');
    return {
      estado_proceso: 'exitoso',
      mensaje_usuario: `Su solicitud de vacaciones ha sido recibida y enviada a su supervisor para aprobación final. ${politica ? `Según la política "${politica.titulo}": ${politica.contenido}` : ''}`,
      datos_rrhh: {
        accion_requerida: 'registrar_solicitud_vacaciones',
        prioridad: 'media',
        analisis_detalle: 'El empleado solicita vacaciones. Verificar saldo de días disponibles en el sistema y notificar al supervisor directo.',
      },
    };
  }

  if (es_solicitud_teletrabajo) {
    const politica = politicas.find(p => p.categoria === 'teletrabajo');
    return {
      estado_proceso: 'exitoso',
      mensaje_usuario: `Su solicitud de teletrabajo ha sido registrada para coordinación con su jefatura. ${politica ? `Según la política "${politica.titulo}": ${politica.contenido}` : ''}`,
      datos_rrhh: {
        accion_requerida: 'registrar_solicitud_teletrabajo',
        prioridad: 'media',
        analisis_detalle: 'El empleado solicita trabajo remoto. Verificar elegibilidad del puesto según Garnier Flex.',
      },
    };
  }

  // 3. Buscamos en el contexto local (consultas informativas)
  const politica_encontrada = politicas.find((pol) =>
    pol.palabras_clave.some((kw) => texto_limpio.includes(kw))
  );

  // 4. Regla: TRANSPARENCIA Y LIMITACIONES (si no lo encuentra)
  if (!politica_encontrada) {
    return {
      estado_proceso: 'exitoso',
      mensaje_usuario: 'No encuentro esa información detallada en las políticas actuales. Te recomiendo validar directamente con el equipo de Recursos Humanos para darte una respuesta exacta.',
      datos_rrhh: {
        accion_requerida: 'escalar_a_soporte_th',
        prioridad: 'media',
        analisis_detalle: 'La consulta no coincide con ninguna política indexada en la base de conocimientos. Se recomienda revisión manual por Talento Humano.',
      },
    };
  }

  // 5. Determinar acción según categoría
  const mapeoAcciones: Record<string, string> = {
    vacaciones: 'consultar_politica_vacaciones',
    teletrabajo: 'consultar_politica_teletrabajo',
    salud: 'consultar_politica_salud',
    general: 'consulta_general_rrhh',
  };

  return {
    estado_proceso: 'exitoso',
    mensaje_usuario: `¡Hola! Basado en la política vigente "${politica_encontrada.titulo}", te comparto la siguiente información:\n\n${politica_encontrada.contenido}\n\nEspero que esta información te sea de utilidad. ¿Te puedo ayudar con algo más?`,
    datos_rrhh: {
      accion_requerida: mapeoAcciones[politica_encontrada.categoria] || 'consulta_general_rrhh',
      prioridad: 'baja',
      analisis_detalle: `Consulta informativa resuelta exitosamente. Política aplicada: "${politica_encontrada.titulo}" (${politica_encontrada.documento_referencia}).`,
    },
  };
};

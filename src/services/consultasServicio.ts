/* ==========================================================================
   SERVICIO DE CONSULTAS GENERALES
   Conecta: páginas/ConsultasGenerales.tsx → /api/politicas, /api/preguntas_frecuentes, /api/historial_consultas
   ========================================================================== */

import { obtener_datos, enviar_datos } from './apiCliente';
import type { Politica, PreguntaFrecuente, HistorialConsulta } from '../types';

/* obtener_politicas: Trae todas las políticas del catálogo */
export const obtener_politicas = (): Promise<Politica[]> =>
  obtener_datos<Politica[]>('politicas');

/* obtener_preguntas_frecuentes: Trae las sugerencias de búsqueda predefinidas */
export const obtener_preguntas_frecuentes = (): Promise<PreguntaFrecuente[]> =>
  obtener_datos<PreguntaFrecuente[]>('preguntas_frecuentes');

/* obtener_historial_consultas: Trae el historial de consultas previas */
export const obtener_historial_consultas = (): Promise<HistorialConsulta[]> =>
  obtener_datos<HistorialConsulta[]>('historial_consultas');

/* guardar_consulta_historial: Persiste una nueva consulta en el historial */
export const guardar_consulta_historial = (
  consulta: Omit<HistorialConsulta, 'id'>
): Promise<HistorialConsulta> =>
  enviar_datos<HistorialConsulta>('historial_consultas', consulta);

/* buscar_politica_por_texto: Lógica semántica local que cruza texto contra palabras_clave */
export const buscar_politica_por_texto = (
  texto: string,
  politicas: Politica[]
): Politica => {
  const texto_limpio = texto.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const politica_encontrada = politicas.find((pol) =>
    pol.palabras_clave.some((kw) => texto_limpio.includes(kw))
  );
  return politica_encontrada ?? (politicas.find((p) => p.categoria === 'general') as Politica);
};

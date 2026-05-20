/* ==========================================================================
   SERVICIO DE SENTIMIENTO DIARIO
   Conecta: páginas/SentimientoDiario.tsx → /api/ejemplos_sentimiento, /api/reglas_sentimiento, /api/checkins_emocionales
   ========================================================================== */

import { obtener_datos, enviar_datos } from './apiCliente';
import type { EjemploSentimiento, ReglaSentimiento, CheckinEmocional } from '../types';

/* obtener_ejemplos_sentimiento: Trae los casos de prueba predefinidos del servidor */
export const obtener_ejemplos_sentimiento = (): Promise<EjemploSentimiento[]> =>
  obtener_datos<EjemploSentimiento[]>('ejemplos_sentimiento');

/* obtener_reglas_sentimiento: Trae el catálogo de reglas de análisis semántico */
export const obtener_reglas_sentimiento = (): Promise<ReglaSentimiento[]> =>
  obtener_datos<ReglaSentimiento[]>('reglas_sentimiento');

/* analizar_texto_emocional: Aplica las reglas del servidor al texto del usuario */
export const analizar_texto_emocional = (
  texto: string,
  reglas: ReglaSentimiento[]
): ReglaSentimiento => {
  const texto_normalizado = texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  /* Buscar la primera regla cuya lista de palabras_clave haga match */
  const regla_detectada = reglas
    .filter((r) => r.id !== 0) // excluir la regla por defecto
    .find((regla) =>
      regla.palabras_clave.some((kw) => texto_normalizado.includes(kw))
    );

  /* Retornar la regla encontrada o la regla por defecto (id: 0) */
  return regla_detectada ?? (reglas.find((r) => r.id === 0) as ReglaSentimiento);
};

/* guardar_checkin_emocional: Persiste el resultado del análisis en json-server */
export const guardar_checkin_emocional = (
  checkin: Omit<CheckinEmocional, 'id'>
): Promise<CheckinEmocional> =>
  enviar_datos<CheckinEmocional>('checkins_emocionales', checkin);

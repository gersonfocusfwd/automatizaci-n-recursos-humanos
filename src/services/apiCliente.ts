/* ==========================================================================
   CLIENTE BASE DE API — conecta con json-server via proxy /api en vite.config.ts
   ========================================================================== */

const URL_BASE = '/api';

/* obtener_datos: GET genérico que retorna los datos tipados de cualquier recurso */
export async function obtener_datos<T>(recurso: string): Promise<T> {
  const respuesta = await fetch(`${URL_BASE}/${recurso}`);
  if (!respuesta.ok) {
    throw new Error(`Error al obtener ${recurso}: ${respuesta.status}`);
  }
  return respuesta.json() as Promise<T>;
}

/* enviar_datos: POST genérico que persiste un nuevo recurso en json-server */
export async function enviar_datos<T>(recurso: string, cuerpo: Omit<T, 'id'>): Promise<T> {
  const respuesta = await fetch(`${URL_BASE}/${recurso}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(cuerpo),
  });
  if (!respuesta.ok) {
    throw new Error(`Error al enviar a ${recurso}: ${respuesta.status}`);
  }
  return respuesta.json() as Promise<T>;
}

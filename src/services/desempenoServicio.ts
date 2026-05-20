/* ==========================================================================
   SERVICIO DE GESTIÓN DE DESEMPEÑO
   Conecta: páginas/GestionDesempeno.tsx → /api/colaboradores, /api/okrs, /api/guias_reunion
   ========================================================================== */

import { obtener_datos } from './apiCliente';
import type { Colaborador, OKR, GuiaReunion, TipoReunion } from '../types';

/* obtener_colaborador_por_id: Busca un colaborador específico usando json-server filter */
export const obtener_colaborador_por_id = async (
  id: string
): Promise<Colaborador | null> => {
  const lista = await obtener_datos<Colaborador[]>(`colaboradores?id=${id}`);
  return lista[0] ?? null;
};

/* obtener_okrs_por_colaborador: Filtra OKRs del colaborador en json-server */
export const obtener_okrs_por_colaborador = (
  colaborador_id: string
): Promise<OKR[]> =>
  obtener_datos<OKR[]>(`okrs?colaborador_id=${colaborador_id}`);

/* obtener_guia_reunion: Filtra la guía de reunión por colaborador y tipo */
export const obtener_guia_reunion = async (
  colaborador_id: string,
  tipo: TipoReunion
): Promise<GuiaReunion | null> => {
  const encoded_tipo = encodeURIComponent(tipo);
  const lista = await obtener_datos<GuiaReunion[]>(
    `guias_reunion?colaborador_id=${colaborador_id}&tipo=${encoded_tipo}`
  );
  return lista[0] ?? null;
};

/* obtener_color_progreso: Retorna la clase CSS del color según porcentaje del OKR */
export const obtener_color_progreso = (porcentaje: number): string => {
  if (porcentaje >= 80) return 'barra-color-verde';
  if (porcentaje >= 50) return 'barra-color-azul';
  return 'barra-color-amarillo';
};

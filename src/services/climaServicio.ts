/* ==========================================================================
   SERVICIO DE CLIMA ORGANIZACIONAL
   Conecta: páginas/ClimaOrganizacional.tsx → /api/reportes_clima (GET y POST)
   ========================================================================== */

import { obtener_datos, enviar_datos } from './apiCliente';
import type { ReporteClima } from '../types';

/* obtener_reportes_clima: Trae todos los reportes anónimos del buzón */
export const obtener_reportes_clima = (): Promise<ReporteClima[]> =>
  obtener_datos<ReporteClima[]>('reportes_clima');

/* enviar_reporte_clima: Persiste un nuevo reporte anónimo en json-server */
export const enviar_reporte_clima = (
  reporte: Omit<ReporteClima, 'id'>
): Promise<ReporteClima> =>
  enviar_datos<ReporteClima>('reportes_clima', reporte);

/* formatear_fecha_relativa: Convierte fecha ISO a texto legible */
export const formatear_fecha_relativa = (fecha_iso: string): string => {
  const hoy = new Date();
  const fecha = new Date(fecha_iso);
  const diferencia_ms = hoy.getTime() - fecha.getTime();
  const diferencia_dias = Math.floor(diferencia_ms / (1000 * 60 * 60 * 24));
  if (diferencia_dias === 0) return 'Hoy';
  if (diferencia_dias === 1) return 'Ayer';
  return `Hace ${diferencia_dias} días`;
};

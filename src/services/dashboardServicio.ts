/* ==========================================================================
   SERVICIO DEL DASHBOARD GENERAL
   Conecta: páginas/Dashboard.tsx → /api/kpis
   ========================================================================== */

import { obtener_datos } from './apiCliente';
import type { KPI } from '../types';

/* obtener_kpis: Trae todos los indicadores clave del servidor */
export const obtener_kpis = (): Promise<KPI[]> =>
  obtener_datos<KPI[]>('kpis');

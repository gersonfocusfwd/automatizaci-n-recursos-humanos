/* ==========================================================================
   COMPONENTE UI: TarjetaKPI
   Conecta: páginas/Dashboard.tsx — renderiza cada indicador clave de desempeño
   ========================================================================== */

import {
  MessageSquare, TrendingUp, Users, Smile,
  type LucideIcon
} from 'lucide-react';
import type { KPI } from '../../types';

/* Mapa de strings a componentes de icono para deserializar desde json-server */
const mapa_iconos: Record<string, LucideIcon> = {
  MessageSquare,
  TrendingUp,
  Users,
  Smile,
};

interface PropsTarjetaKPI {
  kpi: KPI;
}

export default function TarjetaKPI({ kpi }: PropsTarjetaKPI) {
  const IconoComponente = mapa_iconos[kpi.icono] ?? MessageSquare;
  return (
    <div className="tarjeta-kpi">
      <div className="kpi-tarjeta-encabezado">
        <span className="kpi-tarjeta-titulo">{kpi.titulo}</span>
        <div className={`kpi-tarjeta-icono-contenedor ${kpi.clase}`}>
          <IconoComponente size={18} />
        </div>
      </div>
      <h4 className="kpi-tarjeta-valor">{kpi.valor}</h4>
      <p className="kpi-tarjeta-detalle">{kpi.detalle}</p>
    </div>
  );
}

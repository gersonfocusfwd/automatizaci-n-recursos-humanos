/* ==========================================================================
   COMPONENTE LAYOUT: Header
   Conecta: App.tsx — encabezado superior con título de ruta activa y estado del sistema
   ========================================================================== */

import { useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';

interface PropsHeader {
  al_abrir_sidebar: () => void;
}

/* Mapa de rutas a títulos legibles para mostrar en el header */
const titulos_por_ruta: Record<string, string> = {
  '/': 'Panel de Control General',
  '/consultas': 'Módulo de Consultas 24/7',
  '/sentimiento': 'Módulo de Check-in Emocional',
  '/clima': 'Módulo de Clima y Escucha',
  '/desempeno': 'Módulo de Desempeño y OKRs',
};

export default function Header({ al_abrir_sidebar }: PropsHeader) {
  const ubicacion = useLocation();
  const titulo_activo = titulos_por_ruta[ubicacion.pathname] ?? 'Garnier Talento IA';

  return (
    <header className="header-superior">
      <div className="header-izq">
        <button
          type="button"
          className="boton-menu-movil-header"
          onClick={al_abrir_sidebar}
          aria-label="Abrir menú"
        >
          <Menu size={22} />
        </button>
        <div>
          <span className="header-ruta-indicador">Plataforma Corporativa</span>
          <h2 className="header-vista-titulo">{titulo_activo}</h2>
        </div>
      </div>
      <div className="header-der">
        <div className="indicador-estado-sistema">
          <span className="punto-verde-latente" />
          <span className="estado-texto-indicador">Copiloto IA en línea</span>
        </div>
      </div>
    </header>
  );
}

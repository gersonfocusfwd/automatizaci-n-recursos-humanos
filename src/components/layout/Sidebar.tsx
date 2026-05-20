/* ==========================================================================
   COMPONENTE LAYOUT: Sidebar
   Conecta: App.tsx — menú lateral de navegación con React Router Links
   ========================================================================== */

import { NavLink } from 'react-router-dom';
import {
  Building, LayoutDashboard, HelpCircle, Heart, Users, UserCheck
} from 'lucide-react';

interface PropsSidebar {
  esta_abierto: boolean;
  al_cerrar: () => void;
}

/* Lista de rutas de navegación del sistema */
const rutas_navegacion = [
  { ruta: '/', etiqueta: 'Dashboard General', Icono: LayoutDashboard, exacta: true },
];

const rutas_modulos = [
  { ruta: '/consultas', etiqueta: 'Consultas 24/7', Icono: HelpCircle },
  { ruta: '/sentimiento', etiqueta: 'Check-in Emocional', Icono: Heart },
  { ruta: '/clima', etiqueta: 'Buzón Pulse y Clima', Icono: Users },
  { ruta: '/desempeno', etiqueta: 'Feedback y OKRs', Icono: UserCheck },
];

export default function Sidebar({ esta_abierto, al_cerrar }: PropsSidebar) {
  return (
    <aside className={`sidebar-lateral ${esta_abierto ? 'abierto' : ''}`}>
      {/* Identidad de marca Garnier */}
      <div className="sidebar-marca-contenedor">
        <div className="marca-logo-emblema">
          <Building size={22} className="icono-marca" />
        </div>
        <div className="marca-textos">
          <h1 className="marca-nombre-titulo">GARNIER</h1>
          <span className="marca-subtitulo-etiqueta">Talento IA Copilot</span>
        </div>
      </div>

      <nav className="sidebar-navegacion">
        {/* Rutas principales */}
        {rutas_navegacion.map(({ ruta, etiqueta, Icono, exacta }) => (
          <NavLink
            key={ruta}
            to={ruta}
            end={exacta}
            className={({ isActive }) => `opcion-nav${isActive ? ' activo' : ''}`}
            onClick={al_cerrar}
          >
            <Icono size={18} className="icono-nav" />
            <span>{etiqueta}</span>
          </NavLink>
        ))}

        <span className="seccion-division-titulo">Soluciones Inteligentes</span>

        {/* Rutas de módulos */}
        {rutas_modulos.map(({ ruta, etiqueta, Icono }) => (
          <NavLink
            key={ruta}
            to={ruta}
            className={({ isActive }) => `opcion-nav${isActive ? ' activo' : ''}`}
            onClick={al_cerrar}
          >
            <Icono size={18} className="icono-nav" />
            <span>{etiqueta}</span>
          </NavLink>
        ))}
      </nav>

      {/* Pie de usuario */}
      <div className="sidebar-pie-usuario">
        <div className="usuario-avatar-circulo">HR</div>
        <div className="usuario-info-texto">
          <span className="usuario-nombre">Líder Garnier</span>
          <span className="usuario-rol">Administrador RRHH</span>
        </div>
      </div>
    </aside>
  );
}

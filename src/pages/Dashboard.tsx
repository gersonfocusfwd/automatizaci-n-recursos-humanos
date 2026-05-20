/* ==========================================================================
   PÁGINA: Dashboard
   Conecta: AppRouter.tsx (ruta "/") → dashboardServicio.ts → /api/kpis
   ========================================================================== */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HelpCircle, Heart, Users, UserCheck, ShieldCheck, ChevronRight } from 'lucide-react';
import TarjetaKPI from '../components/ui/TarjetaKPI';
import CargandoAnimado from '../components/ui/CargandoAnimado';
import { obtener_kpis } from '../services/dashboardServicio';
import type { KPI } from '../types';

/* Definición estática de las tarjetas de acceso a módulos */
const accesos_directos = [
  {
    ruta: '/consultas',
    Icono: HelpCircle,
    clase: 'consultas',
    titulo: 'Consultas de Políticas 24/7',
    descripcion: 'Atención inmediata a consultas de vacaciones, teletrabajo e incapacidades.',
    etiqueta_boton: 'Ingresar al Agente',
  },
  {
    ruta: '/sentimiento',
    Icono: Heart,
    clase: 'sentimiento',
    titulo: 'Check-in de Bienestar',
    descripcion: 'Analizador confidencial para evaluar y prevenir niveles de estrés y ansiedad.',
    etiqueta_boton: 'Monitorear Bienestar',
  },
  {
    ruta: '/clima',
    Icono: Users,
    clase: 'clima',
    titulo: 'Pulse y Buzón Anónimo',
    descripcion: 'Monitoreo semanal del clima laboral y buzón cifrado para sugerencias.',
    etiqueta_boton: 'Abrir Buzón Anónimo',
  },
  {
    ruta: '/desempeno',
    Icono: UserCheck,
    clase: 'desempeno',
    titulo: 'Copiloto de Feedback 1:1',
    descripcion: 'Agenda pautas de feedback eficientes y analiza el cumplimiento de OKRs.',
    etiqueta_boton: 'Preparar Feedback',
  },
];

export default function Dashboard() {
  /* --- ESTADOS EN ESPAÑOL --- */
  const [lista_kpis, establecer_lista_kpis] = useState<KPI[]>([]);
  const [cargando_kpis, establecer_cargando_kpis] = useState(true);
  const navegar = useNavigate();

  /* Carga los KPIs desde json-server al montar el componente */
  useEffect(() => {
    obtener_kpis()
      .then(establecer_lista_kpis)
      .finally(() => establecer_cargando_kpis(false));
  }, []);

  /* manejar_click_navegar: Dirige al usuario a un módulo específico */
  const manejar_click_navegar = (ruta: string) => {
    navegar(ruta);
  };

  return (
    <div className="vista-dashboard-inicio">
      {/* Tarjeta de bienvenida con gradiente corporativo */}
      <div className="tarjeta-bienvenida-garnier">
        <div className="bienvenida-contenido">
          <h3 className="bienvenida-titulo">¡Bienvenido a Garnier Talento IA!</h3>
          <p className="bienvenida-descripcion">
            Esta consola centraliza nuestras soluciones de Recursos Humanos basadas en IA.
            Optimiza la comunicación, evalúa el clima organizacional y prepara reuniones de
            feedback de alto nivel estratégico.
          </p>
          <div className="bienvenida-botones-grupo">
            <button
              type="button"
              className="boton-accion-principal-blanco"
              onClick={() => manejar_click_navegar('/consultas')}
            >
              Probar Consultas 24/7
            </button>
            <button
              type="button"
              className="boton-accion-enlace-blanco"
              onClick={() => manejar_click_navegar('/desempeno')}
            >
              Ir a OKRs y Feedback
            </button>
          </div>
        </div>
        <div className="bienvenida-decorativo">
          <ShieldCheck size={110} className="icono-decorativo-seguridad" />
        </div>
      </div>

      {/* Grid de KPIs — datos desde json-server */}
      {cargando_kpis ? (
        <CargandoAnimado mensaje="Cargando métricas organizacionales..." />
      ) : (
        <div className="kpis-grid-contenedor">
          {lista_kpis.map((kpi) => (
            <TarjetaKPI key={kpi.id} kpi={kpi} />
          ))}
        </div>
      )}

      {/* Accesos directos a módulos */}
      <h3 className="subtitulo-seccion-general">Servicios Integrados del Sistema</h3>
      <div className="accesos-directos-grid">
        {accesos_directos.map(({ ruta, Icono, clase, titulo, descripcion, etiqueta_boton }) => (
          <div key={ruta} className="tarjeta-acceso-directo">
            <div className={`acceso-directo-icono ${clase}`}>
              <Icono size={22} />
            </div>
            <h4 className="acceso-directo-titulo">{titulo}</h4>
            <p className="acceso-directo-descripcion">{descripcion}</p>
            <button
              type="button"
              className="boton-ir-modulo"
              onClick={() => manejar_click_navegar(ruta)}
            >
              <span>{etiqueta_boton}</span>
              <ChevronRight size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

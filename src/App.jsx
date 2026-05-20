import React, { useState } from 'react';
import { 
  Building, 
  LayoutDashboard, 
  MessageSquare, 
  Heart, 
  HelpCircle, 
  UserCheck, 
  CheckCircle,
  Users,
  TrendingUp,
  Smile,
  ShieldCheck,
  Menu,
  X,
  ChevronRight
} from 'lucide-react';
import ConsultasGenerales from './ConsultasGenerales';
import SentimientoDiario from './SentimientoDiario';
import ClimaOrganizacional from './ClimaOrganizacional';
import GestionDesempeno from './GestionDesempeno';

/* 
  ARQUITECTURA DE COMPONENTE PRINCIPAL: App.jsx
  ============================================
  Este es el punto de entrada y panel de control principal de la plataforma
  "Garnier Talento IA", diseñada para Garnier & Garnier. Su objetivo es
  agrupar, coordinar y renderizar los cuatro módulos principales del sistema.
  
  Puntos de Conexión:
  - Gestiona el enrutamiento interno mediante pestañas de navegación (Dashboard).
  - Mantiene las métricas generales de telemetría y el estado del sidebar responsivo.
  - Vincula y carga el archivo CSS global index.css que define la identidad de marca.
*/

export default function App() {
  // --- ESTADOS EN ESPAÑOL ---
  // modulo_activo: Controla qué sección o módulo está desplegado en la vista principal.
  // Valores posibles: 'inicio', 'consultas', 'sentimiento', 'clima', 'desempeno'
  const [modulo_activo, establecer_modulo_activo] = useState('inicio');
  
  // sidebar_abierto: Estado booleano para controlar el menú lateral en dispositivos móviles.
  const [sidebar_abierto, establecer_sidebar_abierto] = useState(false);

  // --- DATOS SIMULADOS DE MBIENTES Y TELEMETRÍA (KPIs) ---
  const kpis_organizacionales = [
    {
      id: 1,
      titulo: 'Consultas AI Activas',
      valor: '47 Resueltas',
      detalle: '98% precisión de respuesta',
      icono: MessageSquare,
      clase_kpi: 'kpi-consultas'
    },
    {
      id: 2,
      titulo: 'Índice de Clima Pulse',
      valor: '8.6 / 10',
      detalle: '+0.4 vs. mes anterior',
      icono: TrendingUp,
      clase_kpi: 'kpi-clima'
    },
    {
      id: 3,
      titulo: 'Participación Anónima',
      valor: '92% Activa',
      detalle: '243 colaboradores esta semana',
      icono: Users,
      clase_kpi: 'kpi-participacion'
    },
    {
      id: 4,
      titulo: 'Salud Emocional Promedio',
      valor: '84% Estable',
      detalle: 'Garnier Balance en rango óptimo',
      icono: Smile,
      clase_kpi: 'kpi-salud'
    }
  ];

  // --- MANEJADORES DE NAVEGACIÓN (onClick) ---

  // manejar_cambio_modulo: Cambia el componente desplegado en el panel central.
  const manejar_cambio_modulo = (nombre_modulo) => {
    establecer_modulo_activo(nombre_modulo);
    establecer_sidebar_abierto(false); // Cerrar sidebar en móvil tras click
  };

  // manejar_click_alternar_sidebar: Abre y cierra el menú lateral responsivo.
  const manejar_click_alternar_sidebar = () => {
    establecer_sidebar_abierto((estado_actual) => !estado_actual);
  };

  return (
    <div className="app-layout-principal">
      {/* Botón de Menú Móvil */}
      <button 
        type="button" 
        className="boton-menu-movil" 
        onClick={manejar_click_alternar_sidebar}
      >
        {sidebar_abierto ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* 1. SIDEBAR (MENÚ LATERAL) */}
      <aside className={`sidebar-lateral ${sidebar_abierto ? 'abierto' : ''}`}>
        {/* Identidad de la Marca Garnier & Garnier */}
        <div className="sidebar-marca-contenedor">
          <div className="marca-logo-emblema">
            <Building size={22} className="icono-marca" />
          </div>
          <div className="marca-textos">
            <h1 className="marca-nombre-titulo">GARNIER</h1>
            <span className="marca-subtitulo-etiqueta">Talento IA Copilot</span>
          </div>
        </div>

        {/* Listado de Opciones de Navegación (Tabs) */}
        <nav className="sidebar-navegacion">
          <button
            type="button"
            className={`opcion-nav ${modulo_activo === 'inicio' ? 'activo' : ''}`}
            onClick={() => manejar_cambio_modulo('inicio')}
          >
            <LayoutDashboard size={18} className="icono-nav" />
            <span>Dashboard General</span>
          </button>

          <span className="seccion-division-titulo">Soluciones Inteligentes</span>

          <button
            type="button"
            className={`opcion-nav ${modulo_activo === 'consultas' ? 'activo' : ''}`}
            onClick={() => manejar_cambio_modulo('consultas')}
          >
            <HelpCircle size={18} className="icono-nav" />
            <span>Consultas 24/7</span>
          </button>

          <button
            type="button"
            className={`opcion-nav ${modulo_activo === 'sentimiento' ? 'activo' : ''}`}
            onClick={() => manejar_cambio_modulo('sentimiento')}
          >
            <Heart size={18} className="icono-nav" />
            <span>Check-in Emocional</span>
          </button>

          <button
            type="button"
            className={`opcion-nav ${modulo_activo === 'clima' ? 'activo' : ''}`}
            onClick={() => manejar_cambio_modulo('clima')}
          >
            <Users size={18} className="icono-nav" />
            <span>Buzón Pulse y Clima</span>
          </button>

          <button
            type="button"
            className={`opcion-nav ${modulo_activo === 'desempeno' ? 'activo' : ''}`}
            onClick={() => manejar_cambio_modulo('desempeno')}
          >
            <UserCheck size={18} className="icono-nav" />
            <span>Feedback y OKRs</span>
          </button>
        </nav>

        {/* Estatus del Copiloto e Info de Sesión */}
        <div className="sidebar-pie-usuario">
          <div className="usuario-avatar-circulo">HR</div>
          <div className="usuario-info-texto">
            <span className="usuario-nombre">Líder Garnier</span>
            <span className="usuario-rol">Administrador RRHH</span>
          </div>
        </div>
      </aside>

      {/* Overlay del Sidebar Móvil */}
      {sidebar_abierto && (
        <div 
          className="overlay-sidebar-movil" 
          onClick={manejar_click_alternar_sidebar}
        />
      )}

      {/* 2. ÁREA DE CONTENIDO PRINCIPAL */}
      <main className="area-principal-contenido">
        
        {/* Encabezado Superior (Header) */}
        <header className="header-superior">
          <div className="header-izq">
            <span className="header-ruta-indicador">Plataforma Corporativa</span>
            <h2 className="header-vista-titulo">
              {modulo_activo === 'inicio' && 'Panel de Control General'}
              {modulo_activo === 'consultas' && 'Módulo de Consultas 24/7'}
              {modulo_activo === 'sentimiento' && 'Módulo de Clima y Emociones'}
              {modulo_activo === 'clima' && 'Módulo de Clima y Escucha'}
              {modulo_activo === 'desempeno' && 'Módulo de Desempeño y OKRs'}
            </h2>
          </div>
          <div className="header-der">
            <div className="indicador-estado-sistema">
              <span className="punto-verde-latente"></span>
              <span className="estado-texto-indicador">Copiloto IA en línea</span>
            </div>
          </div>
        </header>

        {/* Renderizado Condicional de Vistas */}
        <div className="contenedor-vista-dinamica">
          
          {/* VISTA 0: DASHBOARD GENERAL (INICIO) */}
          {modulo_activo === 'inicio' && (
            <div className="vista-dashboard-inicio">
              
              {/* Bloque Bienvenida Garnier */}
              <div className="tarjeta-bienvenida-garnier">
                <div className="bienvenida-contenido">
                  <h3 className="bienvenida-titulo">¡Bienvenido a Garnier Talento IA!</h3>
                  <p className="bienvenida-descripcion">
                    Esta consola de administración centraliza nuestras soluciones automatizadas de Recursos Humanos. 
                    Optimiza la comunicación, evalúa el clima organizacional de forma segura, asiste emocionalmente a tus 
                    equipos y prepara reuniones de feedback de alto nivel arquitectónico.
                  </p>
                  <div className="bienvenida-botones-grupo">
                    <button
                      type="button"
                      className="boton-accion-principal-blanco"
                      onClick={() => manejar_cambio_modulo('consultas')}
                    >
                      Probar Consultas 24/7
                    </button>
                    <button
                      type="button"
                      className="boton-accion-enlace-blanco"
                      onClick={() => manejar_cambio_modulo('desempeno')}
                    >
                      Ir a OKRs y Feedback
                    </button>
                  </div>
                </div>
                <div className="bienvenida-decorativo">
                  <ShieldCheck size={110} className="icono-decorativo-seguridad" />
                </div>
              </div>

              {/* Grid de KPIs de Telemetría */}
              <div className="kpis-grid-contenedor">
                {kpis_organizacionales.map((kpi) => {
                  const IconoComponente = kpi.icono;
                  return (
                    <div key={kpi.id} className="tarjeta-kpi">
                      <div className="kpi-tarjeta-encabezado">
                        <span className="kpi-tarjeta-titulo">{kpi.titulo}</span>
                        <div className={`kpi-tarjeta-icono-contenedor ${kpi.clase_kpi}`}>
                          <IconoComponente size={18} />
                        </div>
                      </div>
                      <h4 className="kpi-tarjeta-valor">{kpi.valor}</h4>
                      <p className="kpi-tarjeta-detalle">{kpi.detalle}</p>
                    </div>
                  );
                })}
              </div>

              {/* Grid de Accesos Directos Modernos a los 4 Módulos */}
              <h3 className="subtitulo-seccion-general">Servicios Integrados del Sistema</h3>
              <div className="accesos-directos-grid">
                
                {/* Tarjeta Directa: Consultas 24/7 */}
                <div className="tarjeta-acceso-directo">
                  <div className="acceso-directo-icono consultas">
                    <HelpCircle size={22} />
                  </div>
                  <h4 className="acceso-directo-titulo">Consultas de Políticas 24/7</h4>
                  <p className="acceso-directo-descripcion">Atención inmediata a consultas de vacaciones, teletrabajo e incapacidades del colaborador.</p>
                  <button
                    type="button"
                    className="boton-ir-modulo"
                    onClick={() => manejar_cambio_modulo('consultas')}
                  >
                    <span>Ingresar al Agente</span>
                    <ChevronRight size={14} />
                  </button>
                </div>

                {/* Tarjeta Directa: Sentimiento Diario */}
                <div className="tarjeta-acceso-directo">
                  <div className="acceso-directo-icono sentimiento">
                    <Heart size={22} />
                  </div>
                  <h4 className="acceso-directo-titulo">Check-in de Bienestar</h4>
                  <p className="acceso-directo-descripcion">Analizador de textos confidencial para evaluar y prevenir niveles de estrés y ansiedad diaria.</p>
                  <button
                    type="button"
                    className="boton-ir-modulo"
                    onClick={() => manejar_cambio_modulo('sentimiento')}
                  >
                    <span>Monitorear Bienestar</span>
                    <ChevronRight size={14} />
                  </button>
                </div>

                {/* Tarjeta Directa: Clima Organizacional */}
                <div className="tarjeta-acceso-directo">
                  <div className="acceso-directo-icono clima">
                    <Users size={22} />
                  </div>
                  <h4 className="acceso-directo-titulo">Pulse y Buzón Anónimo</h4>
                  <p className="acceso-directo-descripcion">Monitoreo semanal del clima laboral y buzón cifrado para recepción de quejas y sugerencias.</p>
                  <button
                    type="button"
                    className="boton-ir-modulo"
                    onClick={() => manejar_cambio_modulo('clima')}
                  >
                    <span>Abrir Buzón Anónimo</span>
                    <ChevronRight size={14} />
                  </button>
                </div>

                {/* Tarjeta Directa: Gestión de Desempeño */}
                <div className="tarjeta-acceso-directo">
                  <div className="acceso-directo-icono desempeno">
                    <UserCheck size={22} />
                  </div>
                  <h4 className="acceso-directo-titulo">Copiloto de Feedback 1:1</h4>
                  <p className="acceso-directo-descripcion">Agenda pautas de feedback eficientes y analiza el cumplimiento de OKRs por colaborador.</p>
                  <button
                    type="button"
                    className="boton-ir-modulo"
                    onClick={() => manejar_cambio_modulo('desempeno')}
                  >
                    <span>Preparar Feedback</span>
                    <ChevronRight size={14} />
                  </button>
                </div>

              </div>

            </div>
          )}

          {/* VISTAS DE LOS MÓDULOS DE REACT */}
          {modulo_activo === 'consultas' && <ConsultasGenerales />}
          {modulo_activo === 'sentimiento' && <SentimientoDiario />}
          {modulo_activo === 'clima' && <ClimaOrganizacional />}
          {modulo_activo === 'desempeno' && <GestionDesempeno />}

        </div>

        {/* Pie de Página Corporativo */}
        <footer className="footer-copyright-seccion">
          <p className="footer-texto">© 2026 Garnier & Garnier Desarrollos Inmobiliarios. Todos los derechos reservados. Diseñado bajo estándares de Liderazgo Tecnológico en Capital Humano.</p>
        </footer>

      </main>
    </div>
  );
}

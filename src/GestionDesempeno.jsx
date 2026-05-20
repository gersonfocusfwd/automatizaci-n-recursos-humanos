import React, { useState } from 'react';
import { UserCheck, Award, MessageCircle, Calendar, ChevronRight, Copy, Check } from 'lucide-react';

/* 
  ARQUITECTURA DE COMPONENTE: GestionDesempeno
  ============================================
  Este componente proporciona una herramienta de apoyo (Copiloto) para líderes
  de departamento en Garnier & Garnier. Facilita la preparación de reuniones
  de retroalimentación 1:1 y alineación de OKRs mediante un motor de búsqueda
  simulado por ID de colaborador.
  
  Puntos de Conexión:
  - Integrado en el panel principal (App.jsx) en la sección de Liderazgo y Talento.
  - Utiliza datos estructurados para simular el comportamiento de bases de datos
    empresariales de Recursos Humanos.
*/

export default function GestionDesempeno() {
  // --- ESTADOS EN ESPAÑOL ---
  // id_colaborador: Almacena el código ingresado en el buscador (ej: G-1024).
  const [id_colaborador, establecer_id_colaborador] = useState('');
  
  // enfoque_reunion: Tipo de reunión seleccionada (Mensual, OKRs, Desarrollo).
  const [enfoque_reunion, establecer_enfoque_reunion] = useState('Revisión de OKRs');
  
  // datos_busqueda: Objeto con los datos del colaborador encontrado.
  const [datos_busqueda, establecer_datos_busqueda] = useState(null);
  
  // buscando_colaborador: Bandera booleana para simular el retardo de búsqueda de IA.
  const [buscando_colaborador, establecer_buscando_colaborador] = useState(false);
  
  // error_busqueda: Mensaje de error si el ID de colaborador no existe.
  const [error_busqueda, establecer_error_busqueda] = useState('');
  
  // copiado_exitoso: Estado para controlar el mensaje visual de copiar al portapapeles.
  const [copiado_exitoso, establecer_copiado_exitoso] = useState(false);

  // --- BASE DE DATOS MOCK DE COLABORADORES (GARNIER) ---
  const colaboradores_db = {
    'G-1024': {
      nombre: 'Ana Isabel Gómez',
      puesto: 'Directora de Proyectos Sostenibles',
      departamento: 'Ingeniería y Construcción',
      antiguedad: '4 años',
      desempeno_historico: 'Excepcional (95/100)',
      okrs: [
        { id: 1, meta: 'Reducir en 15% la huella de carbono en la construcción del nuevo Centro Corporativo.', progreso: 80, estado: 'En ruta' },
        { id: 2, meta: 'Implementar la certificación LEED Gold en dos de los proyectos inmobiliarios activos.', progreso: 60, estado: 'Requiere revisión' }
      ],
      comentarios_liderazgo: 'Alta capacidad de resolución técnica y gran iniciativa en innovación ecológica. Se recomienda guiarla en la delegación de tareas para evitar sobrecargas.',
      guias: {
        'Revisión Mensual': {
          rompehielos: '¿Cómo te has sentido balanceando los proyectos en campo con las capacitaciones de sostenibilidad?',
          puntos_clave: 'Revisar las demoras de contratación de contratistas LEED y analizar el avance de la medición de carbono.',
          acciones: 'Coordinar con Compras la agilización del proveedor ambiental y programar taller interno.'
        },
        'Revisión de OKRs': {
          rompehielos: '¿Qué obstáculos has detectado en el segundo hito de la certificación LEED Gold?',
          puntos_clave: 'Analizar el avance del 80% en reducción de carbono y redefinir plazos para la certificación.',
          acciones: 'Reunión de alineación con el Comité Ambiental y actualizar cronograma en Jira.'
        },
        'Plan de Desarrollo': {
          rompehielos: '¿Cuál es el siguiente paso que visualizas en tu carrera dentro de Garnier & Garnier?',
          puntos_clave: 'Potenciar sus habilidades de liderazgo estratégico y manejo de presupuestos de alto calibre.',
          acciones: 'Inscribirla en el Programa Garnier de Mentoría Ejecutiva y asignar un presupuesto piloto en Q3.'
        }
      }
    },
    'G-1085': {
      nombre: 'Carlos Eduardo Vargas',
      puesto: 'Especialista en Desarrollo BIM',
      departamento: 'Arquitectura y Diseño',
      antiguedad: '2 años',
      desempeno_historico: 'Cumple Expectativas (84/100)',
      okrs: [
        { id: 1, meta: 'Optimizar los tiempos de renderizado y modelado BIM en un 20% utilizando nuevas librerías.', progreso: 95, estado: 'Casi completado' },
        { id: 2, meta: 'Capacitar a 5 arquitectos del equipo en modelado avanzado Revit y Dynamo.', progreso: 40, estado: 'Retrasado' }
      ],
      comentarios_liderazgo: 'Excelente dominio técnico de herramientas arquitectónicas. Requiere trabajar en sus habilidades de comunicación y paciencia al capacitar al personal menos experimentado.',
      guias: {
        'Revisión Mensual': {
          rompehielos: '¿Qué tal va el nuevo software de modelado que implementamos a inicios de mes?',
          puntos_clave: 'Felicitar por el 95% de optimización de renders. Abordar el retraso de las capacitaciones a arquitectos.',
          acciones: 'Reducir sus horas de modelado operativo un 10% para que tenga espacio para dictar los talleres.'
        },
        'Revisión de OKRs': {
          rompehielos: '¿Cómo podemos acelerar el taller de capacitación de Dynamo sin afectar los planos activos?',
          puntos_clave: 'Estrategias para que los 5 arquitectos completen sus módulos de Revit avanzado.',
          acciones: 'Crear plantillas de autoaprendizaje y habilitar 1 hora los viernes para resolución de dudas.'
        },
        'Plan de Desarrollo': {
          rompehielos: '¿Qué habilidades no técnicas te gustaría fortalecer en los próximos seis meses?',
          puntos_clave: 'Habilidades de comunicación asertiva, empatía en procesos de mentoría técnica.',
          acciones: 'Asignar curso virtual en Udemy de Comunicación para Equipos Técnicos y dar feedback semanal.'
        }
      }
    },
    'G-1120': {
      nombre: 'Mariela Rojas Castro',
      puesto: 'Gerente de Atracción de Talento',
      departamento: 'Talento Humano',
      antiguedad: '1 año',
      desempeno_historico: 'Sobresaliente (90/100)',
      okrs: [
        { id: 1, meta: 'Reducir el tiempo promedio de contratación (Time-to-Hire) a menos de 25 días calendario.', progreso: 75, estado: 'En ruta' },
        { id: 2, meta: 'Incrementar la retención de personal contratado en periodo de prueba a un 95%.', progreso: 90, estado: 'En ruta' }
      ],
      comentarios_liderazgo: 'Muy proactiva en la digitalización del reclutamiento. Demuestra excelente alineación con la cultura organizacional de Garnier. Área de mejora: manejo presupuestario de agencias externas.',
      guias: {
        'Revisión Mensual': {
          rompehielos: '¿Cómo ha sido tu experiencia con las nuevas herramientas de inteligencia artificial en reclutamiento?',
          puntos_clave: 'Felicitar por la retención del 90%. Revisar gastos mensuales de pautas y agencias externas.',
          acciones: 'Establecer un límite de presupuesto de subcontratación y priorizar la base de talento interna.'
        },
        'Revisión de OKRs': {
          rompehielos: '¿Qué iniciativas han tenido mayor impacto para lograr que el Time-to-Hire baje a 26 días?',
          puntos_clave: 'Consolidación de las fases de entrevista y automatización de la prueba técnica inicial.',
          acciones: 'Documentar el flujo óptimo para compartirlo con las jefaturas de otros departamentos.'
        },
        'Plan de Desarrollo': {
          rompehielos: '¿Cómo te gustaría involucrarte más en la estrategia general de Garnier & Garnier?',
          puntos_clave: 'Desarrollo de conocimientos financieros corporativos e indicadores estratégicos (KPIs).',
          acciones: 'Participar como oyente en las revisiones presupuestarias de la junta directiva de Q3.'
        }
      }
    }
  };

  // --- MANEJADORES DE EVENTOS (onClick) ---

  // manejar_cambio_entrada_id: Monitorea el teclado del buscador.
  const manejar_cambio_entrada_id = (evento) => {
    establecer_id_colaborador(evento.target.value);
    establecer_error_busqueda('');
  };

  // manejar_click_enfoque: Selecciona el enfoque de la reunión (Tabs).
  const manejar_click_enfoque = (enfoque) => {
    establecer_enfoque_reunion(enfoque);
  };

  // manejar_click_buscar: Realiza la búsqueda simulada y asigna los datos correspondientes.
  const manejar_click_buscar = () => {
    const id_limpio = id_colaborador.trim().toUpperCase();
    
    if (!id_limpio) {
      establecer_error_busqueda('Por favor, ingresa un código de colaborador.');
      return;
    }

    establecer_buscando_colaborador(true);
    establecer_datos_busqueda(null);
    establecer_error_busqueda('');

    setTimeout(() => {
      if (colaboradores_db[id_limpio]) {
        establecer_datos_busqueda(colaboradores_db[id_limpio]);
      } else {
        establecer_error_busqueda('Código de colaborador no encontrado. Intenta con G-1024, G-1085 o G-1120.');
      }
      establecer_buscando_colaborador(false);
    }, 1000);
  };

  // manejar_click_copiar: Copia al portapapeles la pauta sugerida generada.
  const manejar_click_copiar = () => {
    if (!datos_busqueda) return;
    
    const guia_actual = datos_busqueda.guias[enfoque_reunion];
    const texto_copiar = `
PAUTA DE FEEDBACK SUGERIDA POR COPILOTO IA
==========================================
Colaborador: ${datos_busqueda.nombre} (${datos_busqueda.puesto})
Enfoque: ${enfoque_reunion}
------------------------------------------
1. Rompehielos sugerido:
"${guia_actual.rompehielos}"

2. Puntos clave a discutir:
- ${guia_actual.puntos_clave}

3. Plan de acción recomendado:
- ${guia_actual.actions || guia_actual.acciones}
    `.trim();

    navigator.clipboard.writeText(texto_copiar).then(() => {
      establecer_copiado_exitoso(true);
      setTimeout(() => establecer_copiado_exitoso(false), 2000);
    });
  };

  // obtener_color_progreso: Devuelve una clase específica según el porcentaje del OKR.
  const obtener_color_progreso = (porcentaje) => {
    if (porcentaje >= 80) return 'barra-color-verde';
    if (porcentaje >= 50) return 'barra-color-azul';
    return 'barra-color-amarillo';
  };

  return (
    <div className="modulo-contenedor">
      {/* Encabezado del Módulo */}
      <div className="modulo-encabezado">
        <h2 className="modulo-titulo">Copiloto de Desempeño y OKRs</h2>
        <p className="modulo-subtitulo">Asistente inteligente para que los líderes estructuren reuniones de feedback 1:1 eficientes y alineadas.</p>
      </div>

      {/* Buscador de Colaborador */}
      <div className="buscador-colaborador-caja">
        <div className="buscador-campos">
          <div className="buscador-input-grupo">
            <span className="buscador-prefijo">ID:</span>
            <input
              type="text"
              className="buscador-campo-texto"
              placeholder="Ej: G-1024, G-1085, G-1120"
              value={id_colaborador}
              onChange={manejar_cambio_entrada_id}
              disabled={buscando_colaborador}
            />
          </div>
          <button
            type="button"
            className="boton-accion-principal"
            onClick={manejar_click_buscar}
            disabled={buscando_colaborador}
          >
            {buscando_colaborador ? 'Cargando...' : 'Generar Pauta'}
          </button>
        </div>
        {error_busqueda && <p className="buscador-error-mensaje">{error_busqueda}</p>}
        <p className="buscador-ayuda-texto">Códigos de prueba activos: <strong>G-1024</strong> (Ana), <strong>G-1085</strong> (Carlos) o <strong>G-1120</strong> (Mariela).</p>
      </div>

      {/* Cargando datos */}
      {buscando_colaborador && (
        <div className="tarjeta-cargando-animada">
          <div className="cargador-esferas">
            <span className="esfera"></span>
            <span className="esfera"></span>
            <span className="esfera"></span>
          </div>
          <p className="cargando-texto">Consultando expediente de desempeño y métricas de OKRs en Garnier Cloud...</p>
        </div>
      )}

      {/* Panel de Información del Colaborador Encontrado */}
      {datos_busqueda && !buscando_colaborador && (
        <div className="modulo-grid-distribucion">
          {/* Ficha Técnica y OKRs (Columna Principal) */}
          <div className="modulo-col-principal">
            <div className="caja-interaccion">
              {/* Información Personal */}
              <div className="ficha-personal-encabezado">
                <div className="ficha-personal-iniciales">
                  {datos_busqueda.nombre.split(' ').map(n => n[0]).slice(0, 2).join('')}
                </div>
                <div className="ficha-personal-detalles">
                  <h3 className="ficha-personal-nombre">{datos_busqueda.nombre}</h3>
                  <p className="ficha-personal-puesto">{datos_busqueda.puesto} • <span className="ficha-personal-depto">{datos_busqueda.departamento}</span></p>
                  <div className="ficha-personal-tags">
                    <span className="ficha-tag">Antigüedad: {datos_busqueda.antiguedad}</span>
                    <span className="ficha-tag">Evaluación: {datos_busqueda.desempeno_historico}</span>
                  </div>
                </div>
              </div>

              {/* Sección OKRs Activos */}
              <div className="gestion-okr-seccion">
                <h4 className="seccion-subtitulo-interno">Objetivos y Resultados Clave (OKRs) - Q2</h4>
                <div className="okr-lista">
                  {datos_busqueda.okrs.map((okr) => (
                    <div key={okr.id} className="okr-tarjeta-item">
                      <div className="okr-tarjeta-info">
                        <p className="okr-meta-texto">{okr.meta}</p>
                        <span className={`okr-estado-insignia estado-${okr.estado.toLowerCase().replace(' ', '-')}`}>
                          {okr.estado}
                        </span>
                      </div>
                      <div className="okr-progreso-bloque">
                        <div className="barra-progreso-contenedor">
                          <div 
                            className={`barra-progreso-llenado ${obtener_color_progreso(okr.progreso)}`} 
                            style={{ width: `${okr.progreso}%` }}
                          />
                        </div>
                        <span className="okr-porcentaje-texto">{okr.progreso}% completado</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Guía Sugerida del Copiloto (Columna Secundaria / Derecha) */}
          <div className="modulo-col-secundaria">
            <div className="tarjeta-guia-copiloto">
              <div className="guia-copiloto-encabezado">
                <div className="guia-copiloto-titulo-caja">
                  <Award className="icono-guia-titulo" size={18} />
                  <h4>Pauta Sugerida 1:1</h4>
                </div>
                <button
                  type="button"
                  className={`boton-icono-accion ${copiado_exitoso ? 'copiado' : ''}`}
                  onClick={manejar_click_copiar}
                  title="Copiar guía"
                >
                  {copiado_exitoso ? <Check size={16} /> : <Copy size={16} />}
                </button>
              </div>

              {/* Selector de Enfoque de Reunión */}
              <div className="guia-tabs-selector">
                {['Revisión Mensual', 'Revisión de OKRs', 'Plan de Desarrollo'].map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    className={`boton-tab-enfoque ${enfoque_reunion === tab ? 'activo' : ''}`}
                    onClick={() => establecer_enfoque_reunion(tab)}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="guia-cuerpo-contenido">
                {/* Paso 1: Rompehielos */}
                <div className="guia-cuerpo-seccion">
                  <div className="guia-seccion-numero">1</div>
                  <div className="guia-seccion-textos">
                    <span className="guia-seccion-etiqueta">Pregunta Rompehielos sugerida:</span>
                    <p className="guia-seccion-descripcion">"{datos_busqueda.guias[enfoque_reunion].rompehielos}"</p>
                  </div>
                </div>

                {/* Paso 2: Puntos Clave */}
                <div className="guia-cuerpo-seccion">
                  <div className="guia-seccion-numero">2</div>
                  <div className="guia-seccion-textos">
                    <span className="guia-seccion-etiqueta">Puntos clave para el diálogo:</span>
                    <p className="guia-seccion-descripcion">{datos_busqueda.guias[enfoque_reunion].puntos_clave}</p>
                  </div>
                </div>

                {/* Paso 3: Plan de Acción */}
                <div className="guia-cuerpo-seccion">
                  <div className="guia-seccion-numero">3</div>
                  <div className="guia-seccion-textos">
                    <span className="guia-seccion-etiqueta">Plan de acción e hitos propuestos:</span>
                    <p className="guia-seccion-descripcion">
                      {datos_busqueda.guias[enfoque_reunion].acciones || datos_busqueda.guias[enfoque_reunion].actions}
                    </p>
                  </div>
                </div>
              </div>

              {/* Nota de Liderazgo */}
              <div className="guia-comentarios-historicos">
                <span className="guia-comentarios-etiqueta">Nota del Historial del Líder:</span>
                <p className="guia-comentarios-contenido">{datos_busqueda.comentarios_liderazgo}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pantalla vacía inicial (sin búsqueda) */}
      {!datos_busqueda && !buscando_colaborador && (
        <div className="tarjeta-guia-vacia">
          <div className="guia-vacia-icono-contenedor">
            <UserCheck className="icono-guia-vacío" size={40} />
          </div>
          <h3 className="guia-vacia-titulo">Consulta un expediente de colaborador</h3>
          <p className="guia-vacia-descripcion">
            Digita el código del colaborador en el buscador superior para extraer sus OKRs activos, historial de desempeño y compilar una agenda interactiva de conversación personalizada para tu próxima reunión 1:1.
          </p>
        </div>
      )}
    </div>
  );
}

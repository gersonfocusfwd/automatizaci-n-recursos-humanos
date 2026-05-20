import React, { useState } from 'react';
import { Send, BookOpen, Clock, ShieldCheck, HelpCircle } from 'lucide-react';

/* 
  ARQUITECTURA DE COMPONENTE: ConsultasGenerales
  ==============================================
  Este componente actúa como la interfaz del Agente 24/7 de Garnier & Garnier.
  Se conecta con el sistema simulado de base de conocimientos de políticas internas,
  permitiendo que los colaboradores realicen preguntas sobre vacaciones, teletrabajo y salud.
  
  Puntos de Conexión:
  - Se integra en el panel principal (App.jsx) como uno de los módulos de autoservicio.
  - Utiliza estados de React en español para gestionar la interacción del usuario sin formularios.
*/

export default function ConsultasGenerales() {
  // --- ESTADOS EN ESPAÑOL ---
  // consulta_texto: Almacena el valor de entrada digitado por el usuario en la caja de texto.
  const [consulta_texto, establecer_consulta_texto] = useState('');
  
  // respuesta_del_agente: Almacena el objeto de respuesta simulada de la Inteligencia Artificial.
  const [respuesta_del_agente, establecer_respuesta_del_agente] = useState(null);
  
  // esta_buscando: Estado booleano para indicar que la IA está procesando la solicitud.
  const [esta_buscando, establecer_esta_buscando] = useState(false);
  
  // historial_consultas: Almacena las consultas previas para simular la sesión activa.
  const [historial_consultas, establecer_historial_consultas] = useState([
    {
      id: 1,
      pregunta: '¿Cuál es el beneficio de días adicionales de vacaciones por antigüedad?',
      respuesta: 'En Garnier & Garnier, a partir del tercer año de servicio continuo, el colaborador acumula 1 día adicional por año, hasta un máximo de 15 días hábiles totales.',
      categoria: 'Vacaciones'
    },
    {
      id: 2,
      pregunta: '¿Cómo reporto mi teletrabajo semanal?',
      respuesta: 'Debes registrar tus días de teletrabajo aprobados en la plataforma Garnier Connect los días lunes antes del mediodía para la planificación de tu departamento.',
      categoria: 'Teletrabajo'
    }
  ]);

  // --- BASE DE DATOS DE SIMULACIÓN (POLÍTICAS GARNIER) ---
  const base_conocimiento_politicas = {
    vacaciones: {
      titulo: 'Política de Vacaciones y Descansos Garnier',
      respuesta: 'De acuerdo con el artículo 12 del Manual Interno de Garnier & Garnier, todos los colaboradores tienen derecho a 12 días hábiles de vacaciones remuneradas tras completar un año de servicios continuos. Además, contamos con el beneficio de "Día de Cumpleaños Libre" que puede ser gozado durante el mes de aniversario previa coordinación con la jefatura directa.',
      documento_referencia: 'Manual del Colaborador - Sección 4.1',
      tiempo_lectura: '2 min de lectura'
    },
    teletrabajo: {
      titulo: 'Políticas de Trabajo Híbrido Garnier Flex',
      respuesta: 'El programa Garnier Flex establece un modelo de trabajo híbrido sugerido de 3 días presenciales y 2 días remotos para puestos elegibles administrativamente. El horario principal de atención colaborativa obligatoria es de 8:00 AM a 5:00 PM. Se requiere una conexión a Internet de banda ancha de mínimo 30 Mbps y el uso del equipo de cómputo corporativo con la VPN activa.',
      documento_referencia: 'Manual Garnier Flex - Edición 2026',
      tiempo_lectura: '4 min de lectura'
    },
    salud: {
      titulo: 'Protocolo de Salud y Reporte de Incapacidades',
      respuesta: 'Toda incapacidad médica emitida por la CCSS o por médico privado avalado debe ser remitida al departamento de Talento Humano dentro de las primeras 48 horas de la ausencia. En caso de citas médicas programadas, debes ingresar la solicitud de permiso en la plataforma con al menos 3 días hábiles de anticipación para asegurar la cobertura operativa.',
      documento_referencia: 'Reglamento Autónomo de Trabajo - Cap. IX',
      tiempo_lectura: '3 min de lectura'
    },
    defecto: {
      titulo: 'Consulta General Procesada por Garnier IA',
      respuesta: 'Hemos analizado tu consulta en la base de conocimientos global de Garnier. Si bien la pregunta no encaja exactamente en nuestras tres categorías principales (Vacaciones, Teletrabajo o Salud), te sugerimos contactar directamente al centro de soporte de Talento Humano a través de talento@garnier.cr o consultar el Reglamento Autónomo de Trabajo en la intranet corporativa.',
      documento_referencia: 'Manual del Colaborador General',
      tiempo_lectura: '1 min de lectura'
    }
  };

  // --- MANEJADORES DE EVENTOS (ESTRICTO SIN <FORM>) ---
  
  // manejar_cambio_entrada: Sincroniza la entrada de texto con el estado local.
  const manejar_cambio_entrada = (evento) => {
    establecer_consulta_texto(evento.target.value);
  };

  // manejar_click_enviar_consulta: Procesa la consulta del usuario simulando un tiempo de espera de la IA.
  const manejar_click_enviar_consulta = () => {
    if (!consulta_texto.trim()) return;

    establecer_esta_buscando(true);
    establecer_respuesta_del_agente(null);

    // Simulación de delay de red de la IA para dar realismo a la interacción
    setTimeout(() => {
      const texto_en_minuscula = consulta_texto.toLowerCase();
      let respuesta_seleccionada = base_conocimiento_politicas.defecto;
      let categoria_detectada = 'General';

      if (texto_en_minuscula.includes('vacacion') || texto_en_minuscula.includes('libre') || texto_en_minuscula.includes('cumpleaños')) {
        respuesta_seleccionada = base_conocimiento_politicas.vacaciones;
        categoria_detectada = 'Vacaciones';
      } else if (texto_en_minuscula.includes('teletrabajo') || texto_en_minuscula.includes('casa') || texto_en_minuscula.includes('remoto') || texto_en_minuscula.includes('flex')) {
        respuesta_seleccionada = base_conocimiento_politicas.teletrabajo;
        categoria_detectada = 'Teletrabajo';
      } else if (texto_en_minuscula.includes('salud') || texto_en_minuscula.includes('incapacidad') || texto_en_minuscula.includes('médico') || texto_en_minuscula.includes('enfermedad')) {
        respuesta_seleccionada = base_conocimiento_politicas.salud;
        categoria_detectada = 'Salud';
      }

      // Establecemos el estado de respuesta simulada
      establecer_respuesta_del_agente({
        pregunta_origen: consulta_texto,
        titulo: respuesta_seleccionada.titulo,
        contenido: respuesta_seleccionada.respuesta,
        referencia: respuesta_seleccionada.documento_referencia,
        tiempo: respuesta_seleccionada.tiempo_lectura,
        categoria: categoria_detectada
      });

      // Añadimos la consulta actual al historial al inicio de la lista
      establecer_historial_consultas((previo_historial) => [
        {
          id: Date.now(),
          pregunta: consulta_texto,
          respuesta: respuesta_seleccionada.respuesta,
          categoria: categoria_detectada
        },
        ...previo_historial.slice(0, 4) // Mantener solo las últimas 5
      ]);

      // Apagamos el estado de carga y limpiamos la caja de texto
      establecer_esta_buscando(false);
      establecer_consulta_texto('');
    }, 1200);
  };

  // manejar_click_pregunta_rapida: Permite hacer clic en preguntas predefinidas para facilitar la interacción.
  const manejar_click_pregunta_rapida = (texto_pregunta) => {
    establecer_consulta_texto(texto_pregunta);
  };

  return (
    <div className="modulo-contenedor">
      {/* Encabezado del Módulo */}
      <div className="modulo-encabezado">
        <h2 className="modulo-titulo">Agente de Consultas 24/7</h2>
        <p className="modulo-subtitulo">Resuelve al instante tus dudas sobre vacaciones, teletrabajo y normativas internas.</p>
      </div>

      <div className="modulo-grid-distribucion">
        {/* Panel Izquierdo: Entrada de Consulta */}
        <div className="modulo-col-principal">
          <div className="caja-interaccion">
            <h3 className="caja-titulo">¿Qué deseas consultar hoy?</h3>
            <p className="caja-instrucciones">Escribe tu pregunta detallada abajo. El agente inteligente Garnier buscará en las políticas oficiales vigentes.</p>
            
            <div className="caja-texto-contenedor">
              <textarea
                className="caja-texto-entrada"
                placeholder="Ej. ¿Cuáles son las reglas para hacer teletrabajo y cuántos días puedo solicitar?"
                value={consulta_texto}
                onChange={manejar_cambio_entrada}
                rows={3}
                disabled={esta_buscando}
              />
              <button
                type="button"
                className="boton-accion-principal"
                onClick={manejar_click_enviar_consulta}
                disabled={esta_buscando || !consulta_texto.trim()}
              >
                {esta_buscando ? (
                  <span className="boton-cargando">Procesando...</span>
                ) : (
                  <>
                    <span>Consultar Agente</span>
                    <Send className="icono-boton" size={16} />
                  </>
                )}
              </button>
            </div>

            {/* Sugerencias Rápidas */}
            <div className="sugerencias-contenedor">
              <span className="sugerencias-etiqueta">Preguntas frecuentes:</span>
              <div className="sugerencias-lista">
                <button
                  type="button"
                  className="boton-sugerencia"
                  onClick={() => manejar_click_pregunta_rapida('¿Cómo funciona el modelo Garnier Flex de teletrabajo?')}
                  disabled={esta_buscando}
                >
                  Teletrabajo Flex
                </button>
                <button
                  type="button"
                  className="boton-sugerencia"
                  onClick={() => manejar_click_pregunta_rapida('¿Cuántos días de vacaciones tengo en mi primer año?')}
                  disabled={esta_buscando}
                >
                  Días de Vacaciones
                </button>
                <button
                  type="button"
                  className="boton-sugerencia"
                  onClick={() => manejar_click_pregunta_rapida('¿Qué debo hacer si tengo una incapacidad médica?')}
                  disabled={esta_buscando}
                >
                  Incapacidades CCSS
                </button>
              </div>
            </div>
          </div>

          {/* Despliegue del Resultado Principal */}
          {esta_buscando && (
            <div className="tarjeta-cargando-animada">
              <div className="cargador-esferas">
                <span className="esfera"></span>
                <span className="esfera"></span>
                <span className="esfera"></span>
              </div>
              <p className="cargando-texto">Buscando en manuales y reglamentos de Garnier & Garnier...</p>
            </div>
          )}

          {respuesta_del_agente && !esta_buscando && (
            <div className="tarjeta-respuesta-ia">
              <div className="respuesta-ia-encabezado">
                <span className="insignia-verificacion">
                  <ShieldCheck size={14} className="icono-insignia" />
                  <span>Respuesta Oficial Verificada</span>
                </span>
                <div className="respuesta-ia-metadatos">
                  <span className="respuesta-ia-metadato">
                    <BookOpen size={12} />
                    <span>{respuesta_del_agente.referencia}</span>
                  </span>
                  <span className="respuesta-ia-metadato">
                    <Clock size={12} />
                    <span>{respuesta_del_agente.tiempo}</span>
                  </span>
                </div>
              </div>

              <div className="respuesta-ia-cuerpo">
                <h4 className="respuesta-ia-titulo">{respuesta_del_agente.titulo}</h4>
                <p className="respuesta-ia-texto">{respuesta_del_agente.contenido}</p>
              </div>

              <div className="respuesta-ia-pie">
                <span className="pregunta-origen-etiqueta">Consulta realizada:</span>
                <span className="pregunta-origen-texto">"{respuesta_del_agente.pregunta_origen}"</span>
              </div>
            </div>
          )}
        </div>

        {/* Panel Derecho: Historial de Consultas de la Sesión */}
        <div className="modulo-col-secundaria">
          <div className="tarjeta-lateral-informacion">
            <h3 className="lateral-titulo">Historial de Consultas</h3>
            <p className="lateral-descripcion">Tus consultas recientes y respuestas indexadas en esta sesión.</p>
            
            <div className="historial-lista">
              {historial_consultas.map((item) => (
                <div key={item.id} className="historial-item">
                  <div className="historial-item-encabezado">
                    <span className="historial-categoria">{item.categoria}</span>
                  </div>
                  <p className="historial-pregunta">{item.pregunta}</p>
                  <p className="historial-respuesta">{item.respuesta}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

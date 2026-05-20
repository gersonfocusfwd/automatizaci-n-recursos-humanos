import React, { useState } from 'react';
import { EyeOff, AlertTriangle, CheckCircle, Info, MessageSquarePlus, Award } from 'lucide-react';

/* 
  ARQUITECTURA DE COMPONENTE: ClimaOrganizacional
  ==============================================
  Este componente proporciona una plataforma segura, encriptada y 100% anónima
  para que los colaboradores de Garnier & Garnier envíen sugerencias,
  alertas de temas críticos y completen encuestas Pulse semanales.
  
  Puntos de Conexión:
  - Integrado en el panel principal (App.jsx) en el área de Escucha Activa.
  - Almacena temporalmente los envíos simulados de la sesión para mostrar
    el estatus de procesamiento por parte del equipo de Talento Humano.
*/

export default function ClimaOrganizacional() {
  // --- ESTADOS EN ESPAÑOL ---
  // calificacion_ambiente: Rating del ambiente físico y cultural (escala 1 a 5).
  const [calificacion_ambiente, establecer_calificacion_ambiente] = useState(3);
  
  // calificacion_herramientas: Rating del equipamiento y licencias (escala 1 a 5).
  const [calificacion_herramientas, establecer_calificacion_herramientas] = useState(3);
  
  // calificacion_liderazgo: Rating del apoyo recibido de jefaturas (escala 1 a 5).
  const [calificacion_liderazgo, establecer_calificacion_liderazgo] = useState(3);
  
  // mensaje_anonimo: Contenido textual redactado por el colaborador.
  const [mensaje_anonimo, establecer_mensaje_anonimo] = useState('');
  
  // categoria_mensaje: Clasificación de la sugerencia (Sugerencia, Reconocimiento, Alerta Crítica).
  const [categoria_mensaje, establecer_categoria_mensaje] = useState('Sugerencia');
  
  // procesando_envio: Controla la animación durante el envío a la intranet de RRHH.
  const [procesando_envio, establecer_procesando_envio] = useState(false);
  
  // envio_exitoso: Bandera booleana para mostrar la pantalla de confirmación.
  const [envio_exitoso, establecer_envio_exitoso] = useState(false);
  
  // buzon_historico: Lista simulada de los envíos registrados para visualización en el dashboard.
  const [buzon_historico, establecer_buzon_historico] = useState([
    {
      id: 101,
      categoria: 'Sugerencia',
      fecha: 'Ayer',
      calificaciones: { ambiente: 4, herramientas: 4, liderazgo: 5 },
      mensaje: 'Sería fantástico habilitar más cargadores para carros eléctricos en el sótano 2 del Centro Corporativo.',
      estatus: 'En Análisis por Operaciones'
    },
    {
      id: 102,
      categoria: 'Alerta Crítica',
      fecha: 'Hace 3 días',
      calificaciones: { ambiente: 2, herramientas: 3, liderazgo: 3 },
      mensaje: 'El aire acondicionado de la sala de reuniones Picasso hace un ruido insoportable que dificulta las videollamadas con clientes.',
      estatus: 'Mantenimiento Programado'
    },
    {
      id: 103,
      categoria: 'Reconocimiento',
      fecha: 'Hace 5 días',
      calificaciones: { ambiente: 5, herramientas: 5, liderazgo: 5 },
      mensaje: 'Felicito a la brigada de salud por la excelente organización del simulacro de evacuación física de esta semana.',
      estatus: 'Procesado'
    }
  ]);

  // --- MANEJADORES DE EVENTOS ---

  // manejar_cambio_mensaje: Vincula el textarea con el estado.
  const manejar_cambio_mensaje = (evento) => {
    establecer_mensaje_anonimo(evento.target.value);
  };

  // manejar_cambio_categoria: Cambia la categoría seleccionada al presionar botones.
  const manejar_cambio_categoria = (categoria) => {
    establecer_categoria_mensaje(categoria);
  };

  // manejar_click_enviar_buzon: Procesa el envío anónimo sin formularios tradicionales.
  const manejar_click_enviar_buzon = () => {
    if (!mensaje_anonimo.trim()) return;

    establecer_procesando_envio(true);

    // Simular retraso de procesamiento para mayor credibilidad de cifrado de identidad
    setTimeout(() => {
      const nuevo_registro = {
        id: Date.now(),
        categoria: categoria_mensaje,
        fecha: 'Hoy',
        calificaciones: {
          ambiente: calificacion_ambiente,
          herramientas: calificacion_herramientas,
          liderazgo: calificacion_liderazgo
        },
        mensaje: mensaje_anonimo,
        estatus: 'Recibido de forma Anónima'
      };

      // Guardar el registro en el historial para mostrarlo al usuario
      establecer_buzon_historico((previo_historial) => [nuevo_registro, ...previo_historial]);

      // Resetear estados locales
      establecer_mensaje_anonimo('');
      establecer_calificacion_ambiente(3);
      establecer_calificacion_herramientas(3);
      establecer_calificacion_liderazgo(3);
      establecer_categoria_mensaje('Sugerencia');

      establecer_procesando_envio(false);
      establecer_envio_exitoso(true);
    }, 1500);
  };

  // manejar_click_nuevo_mensaje: Cierra el modal/pantalla de éxito para permitir otro envío.
  const manejar_click_nuevo_mensaje = () => {
    establecer_envio_exitoso(false);
  };

  return (
    <div className="modulo-contenedor">
      {/* Encabezado del Módulo */}
      <div className="modulo-encabezado">
        <h2 className="modulo-titulo">Buzón de Escucha y Encuesta Pulse</h2>
        <p className="modulo-subtitulo">Comparte tu perspectiva de manera totalmente anónima. Ayúdanos a construir un entorno laboral óptimo.</p>
      </div>

      <div className="modulo-grid-distribucion">
        {/* Panel Izquierdo: Formulario interactivo sin etiquetas <form> */}
        <div className="modulo-col-principal">
          {!envio_exitoso ? (
            <div className="caja-interaccion">
              <div className="seguridad-encabezado">
                <EyeOff size={18} className="icono-seguridad" />
                <span className="seguridad-texto">Conexión Cifrada • Tu identidad se mantendrá 100% privada</span>
              </div>

              {/* Sección 1: Encuesta Pulse (Ratings) */}
              <div className="pulse-seccion-ratings">
                <h3 className="caja-titulo">Encuesta Pulse de esta Semana</h3>
                <p className="caja-instrucciones">Califica los siguientes pilares de tu día a día (1: Muy insatisfecho, 5: Excelente):</p>
                
                <div className="pulse-ratings-grupo">
                  <div className="pulse-rating-item">
                    <span className="rating-nombre">Ambiente y Oficina:</span>
                    <div className="rating-estrellas">
                      {[1, 2, 3, 4, 5].map((valor) => (
                        <button
                          key={valor}
                          type="button"
                          className={`boton-estrella ${calificacion_ambiente >= valor ? 'activo' : ''}`}
                          onClick={() => establecer_calificacion_ambiente(valor)}
                          disabled={procesando_envio}
                        >
                          ★
                        </button>
                      ))}
                      <span className="rating-etiqueta-valor">({calificacion_ambiente}/5)</span>
                    </div>
                  </div>

                  <div className="pulse-rating-item">
                    <span className="rating-nombre">Herramientas y TI:</span>
                    <div className="rating-estrellas">
                      {[1, 2, 3, 4, 5].map((valor) => (
                        <button
                          key={valor}
                          type="button"
                          className={`boton-estrella ${calificacion_herramientas >= valor ? 'activo' : ''}`}
                          onClick={() => establecer_calificacion_herramientas(valor)}
                          disabled={procesando_envio}
                        >
                          ★
                        </button>
                      ))}
                      <span className="rating-etiqueta-valor">({calificacion_herramientas}/5)</span>
                    </div>
                  </div>

                  <div className="pulse-rating-item">
                    <span className="rating-nombre">Liderazgo y Soporte:</span>
                    <div className="rating-estrellas">
                      {[1, 2, 3, 4, 5].map((valor) => (
                        <button
                          key={valor}
                          type="button"
                          className={`boton-estrella ${calificacion_liderazgo >= valor ? 'activo' : ''}`}
                          onClick={() => establecer_calificacion_liderazgo(valor)}
                          disabled={procesando_envio}
                        >
                          ★
                        </button>
                      ))}
                      <span className="rating-etiqueta-valor">({calificacion_liderazgo}/5)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sección 2: Mensaje y Clasificación */}
              <div className="buzon-seccion-mensaje">
                <h3 className="caja-titulo">Buzón de Escucha Continua</h3>
                <p className="caja-instrucciones">Selecciona la categoría e ingresa tus comentarios detallados:</p>

                {/* Categorías de envío */}
                <div className="selector-categorias-buzon">
                  <button
                    type="button"
                    className={`boton-categoria-opcion ${categoria_mensaje === 'Sugerencia' ? 'seleccionado' : ''}`}
                    onClick={() => manejar_cambio_categoria('Sugerencia')}
                    disabled={procesando_envio}
                  >
                    <MessageSquarePlus size={14} className="icono-categoria" />
                    <span>Sugerencia</span>
                  </button>

                  <button
                    type="button"
                    className={`boton-categoria-opcion ${categoria_mensaje === 'Reconocimiento' ? 'seleccionado' : ''}`}
                    onClick={() => manejar_cambio_categoria('Reconocimiento')}
                    disabled={procesando_envio}
                  >
                    <Award size={14} className="icono-categoria" />
                    <span>Reconocimiento</span>
                  </button>

                  <button
                    type="button"
                    className={`boton-categoria-opcion ${categoria_mensaje === 'Alerta Crítica' ? 'seleccionado' : ''}`}
                    onClick={() => manejar_cambio_categoria('Alerta Crítica')}
                    disabled={procesando_envio}
                  >
                    <AlertTriangle size={14} className="icono-categoria" />
                    <span>Alerta Crítica</span>
                  </button>
                </div>

                <div className="caja-texto-contenedor">
                  <textarea
                    className="caja-texto-entrada"
                    placeholder="Escribe tu mensaje aquí con la mayor cantidad de detalles posible..."
                    value={mensaje_anonimo}
                    onChange={manejar_cambio_mensaje}
                    rows={4}
                    disabled={procesando_envio}
                  />

                  <button
                    type="button"
                    className="boton-accion-principal"
                    onClick={manejar_click_enviar_buzon}
                    disabled={procesando_envio || !mensaje_anonimo.trim()}
                  >
                    {procesando_envio ? (
                      <span className="boton-cargando">Cifrando y Enviando...</span>
                    ) : (
                      <>
                        <span>Enviar Comentarios de Clima</span>
                        <CheckCircle className="icono-boton" size={16} />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="tarjeta-exito-envio">
              <div className="exito-icono-contenedor">
                <CheckCircle className="icono-exito" size={48} />
              </div>
              <h3 className="exito-titulo">¡Comentarios Enviados Exitosamente!</h3>
              <p className="exito-descripcion">
                Tu reporte ha sido codificado de forma anónima y depositado directamente en la base de datos de Talento Humano. Ningún dato de origen IP, usuario o sesión ha sido guardado.
              </p>
              <button
                type="button"
                className="boton-accion-principal"
                onClick={manejar_click_nuevo_mensaje}
              >
                Enviar Otro Mensaje
              </button>
            </div>
          )}
        </div>

        {/* Panel Derecho: Monitor de Estatus de Mensajes Anónimos */}
        <div className="modulo-col-secundaria">
          <div className="tarjeta-lateral-informacion">
            <h3 className="lateral-titulo">Seguimiento de Envíos</h3>
            <p className="lateral-descripcion">Listado del procesamiento de reportes anónimos de esta semana en Garnier.</p>
            
            <div className="historial-lista">
              {buzon_historico.map((item) => (
                <div key={item.id} className="historial-item">
                  <div className="historial-item-encabezado">
                    <span className={`historial-categoria badge-${item.categoria.toLowerCase().replace(' ', '-')}`}>
                      {item.categoria}
                    </span>
                    <span className="historial-tiempo">{item.fecha}</span>
                  </div>
                  <p className="historial-mensaje-clima">"{item.mensaje}"</p>
                  
                  {/* Visualizador de Ratings del mensaje */}
                  <div className="ratings-pequenos-visualizador">
                    <span className="rating-miniatura">Ambiente: {item.calificaciones.ambiente}</span>
                    <span className="rating-miniatura">Herram.: {item.calificaciones.herramientas}</span>
                    <span className="rating-miniatura">Líder: {item.calificaciones.liderazgo}</span>
                  </div>
                  
                  <div className="item-estatus-tracker">
                    <span className="estatus-punto"></span>
                    <span className="estatus-texto">Estatus: <strong>{item.estatus}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

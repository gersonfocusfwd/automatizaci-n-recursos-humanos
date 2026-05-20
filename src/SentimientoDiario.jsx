import React, { useState } from 'react';
import { Heart, ShieldAlert, Sparkles, Smile, MessageSquare, CornerDownRight } from 'lucide-react';

/* 
  ARQUITECTURA DE COMPONENTE: SentimientoDiario
  ==============================================
  Este componente proporciona a Garnier & Garnier una herramienta interactiva
  para el monitoreo del bienestar emocional de sus colaboradores. 
  Procesa texto libre mediante un analizador de sentimientos simulado y genera
  métricas de estrés, orgullo, ansiedad y entusiasmo con su respectivo nivel de alerta.
  
  Puntos de Conexión:
  - Integrado en el panel de control principal (App.jsx) en la sección de Salud Organizacional.
  - Se vincula con la política Garnier Balance a través de recomendaciones dinámicas.
*/

export default function SentimientoDiario() {
  // --- ESTADOS EN ESPAÑOL ---
  // texto_emocional: Almacena el párrafo descriptivo ingresado por el colaborador.
  const [texto_emocional, establecer_texto_emocional] = useState('');
  
  // resultado_analisis: Guarda el objeto con las métricas estimadas tras procesar el texto.
  const [resultado_analisis, establecer_resultado_analisis] = useState(null);
  
  // ejecutando_analisis: Controla la animación y estado de procesamiento del componente.
  const [ejecutando_analisis, establecer_ejecutando_analisis] = useState(false);

  // --- MOCK DATABASE DE EJEMPLOS EMOCIONALES ---
  const ejemplos_predefinidos = [
    {
      titulo: 'Caso de Alta Presión',
      texto: 'Me siento bastante abrumado con la entrega del diseño arquitectónico del nuevo condominio. Las fechas están muy encima y siento que el equipo está cansado.',
      categoria: 'Estrés laboral'
    },
    {
      titulo: 'Caso de Éxito y Logro',
      texto: 'Hoy cerramos con éxito la fase de ventas del Centro Corporativo El Cafetal. Estoy sumamente orgulloso del esfuerzo conjunto del equipo y el resultado obtenido.',
      categoria: 'Orgullo / Motivación'
    },
    {
      titulo: 'Caso de Incertidumbre',
      texto: 'Me da un poco de ansiedad el cambio de sistema que implementaremos la próxima semana. Temo que tengamos problemas en la atención inicial de clientes.',
      categoria: 'Incertidumbre'
    }
  ];

  // --- MANEJADORES DE INTERACCIÓN ---

  // manejar_cambio_texto: Actualiza el texto en tiempo real.
  const manejar_cambio_texto = (evento) => {
    establecer_texto_emocional(evento.target.value);
  };

  // manejar_click_cargar_ejemplo: Permite autocompletar el campo de texto con un ejemplo predefinido.
  const manejar_click_cargar_ejemplo = (texto_ejemplo) => {
    establecer_texto_emocional(texto_ejemplo);
  };

  // manejar_click_analizar: Ejecuta el análisis semántico simulado y establece las métricas correspondientes.
  const manejar_click_analizar = () => {
    if (!texto_emocional.trim()) return;

    establecer_ejecutando_analisis(true);
    establecer_resultado_analisis(null);

    // Simulación del procesamiento de IA
    setTimeout(() => {
      const texto_limpio = texto_emocional.toLowerCase();
      
      // Valores base por defecto
      let metrica_estres = 20;
      let metrica_orgullo = 45;
      let metrica_ansiedad = 30;
      let metrica_entusiasmo = 50;
      let emocion_dominante = 'Equilibrio';
      let nivel_alerta = 'Estable (Verde)';
      let estilo_alerta = 'alerta-verde';
      let recomendaciones = 'Continúa con tus hábitos saludables. Te recomendamos agendar tu sesión de pausa activa de esta semana.';

      // Lógica de detección de palabras clave en español
      if (texto_limpio.includes('abrumado') || texto_limpio.includes('abrumada') || texto_limpio.includes('cansado') || texto_limpio.includes('cansada') || texto_limpio.includes('estrés') || texto_limpio.includes('presión') || texto_limpio.includes('agotado') || texto_limpio.includes('agotada')) {
        metrica_estres = 85;
        metrica_orgullo = 15;
        metrica_ansiedad = 60;
        metrica_entusiasmo = 20;
        emocion_dominante = 'Estrés Elevado y Fatiga';
        nivel_alerta = 'Atención Requerida (Naranja)';
        estilo_alerta = 'alerta-naranja';
        recomendaciones = 'Detectamos un nivel alto de sobrecarga. Te sugerimos conversar con tu líder sobre prioridades de entregas y tomar una sesión gratuita de Garnier Balance con nuestro especialista de bienestar en el canal corporativo.';
      } else if (texto_limpio.includes('orgullo') || texto_limpio.includes('orgullosa') || texto_limpio.includes('orgulloso') || texto_limpio.includes('éxito') || texto_limpio.includes('logro') || texto_limpio.includes('feliz') || texto_limpio.includes('excelente') || texto_limpio.includes('gracias')) {
        metrica_estres = 10;
        metrica_orgullo = 95;
        metrica_ansiedad = 15;
        metrica_entusiasmo = 90;
        emocion_dominante = 'Orgullo y Entusiasmo';
        nivel_alerta = 'Saludable y Óptimo (Verde)';
        estilo_alerta = 'alerta-verde';
        recomendaciones = '¡Excelente estado emocional! Te invitamos a compartir tus buenas prácticas en la reunión semanal de equipo y a nominar a un compañero para el reconocimiento Garnier de este mes.';
      } else if (texto_limpio.includes('ansiedad') || texto_limpio.includes('ansioso') || texto_limpio.includes('preocupado') || texto_limpio.includes('preocupada') || texto_limpio.includes('temo') || texto_limpio.includes('miedo') || texto_limpio.includes('duda')) {
        metrica_estres = 40;
        metrica_orgullo = 30;
        metrica_ansiedad = 80;
        metrica_entusiasmo = 35;
        emocion_dominante = 'Ansiedad por Incertidumbre';
        nivel_alerta = 'Precaución (Amarillo)';
        estilo_alerta = 'alerta-amarillo';
        recomendaciones = 'La incertidumbre puede generar tensión. Te aconsejamos asistir a la sesión de alineación semanal y revisar la documentación de procesos en la intranet corporativa.';
      }

      // Guardar el resultado en el estado
      establecer_resultado_analisis({
        texto_analizado: texto_emocional,
        emocion: emocion_dominante,
        alerta: nivel_alerta,
        clase_alerta: estilo_alerta,
        estres: metrica_estres,
        orgullo: metrica_orgullo,
        ansiedad: metrica_ansiedad,
        entusiasmo: metrica_entusiasmo,
        consejo: recomendaciones
      });

      establecer_ejecutando_analisis(false);
    }, 1500);
  };

  // manejar_click_limpiar: Restablece el formulario a su estado original
  const manejar_click_limpiar = () => {
    establecer_texto_emocional('');
    establecer_resultado_analisis(null);
  };

  return (
    <div className="modulo-contenedor">
      {/* Encabezado del Módulo */}
      <div className="modulo-encabezado">
        <h2 className="modulo-titulo">Check-in Emocional Diario</h2>
        <p className="modulo-subtitulo">Analizador de bienestar para detectar y brindar soporte preventivo frente al estrés y la ansiedad.</p>
      </div>

      <div className="modulo-grid-distribucion">
        {/* Panel Izquierdo: Entrada de Texto Emocional */}
        <div className="modulo-col-principal">
          <div className="caja-interaccion">
            <h3 className="caja-titulo">¿Cómo te has sentido hoy en tu jornada laboral?</h3>
            <p className="caja-instrucciones">Escribe brevemente tu sentir actual. Tu texto será analizado de manera confidencial para evaluar tu nivel de energía y bienestar.</p>

            <div className="caja-texto-contenedor">
              <textarea
                className="caja-texto-entrada"
                placeholder="Ej. Me he sentido motivado porque el proyecto avanza según lo planificado, aunque hay bastantes reuniones..."
                value={texto_emocional}
                onChange={manejar_cambio_texto}
                rows={4}
                disabled={ejecutando_analisis}
              />
              
              <div className="grupo-botones-acciones">
                <button
                  type="button"
                  className="boton-accion-secundario"
                  onClick={manejar_click_limpiar}
                  disabled={ejecutando_analisis || !texto_emocional}
                >
                  Limpiar Texto
                </button>
                <button
                  type="button"
                  className="boton-accion-principal"
                  onClick={manejar_click_analizar}
                  disabled={ejecutando_analisis || !texto_emocional.trim()}
                >
                  {ejecutando_analisis ? (
                    <span className="boton-cargando">Analizando Emociones...</span>
                  ) : (
                    <>
                      <span>Analizar Sentimiento</span>
                      <Heart className="icono-boton" size={16} />
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Ejemplos predefinidos para pruebas */}
            <div className="casos-prueba-contenedor">
              <span className="casos-prueba-etiqueta">Cargar textos de simulación para pruebas:</span>
              <div className="casos-prueba-lista">
                {ejemplos_predefinidos.map((ejemplo, index) => (
                  <button
                    key={index}
                    type="button"
                    className="boton-caso-prueba"
                    onClick={() => manejar_click_cargar_ejemplo(ejemplo.texto)}
                    disabled={ejecutando_analisis}
                  >
                    <CornerDownRight size={12} className="icono-caso" />
                    <span>{ejemplo.titulo}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Estado de carga de análisis */}
          {ejecutando_analisis && (
            <div className="tarjeta-cargando-animada">
              <div className="cargador-esferas">
                <span className="esfera"></span>
                <span className="esfera"></span>
                <span className="esfera"></span>
              </div>
              <p className="cargando-texto">Procesando marcadores semánticos y lingüísticos de bienestar...</p>
            </div>
          )}

          {/* Resultado del Análisis Emocional */}
          {resultado_analisis && !ejecutando_analisis && (
            <div className="tarjeta-resultado-emocional">
              <div className="resultado-emocional-encabezado">
                <div className="resultado-emocional-titulo-bloque">
                  <Sparkles size={18} className="icono-resultado-titulo" />
                  <h4>Resultado del Análisis Semántico</h4>
                </div>
                <span className={`indicador-alerta ${resultado_analisis.clase_alerta}`}>
                  <ShieldAlert size={14} className="icono-alerta" />
                  <span>{resultado_analisis.alerta}</span>
                </span>
              </div>

              {/* Indicadores en Barra de Progreso */}
              <div className="resultado-emocional-metricas">
                <div className="metrica-barra-item">
                  <div className="metrica-barra-info">
                    <span className="metrica-nombre">Nivel de Estrés</span>
                    <span className="metrica-valor">{resultado_analisis.estres}%</span>
                  </div>
                  <div className="barra-progreso-contenedor">
                    <div 
                      className="barra-progreso-llenado barra-color-rojo" 
                      style={{ width: `${resultado_analisis.estres}%` }}
                    />
                  </div>
                </div>

                <div className="metrica-barra-item">
                  <div className="metrica-barra-info">
                    <span className="metrica-nombre">Ansiedad Laboral</span>
                    <span className="metrica-valor">{resultado_analisis.ansiedad}%</span>
                  </div>
                  <div className="barra-progreso-contenedor">
                    <div 
                      className="barra-progreso-llenado barra-color-amarillo" 
                      style={{ width: `${resultado_analisis.ansiedad}%` }}
                    />
                  </div>
                </div>

                <div className="metrica-barra-item">
                  <div className="metrica-barra-info">
                    <span className="metrica-nombre">Orgullo y Pertenencia</span>
                    <span className="metrica-valor">{resultado_analisis.orgullo}%</span>
                  </div>
                  <div className="barra-progreso-contenedor">
                    <div 
                      className="barra-progreso-llenado barra-color-verde" 
                      style={{ width: `${resultado_analisis.orgullo}%` }}
                    />
                  </div>
                </div>

                <div className="metrica-barra-item">
                  <div className="metrica-barra-info">
                    <span className="metrica-nombre">Entusiasmo</span>
                    <span className="metrica-valor">{resultado_analisis.entusiasmo}%</span>
                  </div>
                  <div className="barra-progreso-contenedor">
                    <div 
                      className="barra-progreso-llenado barra-color-azul" 
                      style={{ width: `${resultado_analisis.entusiasmo}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Emoción Dominante y Consejos */}
              <div className="resultado-emocional-diagnostico">
                <div className="diagnostico-caja">
                  <span className="diagnostico-etiqueta">Diagnóstico del Sentimiento:</span>
                  <p className="diagnostico-valor">{resultado_analisis.emocion}</p>
                </div>
                <div className="diagnostico-caja-consejo">
                  <span className="diagnostico-etiqueta">Recomendación Garnier Balance:</span>
                  <p className="diagnostico-consejo-texto">{resultado_analisis.consejo}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Panel Derecho: Información Educativa */}
        <div className="modulo-col-secundaria">
          <div className="tarjeta-lateral-informacion">
            <div className="icono-contenedor-circular">
              <Smile className="icono-circular" size={24} />
            </div>
            <h3 className="lateral-titulo">Garnier Balance</h3>
            <p className="lateral-descripcion">
              Nuestro programa corporativo promueve el bienestar holístico. Monitorear las emociones permite que Garnier & Garnier diseñe mejores programas de pausas activas, flexibilidad y soporte psicológico profesional y anónimo.
            </p>
            <div className="puntos-clave-lista">
              <div className="punto-clave">
                <span className="punto-check">✓</span>
                <span className="punto-texto">Confidencialidad absoluta garantizada.</span>
              </div>
              <div className="punto-clave">
                <span className="punto-check">✓</span>
                <span className="punto-texto">Conexión con profesionales de salud mental.</span>
              </div>
              <div className="punto-clave">
                <span className="punto-check">✓</span>
                <span className="punto-texto">Herramientas de relajación Garnier Flex.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

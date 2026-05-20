/* ==========================================================================
   PÁGINA: SentimientoDiario
   Conecta: AppRouter.tsx (ruta "/sentimiento") → sentimientoServicio.ts
   ========================================================================== */

import { useState, useEffect } from 'react';
import { Heart, Sparkles, Smile, CornerDownRight } from 'lucide-react';
import BarraProgreso from '../components/ui/BarraProgreso';
import InsigniaAlerta from '../components/ui/InsigniaAlerta';
import CargandoAnimado from '../components/ui/CargandoAnimado';
import {
  obtener_ejemplos_sentimiento,
  obtener_reglas_sentimiento,
  analizar_texto_emocional,
  guardar_checkin_emocional,
} from '../services/sentimientoServicio';
import type { EjemploSentimiento, ReglaSentimiento, CheckinEmocional } from '../types';

export default function SentimientoDiario() {
  /* --- ESTADOS EN ESPAÑOL --- */
  const [texto_emocional, establecer_texto_emocional] = useState('');
  const [resultado_analisis, establecer_resultado_analisis] = useState<CheckinEmocional | null>(null);
  const [ejecutando_analisis, establecer_ejecutando_analisis] = useState(false);
  const [ejemplos, establecer_ejemplos] = useState<EjemploSentimiento[]>([]);
  const [reglas_sentimiento, establecer_reglas_sentimiento] = useState<ReglaSentimiento[]>([]);
  const [cargando_inicial, establecer_cargando_inicial] = useState(true);

  useEffect(() => {
    Promise.all([obtener_ejemplos_sentimiento(), obtener_reglas_sentimiento()])
      .then(([ejs, reglas]) => {
        establecer_ejemplos(ejs);
        establecer_reglas_sentimiento(reglas);
      })
      .finally(() => establecer_cargando_inicial(false));
  }, []);

  const manejar_cambio_texto = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    establecer_texto_emocional(e.target.value);

  const manejar_click_cargar_ejemplo = (texto: string) =>
    establecer_texto_emocional(texto);

  /* manejar_click_analizar: aplica reglas del servidor y persiste el check-in */
  const manejar_click_analizar = async () => {
    if (!texto_emocional.trim() || !reglas_sentimiento.length) return;
    establecer_ejecutando_analisis(true);
    establecer_resultado_analisis(null);
    await new Promise((r) => setTimeout(r, 1500));

    const regla = analizar_texto_emocional(texto_emocional, reglas_sentimiento);
    const checkin: Omit<CheckinEmocional, 'id'> = {
      texto_analizado: texto_emocional,
      emocion: regla.emocion,
      alerta: regla.alerta,
      clase_alerta: regla.clase_alerta,
      estres: regla.estres,
      orgullo: regla.orgullo,
      ansiedad: regla.ansiedad,
      entusiasmo: regla.entusiasmo,
      consejo: regla.consejo,
      fecha: new Date().toISOString(),
    };
    const guardado = await guardar_checkin_emocional(checkin);
    establecer_resultado_analisis(guardado);
    establecer_ejecutando_analisis(false);
  };

  const manejar_click_limpiar = () => {
    establecer_texto_emocional('');
    establecer_resultado_analisis(null);
  };

  if (cargando_inicial) return (
    <div className="modulo-contenedor">
      <CargandoAnimado mensaje="Cargando módulo de bienestar emocional..." />
    </div>
  );

  const metricas = resultado_analisis ? [
    { nombre: 'Nivel de Estrés', valor: resultado_analisis.estres, clase: 'barra-color-rojo' },
    { nombre: 'Ansiedad Laboral', valor: resultado_analisis.ansiedad, clase: 'barra-color-amarillo' },
    { nombre: 'Orgullo y Pertenencia', valor: resultado_analisis.orgullo, clase: 'barra-color-verde' },
    { nombre: 'Entusiasmo', valor: resultado_analisis.entusiasmo, clase: 'barra-color-azul' },
  ] : [];

  return (
    <div className="modulo-contenedor">
      <div className="modulo-encabezado">
        <h2 className="modulo-titulo">Check-in Emocional Diario</h2>
        <p className="modulo-subtitulo">
          Analizador de bienestar para detectar y brindar soporte preventivo frente al estrés y la ansiedad.
        </p>
      </div>

      <div className="modulo-grid-distribucion">
        <div className="modulo-col-principal">
          <div className="caja-interaccion">
            <h3 className="caja-titulo">¿Cómo te has sentido hoy en tu jornada laboral?</h3>
            <p className="caja-instrucciones">
              Escribe tu sentir actual. Tu texto será analizado de forma confidencial.
            </p>
            <div className="caja-texto-contenedor">
              <textarea
                className="caja-texto-entrada"
                placeholder="Ej. Me he sentido motivado porque el proyecto avanza bien..."
                value={texto_emocional}
                onChange={manejar_cambio_texto}
                rows={4}
                disabled={ejecutando_analisis}
              />
              <div className="grupo-botones-acciones">
                <button type="button" className="boton-accion-secundario"
                  onClick={manejar_click_limpiar}
                  disabled={ejecutando_analisis || !texto_emocional}>
                  Limpiar
                </button>
                <button type="button" className="boton-accion-principal"
                  onClick={manejar_click_analizar}
                  disabled={ejecutando_analisis || !texto_emocional.trim()}>
                  {ejecutando_analisis
                    ? <span className="boton-cargando">Analizando...</span>
                    : <><span>Analizar Sentimiento</span><Heart className="icono-boton" size={16} /></>}
                </button>
              </div>
            </div>

            {/* Casos de prueba desde json-server */}
            <div className="casos-prueba-contenedor">
              <span className="casos-prueba-etiqueta">Cargar textos de simulación:</span>
              <div className="casos-prueba-lista">
                {ejemplos.map((ej) => (
                  <button key={ej.id} type="button" className="boton-caso-prueba"
                    onClick={() => manejar_click_cargar_ejemplo(ej.texto)}
                    disabled={ejecutando_analisis}>
                    <CornerDownRight size={12} className="icono-caso" />
                    <span>{ej.titulo}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {ejecutando_analisis && <CargandoAnimado mensaje="Procesando marcadores semánticos de bienestar..." />}

          {resultado_analisis && !ejecutando_analisis && (
            <div className="tarjeta-resultado-emocional">
              <div className="resultado-emocional-encabezado">
                <div className="resultado-emocional-titulo-bloque">
                  <Sparkles size={18} className="icono-resultado-titulo" />
                  <h4>Resultado del Análisis Semántico</h4>
                </div>
                <InsigniaAlerta texto={resultado_analisis.alerta} clase={resultado_analisis.clase_alerta} />
              </div>

              <div className="resultado-emocional-metricas">
                {metricas.map(({ nombre, valor, clase }) => (
                  <div key={nombre} className="metrica-barra-item">
                    <div className="metrica-barra-info">
                      <span className="metrica-nombre">{nombre}</span>
                      <span className="metrica-valor">{valor}%</span>
                    </div>
                    <BarraProgreso valor={valor} clase_color={clase} />
                  </div>
                ))}
              </div>

              <div className="resultado-emocional-diagnostico">
                <div className="diagnostico-caja">
                  <span className="diagnostico-etiqueta">Diagnóstico:</span>
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

        <div className="modulo-col-secundaria">
          <div className="tarjeta-lateral-informacion">
            <div className="icono-contenedor-circular">
              <Smile className="icono-circular" size={24} />
            </div>
            <h3 className="lateral-titulo">Garnier Balance</h3>
            <p className="lateral-descripcion">
              Nuestro programa corporativo promueve el bienestar holístico mediante monitoreo
              emocional, pausas activas y soporte psicológico profesional.
            </p>
            <div className="puntos-clave-lista">
              {['Confidencialidad absoluta garantizada.', 'Conexión con profesionales de salud mental.', 'Herramientas de relajación Garnier Flex.'].map((p) => (
                <div key={p} className="punto-clave">
                  <span className="punto-check">✓</span>
                  <span className="punto-texto">{p}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   PÁGINA: ConsultasGenerales
   Conecta: AppRouter.tsx (ruta "/consultas") → consultasServicio.ts
   ========================================================================== */

import { useState, useEffect } from 'react';
import { Send, BookOpen, Clock, ShieldCheck } from 'lucide-react';
import CargandoAnimado from '../components/ui/CargandoAnimado';
import {
  obtener_politicas,
  obtener_preguntas_frecuentes,
  obtener_historial_consultas,
  buscar_politica_por_texto,
  guardar_consulta_historial,
} from '../services/consultasServicio';
import { consultarAgenteIA } from '../services/agenteServicio';
import type { Politica, PreguntaFrecuente, HistorialConsulta } from '../types';

export default function ConsultasGenerales() {
  /* --- ESTADOS EN ESPAÑOL --- */
  const [consulta_texto, establecer_consulta_texto] = useState('');
  const [respuesta_activa, establecer_respuesta_activa] = useState<{ texto: string, pregunta_origen: string } | null>(null);
  const [esta_buscando, establecer_esta_buscando] = useState(false);
  const [catalogo_politicas, establecer_catalogo_politicas] = useState<Politica[]>([]);
  const [preguntas_frecuentes, establecer_preguntas_frecuentes] = useState<PreguntaFrecuente[]>([]);
  const [historial_consultas, establecer_historial_consultas] = useState<HistorialConsulta[]>([]);
  const [cargando_inicial, establecer_cargando_inicial] = useState(true);
  const [error_servidor, establecer_error_servidor] = useState<string | null>(null);

  /* Carga datos iniciales desde json-server al montar */
  useEffect(() => {
    Promise.all([
      obtener_politicas(),
      obtener_preguntas_frecuentes(),
      obtener_historial_consultas(),
    ]).then(([politicas, preguntas, historial]) => {
      establecer_catalogo_politicas(politicas);
      establecer_preguntas_frecuentes(preguntas);
      establecer_historial_consultas(historial.slice(0, 5));
    }).catch((error) => {
      console.error("Error cargando base de datos:", error);
      establecer_error_servidor("No se pudo conectar a la base de datos (json-server). Verifica que el servidor de base de datos esté corriendo.");
    }).finally(() => establecer_cargando_inicial(false));
  }, []);

  /* manejar_cambio_entrada: Sincroniza la caja de texto con el estado */
  const manejar_cambio_entrada = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    establecer_consulta_texto(e.target.value);
  };

  /* manejar_click_enviar: Busca la política más relevante usando el Agente IA y persiste el historial */
  const manejar_click_enviar = async () => {
    if (!consulta_texto.trim()) return;
    if (!catalogo_politicas.length) {
      alert("No hay políticas cargadas. Por favor asegúrate de que json-server esté activo.");
      return;
    }
    establecer_esta_buscando(true);
    establecer_respuesta_activa(null);

    // Consulta al agente LLM real
    const respuesta_ia = await consultarAgenteIA(consulta_texto, catalogo_politicas);
    
    establecer_respuesta_activa({ texto: respuesta_ia, pregunta_origen: consulta_texto });

    /* Persistir en json-server */
    const nueva_entrada: Omit<HistorialConsulta, 'id'> = {
      pregunta: consulta_texto,
      respuesta: respuesta_ia.substring(0, 150) + (respuesta_ia.length > 150 ? '...' : ''), // guardamos un resumen o parte de la respuesta
      categoria: 'Agente IA',
      fecha: new Date().toISOString().split('T')[0],
    };
    const guardado = await guardar_consulta_historial(nueva_entrada);
    establecer_historial_consultas((prev) => [guardado, ...prev.slice(0, 4)]);
    establecer_consulta_texto('');
    establecer_esta_buscando(false);
  };

  /* manejar_click_pregunta_rapida: Autocompleta el input con una pregunta frecuente */
  const manejar_click_pregunta_rapida = (texto: string) => {
    establecer_consulta_texto(texto);
  };

  if (cargando_inicial) {
    return (
      <div className="modulo-contenedor">
        <CargandoAnimado mensaje="Cargando base de conocimiento de políticas Garnier..." />
      </div>
    );
  }

  return (
    <div className="modulo-contenedor">
      <div className="modulo-encabezado">
        <h2 className="modulo-titulo">Agente de Consultas 24/7</h2>
        <p className="modulo-subtitulo">
          Resuelve al instante tus dudas sobre vacaciones, teletrabajo y normativas internas.
        </p>
      </div>

      {error_servidor && (
        <div style={{ backgroundColor: '#fee2e2', color: '#991b1b', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', border: '1px solid #f87171' }}>
          <strong>⚠️ Atención:</strong> {error_servidor} <br/>
          Por favor, en tu terminal detén el proceso actual (Ctrl+C) y ejecuta <code>npm run start</code> para iniciar tanto la interfaz como la base de datos simultáneamente.
        </div>
      )}

      <div className="modulo-grid-distribucion">
        {/* Columna principal: entrada y resultado */}
        <div className="modulo-col-principal">
          <div className="caja-interaccion">
            <h3 className="caja-titulo">¿Qué deseas consultar hoy?</h3>
            <p className="caja-instrucciones">
              Escribe tu pregunta. El agente buscará en las políticas oficiales vigentes de Garnier.
            </p>
            <form className="caja-texto-contenedor" onSubmit={(e) => { e.preventDefault(); manejar_click_enviar(); }}>
              <textarea
                className="caja-texto-entrada"
                placeholder="Ej. ¿Cuáles son las reglas para hacer teletrabajo?"
                value={consulta_texto}
                onChange={manejar_cambio_entrada}
                rows={3}
                disabled={esta_buscando}
                style={{ resize: 'none' }}
              />
              <button
                type="submit"
                className="boton-accion-principal"
                disabled={esta_buscando || !consulta_texto.trim()}
              >
                {esta_buscando
                  ? <span className="boton-cargando">Procesando...</span>
                  : <><span>Consultar Agente</span><Send className="icono-boton" size={16} /></>}
              </button>
            </form>

            {/* Sugerencias rápidas desde json-server */}
            <div className="sugerencias-contenedor">
              <span className="sugerencias-etiqueta">Preguntas frecuentes:</span>
              <div className="sugerencias-lista">
                {preguntas_frecuentes.map((pf) => (
                  <button
                    key={pf.id}
                    type="button"
                    className="boton-sugerencia"
                    onClick={() => manejar_click_pregunta_rapida(pf.texto)}
                    disabled={esta_buscando}
                  >
                    {pf.texto}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Cargando resultado */}
          {esta_buscando && (
            <CargandoAnimado mensaje="Buscando en manuales y reglamentos de Garnier & Garnier..." />
          )}

          {/* Tarjeta de respuesta */}
          {respuesta_activa && !esta_buscando && (
            <div className="tarjeta-respuesta-ia">
              <div className="respuesta-ia-encabezado">
                <span className="insignia-verificacion">
                  <ShieldCheck size={14} className="icono-insignia" />
                  <span>Respuesta Oficial del Agente IA</span>
                </span>
                <div className="respuesta-ia-metadatos">
                  <span className="respuesta-ia-metadato">
                    <BookOpen size={12} />
                    <span>Políticas Indexadas</span>
                  </span>
                </div>
              </div>
              <div className="respuesta-ia-cuerpo">
                <p className="respuesta-ia-texto" style={{ whiteSpace: 'pre-wrap' }}>{respuesta_activa.texto}</p>
              </div>
              <div className="respuesta-ia-pie">
                <span className="pregunta-origen-etiqueta">Consulta realizada:</span>
                <span className="pregunta-origen-texto">"{respuesta_activa.pregunta_origen}"</span>
              </div>
            </div>
          )}
        </div>

        {/* Columna secundaria: historial */}
        <div className="modulo-col-secundaria">
          <div className="tarjeta-lateral-informacion">
            <h3 className="lateral-titulo">Historial de Consultas</h3>
            <p className="lateral-descripcion">Consultas recientes indexadas en el sistema.</p>
            <div className="historial-lista" style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {historial_consultas.length === 0 ? (
                <p style={{ color: '#aaa', fontSize: '13px', textAlign: 'center', padding: '20px 0' }}>No hay consultas previas.</p>
              ) : (
                historial_consultas.map((item) => (
                  <div 
                    key={item.id} 
                    className="historial-item"
                    onClick={() => {
                      establecer_consulta_texto(item.pregunta);
                      establecer_respuesta_activa({ texto: item.respuesta, pregunta_origen: item.pregunta });
                    }}
                    style={{ cursor: 'pointer', transition: 'all 0.2s ease-in-out' }}
                    title="Haz clic para cargar esta consulta"
                  >
                    <div className="historial-item-encabezado">
                      <span className="historial-categoria">{item.categoria}</span>
                      <span className="historial-tiempo">{item.fecha}</span>
                    </div>
                    <p className="historial-pregunta" style={{ fontWeight: '500', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                      {item.pregunta}
                    </p>
                    <p className="historial-respuesta" style={{ fontSize: '12px', color: '#666', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {item.respuesta}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

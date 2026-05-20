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
import type { Politica, PreguntaFrecuente, HistorialConsulta } from '../types';

export default function ConsultasGenerales() {
  /* --- ESTADOS EN ESPAÑOL --- */
  const [consulta_texto, establecer_consulta_texto] = useState('');
  const [respuesta_activa, establecer_respuesta_activa] = useState<(Politica & { pregunta_origen: string }) | null>(null);
  const [esta_buscando, establecer_esta_buscando] = useState(false);
  const [catalogo_politicas, establecer_catalogo_politicas] = useState<Politica[]>([]);
  const [preguntas_frecuentes, establecer_preguntas_frecuentes] = useState<PreguntaFrecuente[]>([]);
  const [historial_consultas, establecer_historial_consultas] = useState<HistorialConsulta[]>([]);
  const [cargando_inicial, establecer_cargando_inicial] = useState(true);

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
    }).finally(() => establecer_cargando_inicial(false));
  }, []);

  /* manejar_cambio_entrada: Sincroniza la caja de texto con el estado */
  const manejar_cambio_entrada = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    establecer_consulta_texto(e.target.value);
  };

  /* manejar_click_enviar: Busca la política más relevante y persiste el historial */
  const manejar_click_enviar = async () => {
    if (!consulta_texto.trim() || !catalogo_politicas.length) return;
    establecer_esta_buscando(true);
    establecer_respuesta_activa(null);

    /* Simular latencia de procesamiento de IA */
    await new Promise((res) => setTimeout(res, 1200));

    const politica = buscar_politica_por_texto(consulta_texto, catalogo_politicas);
    establecer_respuesta_activa({ ...politica, pregunta_origen: consulta_texto });

    /* Persistir en json-server */
    const nueva_entrada: Omit<HistorialConsulta, 'id'> = {
      pregunta: consulta_texto,
      respuesta: politica.contenido,
      categoria: politica.categoria.charAt(0).toUpperCase() + politica.categoria.slice(1),
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

      <div className="modulo-grid-distribucion">
        {/* Columna principal: entrada y resultado */}
        <div className="modulo-col-principal">
          <div className="caja-interaccion">
            <h3 className="caja-titulo">¿Qué deseas consultar hoy?</h3>
            <p className="caja-instrucciones">
              Escribe tu pregunta. El agente buscará en las políticas oficiales vigentes de Garnier.
            </p>
            <div className="caja-texto-contenedor">
              <textarea
                className="caja-texto-entrada"
                placeholder="Ej. ¿Cuáles son las reglas para hacer teletrabajo?"
                value={consulta_texto}
                onChange={manejar_cambio_entrada}
                rows={3}
                disabled={esta_buscando}
              />
              <button
                type="button"
                className="boton-accion-principal"
                onClick={manejar_click_enviar}
                disabled={esta_buscando || !consulta_texto.trim()}
              >
                {esta_buscando
                  ? <span className="boton-cargando">Procesando...</span>
                  : <><span>Consultar Agente</span><Send className="icono-boton" size={16} /></>}
              </button>
            </div>

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
                  <span>Respuesta Oficial Verificada</span>
                </span>
                <div className="respuesta-ia-metadatos">
                  <span className="respuesta-ia-metadato">
                    <BookOpen size={12} />
                    <span>{respuesta_activa.documento_referencia}</span>
                  </span>
                  <span className="respuesta-ia-metadato">
                    <Clock size={12} />
                    <span>{respuesta_activa.tiempo_lectura}</span>
                  </span>
                </div>
              </div>
              <div className="respuesta-ia-cuerpo">
                <h4 className="respuesta-ia-titulo">{respuesta_activa.titulo}</h4>
                <p className="respuesta-ia-texto">{respuesta_activa.contenido}</p>
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
            <div className="historial-lista">
              {historial_consultas.map((item) => (
                <div key={item.id} className="historial-item">
                  <div className="historial-item-encabezado">
                    <span className="historial-categoria">{item.categoria}</span>
                    <span className="historial-tiempo">{item.fecha}</span>
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

/* ==========================================================================
   PÁGINA: ClimaOrganizacional
   Conecta: AppRouter.tsx (ruta "/clima") → climaServicio.ts → /api/reportes_clima
   ========================================================================== */

import { useState, useEffect } from 'react';
import { EyeOff, AlertTriangle, CheckCircle, MessageSquarePlus, Award } from 'lucide-react';
import CargandoAnimado from '../components/ui/CargandoAnimado';
import {
  obtener_reportes_clima,
  enviar_reporte_clima,
  formatear_fecha_relativa,
} from '../services/climaServicio';
import type { ReporteClima, CategoriaClima } from '../types';

export default function ClimaOrganizacional() {
  /* --- ESTADOS EN ESPAÑOL --- */
  const [calificacion_ambiente, establecer_calificacion_ambiente] = useState(3);
  const [calificacion_herramientas, establecer_calificacion_herramientas] = useState(3);
  const [calificacion_liderazgo, establecer_calificacion_liderazgo] = useState(3);
  const [mensaje_anonimo, establecer_mensaje_anonimo] = useState('');
  const [categoria_mensaje, establecer_categoria_mensaje] = useState<CategoriaClima>('Sugerencia');
  const [procesando_envio, establecer_procesando_envio] = useState(false);
  const [envio_exitoso, establecer_envio_exitoso] = useState(false);
  const [buzon_historico, establecer_buzon_historico] = useState<ReporteClima[]>([]);
  const [cargando_inicial, establecer_cargando_inicial] = useState(true);

  /* Carga reportes existentes desde json-server */
  useEffect(() => {
    obtener_reportes_clima()
      .then(establecer_buzon_historico)
      .finally(() => establecer_cargando_inicial(false));
  }, []);

  /* manejar_click_enviar_buzon: Persiste el reporte anónimo en json-server via POST */
  const manejar_click_enviar_buzon = async () => {
    if (!mensaje_anonimo.trim()) return;
    establecer_procesando_envio(true);

    const nuevo_reporte: Omit<ReporteClima, 'id'> = {
      categoria: categoria_mensaje,
      fecha: new Date().toISOString().split('T')[0],
      calificacion_ambiente,
      calificacion_herramientas,
      calificacion_liderazgo,
      mensaje: mensaje_anonimo,
      estatus: 'Recibido de forma Anónima',
    };

    const guardado = await enviar_reporte_clima(nuevo_reporte);
    establecer_buzon_historico((prev) => [guardado, ...prev]);

    /* Resetear formulario */
    establecer_mensaje_anonimo('');
    establecer_calificacion_ambiente(3);
    establecer_calificacion_herramientas(3);
    establecer_calificacion_liderazgo(3);
    establecer_categoria_mensaje('Sugerencia');
    establecer_procesando_envio(false);
    establecer_envio_exitoso(true);
  };

  const manejar_click_nuevo_mensaje = () => establecer_envio_exitoso(false);

  if (cargando_inicial) return (
    <div className="modulo-contenedor">
      <CargandoAnimado mensaje="Cargando buzón de escucha organizacional..." />
    </div>
  );

  /* Componente de selector de estrellas reutilizable */
  const SelectorEstrellas = ({
    valor,
    al_cambiar,
    deshabilitado,
  }: { valor: number; al_cambiar: (v: number) => void; deshabilitado: boolean }) => (
    <div className="rating-estrellas">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          className={`boton-estrella${valor >= n ? ' activo' : ''}`}
          onClick={() => al_cambiar(n)}
          disabled={deshabilitado}
        >★</button>
      ))}
      <span className="rating-etiqueta-valor">({valor}/5)</span>
    </div>
  );

  const categorias: { valor: CategoriaClima; Icono: React.ElementType; }[] = [
    { valor: 'Sugerencia', Icono: MessageSquarePlus },
    { valor: 'Reconocimiento', Icono: Award },
    { valor: 'Alerta Crítica', Icono: AlertTriangle },
  ];

  return (
    <div className="modulo-contenedor">
      <div className="modulo-encabezado">
        <h2 className="modulo-titulo">Buzón de Escucha y Encuesta Pulse</h2>
        <p className="modulo-subtitulo">
          Comparte tu perspectiva de manera totalmente anónima para construir un entorno óptimo.
        </p>
      </div>

      <div className="modulo-grid-distribucion">
        <div className="modulo-col-principal">
          {!envio_exitoso ? (
            <div className="caja-interaccion">
              {/* Indicador de seguridad */}
              <div className="seguridad-encabezado">
                <EyeOff size={18} className="icono-seguridad" />
                <span className="seguridad-texto">
                  Conexión Cifrada • Tu identidad se mantendrá 100% privada
                </span>
              </div>

              {/* Encuesta Pulse — calificaciones por estrellas */}
              <div className="pulse-seccion-ratings">
                <h3 className="caja-titulo">Encuesta Pulse de esta Semana</h3>
                <p className="caja-instrucciones">
                  Califica los pilares clave (1: Muy insatisfecho — 5: Excelente):
                </p>
                <div className="pulse-ratings-grupo">
                  {[
                    { nombre: 'Ambiente y Oficina:', valor: calificacion_ambiente, setter: establecer_calificacion_ambiente },
                    { nombre: 'Herramientas y TI:', valor: calificacion_herramientas, setter: establecer_calificacion_herramientas },
                    { nombre: 'Liderazgo y Soporte:', valor: calificacion_liderazgo, setter: establecer_calificacion_liderazgo },
                  ].map(({ nombre, valor, setter }) => (
                    <div key={nombre} className="pulse-rating-item">
                      <span className="rating-nombre">{nombre}</span>
                      <SelectorEstrellas valor={valor} al_cambiar={setter} deshabilitado={procesando_envio} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Buzón de mensaje */}
              <div className="buzon-seccion-mensaje">
                <h3 className="caja-titulo">Buzón de Escucha Continua</h3>
                <p className="caja-instrucciones">Selecciona la categoría e ingresa tu comentario:</p>

                <div className="selector-categorias-buzon">
                  {categorias.map(({ valor, Icono }) => (
                    <button
                      key={valor}
                      type="button"
                      className={`boton-categoria-opcion${categoria_mensaje === valor ? ' seleccionado' : ''}`}
                      onClick={() => establecer_categoria_mensaje(valor)}
                      disabled={procesando_envio}
                    >
                      <Icono size={14} className="icono-categoria" />
                      <span>{valor}</span>
                    </button>
                  ))}
                </div>

                <div className="caja-texto-contenedor">
                  <textarea
                    className="caja-texto-entrada"
                    placeholder="Escribe tu mensaje con el mayor detalle posible..."
                    value={mensaje_anonimo}
                    onChange={(e) => establecer_mensaje_anonimo(e.target.value)}
                    rows={4}
                    disabled={procesando_envio}
                  />
                  <button
                    type="button"
                    className="boton-accion-principal"
                    onClick={manejar_click_enviar_buzon}
                    disabled={procesando_envio || !mensaje_anonimo.trim()}
                  >
                    {procesando_envio
                      ? <span className="boton-cargando">Cifrando y Enviando...</span>
                      : <><span>Enviar Comentarios de Clima</span><CheckCircle className="icono-boton" size={16} /></>}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Pantalla de confirmación de envío */
            <div className="tarjeta-exito-envio">
              <div className="exito-icono-contenedor">
                <CheckCircle className="icono-exito" size={48} />
              </div>
              <h3 className="exito-titulo">¡Comentarios Enviados Exitosamente!</h3>
              <p className="exito-descripcion">
                Tu reporte ha sido persistido de forma anónima en el sistema de Talento Humano.
                Ningún dato de origen, IP ni sesión ha sido almacenado.
              </p>
              <button type="button" className="boton-accion-principal"
                onClick={manejar_click_nuevo_mensaje}>
                Enviar Otro Mensaje
              </button>
            </div>
          )}
        </div>

        {/* Panel de seguimiento — datos reales desde json-server */}
        <div className="modulo-col-secundaria">
          <div className="tarjeta-lateral-informacion">
            <h3 className="lateral-titulo">Seguimiento de Envíos</h3>
            <p className="lateral-descripcion">
              Reportes anónimos registrados y su estado de procesamiento.
            </p>
            <div className="historial-lista">
              {buzon_historico.map((item) => (
                <div key={item.id} className="historial-item">
                  <div className="historial-item-encabezado">
                    <span className={`historial-categoria badge-${item.categoria.toLowerCase().replace(' ', '-').replace('í', 'i')}`}>
                      {item.categoria}
                    </span>
                    <span className="historial-tiempo">
                      {formatear_fecha_relativa(item.fecha)}
                    </span>
                  </div>
                  <p className="historial-mensaje-clima">"{item.mensaje}"</p>
                  <div className="ratings-pequenos-visualizador">
                    <span className="rating-miniatura">Amb: {item.calificacion_ambiente}</span>
                    <span className="rating-miniatura">TI: {item.calificacion_herramientas}</span>
                    <span className="rating-miniatura">Líder: {item.calificacion_liderazgo}</span>
                  </div>
                  <div className="item-estatus-tracker">
                    <span className="estatus-punto" />
                    <span className="estatus-texto">
                      Estatus: <strong>{item.estatus}</strong>
                    </span>
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

/* ==========================================================================
   PÁGINA: GestionDesempeno
   Conecta: AppRouter.tsx (ruta "/desempeno") → desempenoServicio.ts
   ========================================================================== */

import { useState } from 'react';
import { UserCheck, Award, Copy, Check } from 'lucide-react';
import BarraProgreso from '../components/ui/BarraProgreso';
import CargandoAnimado from '../components/ui/CargandoAnimado';
import {
  obtener_colaborador_por_id,
  obtener_okrs_por_colaborador,
  obtener_guia_reunion,
  obtener_color_progreso,
} from '../services/desempenoServicio';
import type { Colaborador, OKR, GuiaReunion, TipoReunion } from '../types';

const TIPOS_REUNION: TipoReunion[] = ['Revision Mensual', 'Revision de OKRs', 'Plan de Desarrollo'];

export default function GestionDesempeno() {
  /* --- ESTADOS EN ESPAÑOL --- */
  const [id_colaborador, establecer_id_colaborador] = useState('');
  const [enfoque_reunion, establecer_enfoque_reunion] = useState<TipoReunion>('Revision de OKRs');
  const [colaborador_activo, establecer_colaborador_activo] = useState<Colaborador | null>(null);
  const [okrs_activos, establecer_okrs_activos] = useState<OKR[]>([]);
  const [guia_activa, establecer_guia_activa] = useState<GuiaReunion | null>(null);
  const [buscando_colaborador, establecer_buscando_colaborador] = useState(false);
  const [error_busqueda, establecer_error_busqueda] = useState('');
  const [copiado_exitoso, establecer_copiado_exitoso] = useState(false);

  /* manejar_click_buscar: Consulta json-server con el ID ingresado y carga OKRs + guía */
  const manejar_click_buscar = async () => {
    const id_limpio = id_colaborador.trim().toUpperCase();
    if (!id_limpio) { establecer_error_busqueda('Ingresa un código de colaborador.'); return; }

    establecer_buscando_colaborador(true);
    establecer_colaborador_activo(null);
    establecer_okrs_activos([]);
    establecer_guia_activa(null);
    establecer_error_busqueda('');

    const colaborador = await obtener_colaborador_por_id(id_limpio);
    if (!colaborador) {
      establecer_error_busqueda('Código no encontrado. Prueba con G-1024, G-1085 o G-1120.');
      establecer_buscando_colaborador(false);
      return;
    }

    const [okrs, guia] = await Promise.all([
      obtener_okrs_por_colaborador(id_limpio),
      obtener_guia_reunion(id_limpio, enfoque_reunion),
    ]);

    establecer_colaborador_activo(colaborador);
    establecer_okrs_activos(okrs);
    establecer_guia_activa(guia);
    establecer_buscando_colaborador(false);
  };

  /* manejar_click_cambiar_enfoque: Recarga la guía cuando el usuario cambia el tipo de reunión */
  const manejar_click_cambiar_enfoque = async (tipo: TipoReunion) => {
    establecer_enfoque_reunion(tipo);
    if (!colaborador_activo) return;
    const guia = await obtener_guia_reunion(colaborador_activo.id, tipo);
    establecer_guia_activa(guia);
  };

  /* manejar_click_copiar: Copia la pauta sugerida al portapapeles */
  const manejar_click_copiar = () => {
    if (!colaborador_activo || !guia_activa) return;
    const texto = `PAUTA DE FEEDBACK — ${colaborador_activo.nombre} (${enfoque_reunion})
1. Rompehielos: "${guia_activa.rompehielos}"
2. Puntos clave: ${guia_activa.puntos_clave}
3. Acciones: ${guia_activa.acciones}`;
    navigator.clipboard.writeText(texto).then(() => {
      establecer_copiado_exitoso(true);
      setTimeout(() => establecer_copiado_exitoso(false), 2000);
    });
  };

  /* Obtiene las iniciales del nombre para el avatar */
  const obtener_iniciales = (nombre: string) =>
    nombre.split(' ').slice(0, 2).map((n) => n[0]).join('');

  return (
    <div className="modulo-contenedor">
      <div className="modulo-encabezado">
        <h2 className="modulo-titulo">Copiloto de Desempeño y OKRs</h2>
        <p className="modulo-subtitulo">
          Asistente inteligente para estructurar reuniones de feedback 1:1 eficientes y alineadas.
        </p>
      </div>

      {/* Buscador de colaborador */}
      <div className="buscador-colaborador-caja">
        <div className="buscador-campos">
          <div className="buscador-input-grupo">
            <span className="buscador-prefijo">ID:</span>
            <input
              type="text"
              className="buscador-campo-texto"
              placeholder="Ej: G-1024, G-1085, G-1120"
              value={id_colaborador}
              onChange={(e) => { establecer_id_colaborador(e.target.value); establecer_error_busqueda(''); }}
              disabled={buscando_colaborador}
            />
          </div>
          <button type="button" className="boton-accion-principal"
            onClick={manejar_click_buscar} disabled={buscando_colaborador}>
            {buscando_colaborador ? 'Cargando...' : 'Generar Pauta'}
          </button>
        </div>
        {error_busqueda && <p className="buscador-error-mensaje">{error_busqueda}</p>}
        <p className="buscador-ayuda-texto">
          Códigos de prueba: <strong>G-1024</strong> (Ana), <strong>G-1085</strong> (Carlos), <strong>G-1120</strong> (Mariela)
        </p>
      </div>

      {buscando_colaborador && (
        <CargandoAnimado mensaje="Consultando expediente de desempeño y OKRs en Garnier Cloud..." />
      )}

      {/* Panel principal del colaborador */}
      {colaborador_activo && !buscando_colaborador && (
        <div className="modulo-grid-distribucion">
          {/* Ficha y OKRs */}
          <div className="modulo-col-principal">
            <div className="caja-interaccion">
              <div className="ficha-personal-encabezado">
                <div className="ficha-personal-iniciales">
                  {obtener_iniciales(colaborador_activo.nombre)}
                </div>
                <div className="ficha-personal-detalles">
                  <h3 className="ficha-personal-nombre">{colaborador_activo.nombre}</h3>
                  <p className="ficha-personal-puesto">
                    {colaborador_activo.puesto} •{' '}
                    <span className="ficha-personal-depto">{colaborador_activo.departamento}</span>
                  </p>
                  <div className="ficha-personal-tags">
                    <span className="ficha-tag">Antigüedad: {colaborador_activo.antiguedad}</span>
                    <span className="ficha-tag">
                      Evaluación: {colaborador_activo.descripcion_desempeno} ({colaborador_activo.puntaje_desempeno}/100)
                    </span>
                  </div>
                </div>
              </div>

              {/* OKRs desde json-server */}
              <div className="gestion-okr-seccion">
                <h4 className="seccion-subtitulo-interno">Objetivos y Resultados Clave (OKRs) — Q2</h4>
                <div className="okr-lista">
                  {okrs_activos.map((okr) => (
                    <div key={okr.id} className="okr-tarjeta-item">
                      <div className="okr-tarjeta-info">
                        <p className="okr-meta-texto">{okr.meta}</p>
                        <span className={`okr-estado-insignia estado-${okr.estado.toLowerCase().replace(/ /g, '-')}`}>
                          {okr.estado}
                        </span>
                      </div>
                      <div className="okr-progreso-bloque">
                        <BarraProgreso valor={okr.progreso} clase_color={obtener_color_progreso(okr.progreso)} />
                        <span className="okr-porcentaje-texto">{okr.progreso}% completado</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Guía del copiloto — guia_activa desde json-server */}
          <div className="modulo-col-secundaria">
            <div className="tarjeta-guia-copiloto">
              <div className="guia-copiloto-encabezado">
                <div className="guia-copiloto-titulo-caja">
                  <Award className="icono-guia-titulo" size={18} />
                  <h4>Pauta Sugerida 1:1</h4>
                </div>
                <button type="button"
                  className={`boton-icono-accion${copiado_exitoso ? ' copiado' : ''}`}
                  onClick={manejar_click_copiar} title="Copiar guía">
                  {copiado_exitoso ? <Check size={16} /> : <Copy size={16} />}
                </button>
              </div>

              {/* Selector de tipo de reunión */}
              <div className="guia-tabs-selector">
                {TIPOS_REUNION.map((tipo) => (
                  <button key={tipo} type="button"
                    className={`boton-tab-enfoque${enfoque_reunion === tipo ? ' activo' : ''}`}
                    onClick={() => manejar_click_cambiar_enfoque(tipo)}>
                    {tipo}
                  </button>
                ))}
              </div>

              {guia_activa ? (
                <div className="guia-cuerpo-contenido">
                  {[
                    { num: '1', etiqueta: 'Pregunta Rompehielos sugerida:', texto: `"${guia_activa.rompehielos}"` },
                    { num: '2', etiqueta: 'Puntos clave para el diálogo:', texto: guia_activa.puntos_clave },
                    { num: '3', etiqueta: 'Plan de acción e hitos propuestos:', texto: guia_activa.acciones },
                  ].map(({ num, etiqueta, texto }) => (
                    <div key={num} className="guia-cuerpo-seccion">
                      <div className="guia-seccion-numero">{num}</div>
                      <div className="guia-seccion-textos">
                        <span className="guia-seccion-etiqueta">{etiqueta}</span>
                        <p className="guia-seccion-descripcion">{texto}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="caja-instrucciones">No hay guía disponible para este tipo de reunión.</p>
              )}

              <div className="guia-comentarios-historicos">
                <span className="guia-comentarios-etiqueta">Nota del Historial del Líder:</span>
                <p className="guia-comentarios-contenido">{colaborador_activo.comentarios_liderazgo}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Estado vacío inicial */}
      {!colaborador_activo && !buscando_colaborador && (
        <div className="tarjeta-guia-vacia">
          <div className="guia-vacia-icono-contenedor">
            <UserCheck className="icono-guia-vacío" size={40} />
          </div>
          <h3 className="guia-vacia-titulo">Consulta un expediente de colaborador</h3>
          <p className="guia-vacia-descripcion">
            Digita el código del colaborador en el buscador para cargar sus OKRs activos y
            compilar una agenda de conversación personalizada para tu próxima reunión 1:1.
          </p>
        </div>
      )}
    </div>
  );
}

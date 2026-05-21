/* ==========================================================================
   TIPOS GLOBALES DE LA PLATAFORMA GARNIER TALENTO IA
   Conecta: todos los servicios, páginas y componentes
   ========================================================================== */

/* --- Módulo Dashboard --- */
export interface KPI {
  id: number;
  titulo: string;
  valor: string;
  detalle: string;
  icono: string;
  clase: string;
}

/* --- Módulo Consultas Generales --- */
export interface Politica {
  id: number;
  categoria: string;
  titulo: string;
  contenido: string;
  palabras_clave: string[];
  documento_referencia: string;
  tiempo_lectura: string;
}

export interface PreguntaFrecuente {
  id: number;
  texto: string;
  categoria: string;
}

export interface HistorialConsulta {
  id: number;
  pregunta: string;
  respuesta: string;
  categoria: string;
  fecha: string;
}

export interface RespuestaConsulta extends Politica {
  pregunta_origen: string;
}

/* --- Respuesta Estructurada del Agente IA (formato JSON) --- */
export interface DatosRRHH {
  accion_requerida: string;
  prioridad: 'alta' | 'media' | 'baja';
  analisis_detalle: string;
}

export interface RespuestaAgente {
  estado_proceso: 'exitoso' | 'error';
  mensaje_usuario: string;
  datos_rrhh: DatosRRHH;
}

/* --- Módulo Sentimiento Diario --- */
export interface EjemploSentimiento {
  id: number;
  titulo: string;
  texto: string;
  categoria: string;
}

export interface ReglaSentimiento {
  id: number;
  palabras_clave: string[];
  emocion: string;
  alerta: string;
  clase_alerta: string;
  estres: number;
  orgullo: number;
  ansiedad: number;
  entusiasmo: number;
  consejo: string;
}

export interface CheckinEmocional {
  id?: number;
  texto_analizado: string;
  emocion: string;
  alerta: string;
  clase_alerta: string;
  estres: number;
  orgullo: number;
  ansiedad: number;
  entusiasmo: number;
  consejo: string;
  fecha: string;
}

/* --- Módulo Clima Organizacional --- */
export type CategoriaClima = 'Sugerencia' | 'Reconocimiento' | 'Alerta Crítica';

export interface ReporteClima {
  id?: number;
  categoria: CategoriaClima;
  fecha: string;
  calificacion_ambiente: number;
  calificacion_herramientas: number;
  calificacion_liderazgo: number;
  mensaje: string;
  estatus: string;
}

/* --- Módulo Gestión Desempeño --- */
export interface Colaborador {
  id: string;
  nombre: string;
  puesto: string;
  departamento: string;
  antiguedad: string;
  puntaje_desempeno: number;
  descripcion_desempeno: string;
  comentarios_liderazgo: string;
}

export interface OKR {
  id: number;
  colaborador_id: string;
  meta: string;
  progreso: number;
  estado: string;
}

export type TipoReunion = 'Revision Mensual' | 'Revision de OKRs' | 'Plan de Desarrollo';

export interface GuiaReunion {
  id: number;
  colaborador_id: string;
  tipo: TipoReunion;
  rompehielos: string;
  puntos_clave: string;
  acciones: string;
}

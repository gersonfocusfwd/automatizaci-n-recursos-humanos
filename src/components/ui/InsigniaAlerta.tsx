/* ==========================================================================
   COMPONENTE UI: InsigniaAlerta
   Conecta: SentimientoDiario.tsx — muestra el nivel de alerta emocional
   ========================================================================== */

import { ShieldAlert } from 'lucide-react';

interface PropsInsigniaAlerta {
  texto: string;
  clase: string; /* alerta-verde | alerta-amarillo | alerta-naranja */
}

export default function InsigniaAlerta({ texto, clase }: PropsInsigniaAlerta) {
  return (
    <span className={`indicador-alerta ${clase}`}>
      <ShieldAlert size={14} className="icono-alerta" />
      <span>{texto}</span>
    </span>
  );
}

/* ==========================================================================
   COMPONENTE UI: BarraProgreso
   Conecta: SentimientoDiario.tsx, GestionDesempeno.tsx
   ========================================================================== */

interface PropsBarraProgreso {
  valor: number;       /* Porcentaje de llenado (0-100) */
  clase_color: string; /* Clase CSS que define el color: barra-color-verde, azul, etc. */
  altura?: string;     /* Altura personalizable, default "8px" */
}

export default function BarraProgreso({ valor, clase_color, altura = '8px' }: PropsBarraProgreso) {
  /* Limitamos el valor entre 0 y 100 para seguridad de renderizado */
  const valor_seguro = Math.min(100, Math.max(0, valor));
  return (
    <div className="barra-progreso-contenedor" style={{ height: altura }}>
      <div
        className={`barra-progreso-llenado ${clase_color}`}
        style={{ width: `${valor_seguro}%` }}
      />
    </div>
  );
}

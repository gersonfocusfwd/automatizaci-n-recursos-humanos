/* ==========================================================================
   COMPONENTE UI: CargandoAnimado
   Conecta: todas las páginas que realizan fetch de datos
   ========================================================================== */

interface PropsCargandoAnimado {
  mensaje?: string;
}

export default function CargandoAnimado({ mensaje = 'Cargando datos...' }: PropsCargandoAnimado) {
  return (
    <div className="tarjeta-cargando-animada">
      <div className="cargador-esferas">
        <span className="esfera" />
        <span className="esfera" />
        <span className="esfera" />
      </div>
      <p className="cargando-texto">{mensaje}</p>
    </div>
  );
}

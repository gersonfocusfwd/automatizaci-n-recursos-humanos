/* ==========================================================================
   COMPONENTE LAYOUT: Footer
   Conecta: App.tsx — pie de página corporativo
   ========================================================================== */

export default function Footer() {
  const anio_actual = new Date().getFullYear();
  return (
    <footer className="footer-copyright-seccion">
      <p className="footer-texto">
        © {anio_actual} Garnier & Garnier Desarrollos Inmobiliarios. Todos los derechos reservados.
        Diseñado bajo estándares de Liderazgo Tecnológico en Capital Humano.
      </p>
    </footer>
  );
}

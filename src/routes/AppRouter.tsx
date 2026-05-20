/* ==========================================================================
   ROUTER: AppRouter
   Conecta: App.tsx — define todas las rutas de la plataforma con React Router
   ========================================================================== */

import { Routes, Route } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import ConsultasGenerales from '../pages/ConsultasGenerales';
import SentimientoDiario from '../pages/SentimientoDiario';
import ClimaOrganizacional from '../pages/ClimaOrganizacional';
import GestionDesempeno from '../pages/GestionDesempeno';

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/consultas" element={<ConsultasGenerales />} />
      <Route path="/sentimiento" element={<SentimientoDiario />} />
      <Route path="/clima" element={<ClimaOrganizacional />} />
      <Route path="/desempeno" element={<GestionDesempeno />} />
      {/* Ruta comodín: redirige rutas no encontradas al Dashboard */}
      <Route path="*" element={<Dashboard />} />
    </Routes>
  );
}

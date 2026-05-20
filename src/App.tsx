/* ==========================================================================
   COMPONENTE RAÍZ: App
   Conecta: main.tsx → BrowserRouter → Sidebar + Header + AppRouter + Footer
   ========================================================================== */

import { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import AppRouter from './routes/AppRouter';

export default function App() {
  /* sidebar_abierto: Controla la visibilidad del menú lateral en dispositivos móviles */
  const [sidebar_abierto, establecer_sidebar_abierto] = useState(false);

  const manejar_click_abrir_sidebar = () => establecer_sidebar_abierto(true);
  const manejar_click_cerrar_sidebar = () => establecer_sidebar_abierto(false);

  return (
    <BrowserRouter>
      <div className="app-layout-principal">
        {/* Sidebar con navegación React Router */}
        <Sidebar esta_abierto={sidebar_abierto} al_cerrar={manejar_click_cerrar_sidebar} />

        {/* Overlay oscuro al abrir sidebar en móvil */}
        {sidebar_abierto && (
          <div className="overlay-sidebar-movil" onClick={manejar_click_cerrar_sidebar} />
        )}

        {/* Área de contenido principal */}
        <main className="area-principal-contenido">
          <Header al_abrir_sidebar={manejar_click_abrir_sidebar} />

          <div className="contenedor-vista-dinamica">
            {/* AppRouter inyecta la página correcta según la URL activa */}
            <AppRouter />
          </div>

          <Footer />
        </main>
      </div>
    </BrowserRouter>
  );
}

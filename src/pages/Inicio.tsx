import { useAuth } from "../context/useAuth";
import CalendarioCitas from "../components/CalendarioCitas";
import SolicitudesRecientes from "../components/SolicitudesRecientes";
import VistaClientesInicio from "../components/VistaClientesInicio";

export default function Inicio() {

  const { empresa } = useAuth();

  return (
    <div >

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        { /* Columna 1: Solicitudes */}
        <SolicitudesRecientes />
        {/* Columna 2: Panel casa o visual */}
        <section className="bg-accent rounded-lg shadow flex flex-col items-center justify-center p-8">
          <img
            key={empresa?.logo_url || 'fallback'}
            src={empresa?.logo_url || "https://cdn-icons-png.flaticon.com/512/69/69524.png"}
            alt={empresa?.nombre || "Logo de la empresa"}
            className="h-24 mb-4 object-contain"
          />
          <h3 className="text-xl font-semibold text-primary">
            {empresa?.nombre || "Bienvenido"}
          </h3>
        </section>
      </section>

      {/* Sección de Clientes */}
      <section className="bg-white rounded-xl shadow-md p-6 mb-8 mt-8">
        <VistaClientesInicio />
      </section>

      {/* Sección de Calendario */}
      <section className="bg-white rounded-xl shadow-md p-6 mb-8 mt-8">
        <CalendarioCitas />
      </section>
    </div>
  );
}

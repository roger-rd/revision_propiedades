import { Outlet, Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { useIdleTimer } from "../hooks/useIdleTimer";
import ModalAutoCerrar from "../mod/ModalAutoCerrar";


export default function MainLayout() {
  const { empresa, logout } = useAuth();
  const navigate = useNavigate();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [modalActivo, setModalActivo] = useState<boolean>(false)

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const CINCO_MINUTOS = 100 * 60 * 100;

  const DIEZ_SEGUNDOS = 100 * 1000;

  useIdleTimer(CINCO_MINUTOS, () => {
    setModalActivo(true);

    // Guardamos el ID del timeout en la ref para poder cancelarlo después
    timeoutRef.current = setTimeout(() => {
      logout();
    }, DIEZ_SEGUNDOS);
  });

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Menú lateral (sidebar) */}
      <aside
        className={`
          fixed md:static top-0 left-0 z-40 w-64 h-full bg-primary text-white p-4
          transform transition-transform duration-300
          ${menuAbierto ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        <div className="flex items-center justify-between md:block">
          <h1 className="text-xl font-bold mb-6">{empresa?.nombre || "Empresa"}</h1>
          <button onClick={() => setMenuAbierto(false)} className="md:hidden">
            <X size={24} />
          </button>
        </div>

        <nav className="flex flex-col gap-4">
          <Link to="/" className="hover:text-teal-300">Inicio</Link>
          <Link to="/clientes" className="hover:text-teal-300">Clientes</Link>
          <Link to="/solicitudes" className="hover:text-teal-300">Solicitudes</Link>
          <Link to="/configuracion" className="hover:text-teal-300">Configuración</Link>

          <Link to="/informes" className="hover:text-teal-300">Informes</Link>

          <button onClick={handleLogout} className="text-left hover:text-teal-300 pl-16">Cerrar sesión</button>
        </nav>
      </aside>

      {/* Contenido principal */}
      <div className="flex-1 overflow-auto bg-gray-100">
        {/* Barra superior en móviles */}
        <header className="md:hidden flex items-center justify-between bg-white px-4 py-3 shadow">
          <button onClick={() => setMenuAbierto(true)}>
            <Menu size={24} />
          </button>
          <h2 className="text-lg font-semibold">{empresa?.nombre || "RDRP"}</h2>
        </header>

        <main className="p-4 md:p-6">
          <Outlet />
        </main>
      </div>
      <ModalAutoCerrar
        visible={modalActivo}
        onClose={() => {
          setModalActivo(false);
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current); // ✅ Cancela el logout
            timeoutRef.current = null;
          }
        }}
        onConfirm={() => {
          setModalActivo(false);
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current); // ✅ Cancela el logout
            timeoutRef.current = null;
          }
        }}
      />
    </div>

  );
}

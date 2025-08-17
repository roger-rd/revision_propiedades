import { Link } from "react-router-dom";


export function SesionCerrada() {
  return (
    <div className="min-h-screen bg-accent flex flex-col justify-center items-center text-center px-4">
      <img
        src="/public/img/RDRP-logo/logo-transparent.png"
        alt="Logo RDRP"
        className="h-20 mb-6"
      />
      <h1 className="text-3xl font-bold text-secondary mb-4">Sesión cerrada</h1>
      <p className="text-gray-700 mb-6">
        Tu sesión fue cerrada automáticamente por inactividad. Esto ayuda a mantener la seguridad del sistema.
      </p>
      <Link
        to="/login"
        className="px-6 py-2 bg-primary text-white rounded-md hover:bg-secondary transition duration-300"
      >
        Volver a iniciar sesión
      </Link>
    </div>
  )
}
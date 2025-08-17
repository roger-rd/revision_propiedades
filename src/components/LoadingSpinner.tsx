export default function LoadingSpinner({ mensaje = "Cargando..." }) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-3"></div>
        <p className="text-sm text-gray-600">{mensaje}</p>
      </div>
    );
  }
  
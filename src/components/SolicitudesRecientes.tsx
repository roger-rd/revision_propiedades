import { useEffect, useState } from "react";
import { useAuth } from "../context/useAuth";
import { Solicitud } from "../interface/solicitudesInterface";
import api from "../services/api";

export default function SolicitudesRecientes() {
  const { empresa } = useAuth();
  
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);

  useEffect(() => {
    if (!empresa) return;
    api.get(`/solicitudes/recientes/${empresa.id}`)
      .then((res) => {
        const recientes = res.data.data.slice(0, 3); // solo las 3  más recientes
        setSolicitudes(recientes);
      })
      .catch((err) => console.error("Error al cargar solicitudes", err));
  }, [empresa]);

  return (
    <div className="bg-white rounded-lg shadow p-4 w-full max-w-xl">
      <h2 className="text-lg font-semibold mb-4 text-primary">Solicitudes Recientes</h2>

      {/* Cabecera visible solo en pantallas grandes */}
      <div className="hidden lg:grid grid-cols-3 gap-4 text-sm font-semibold text-gray-600 mb-2">
        <span>Cliente</span>
        <span>Dirección</span>
        <span>Estado</span>
      </div>

      <div className="space-y-4">
        {solicitudes.map((s) => (
          <div
            key={s.id}
            className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-sm text-gray-800 border-b pb-4 last:border-none"
          >
            {/* Cliente */}
            <div className="flex flex-col lg:block">
              <span className="text-gray-500 font-semibold lg:hidden">Cliente</span>
              <span>{s.cliente?.nombre || "-"}</span>
            </div>

            {/* Dirección */}
            <div className="flex flex-col lg:block">
              <span className="text-gray-500 font-semibold lg:hidden">Dirección</span>
              <span>{s.direccion}</span>
            </div>

            {/* Estado */}
            <div className="flex flex-col lg:block">
              <span className="text-gray-500 font-semibold lg:hidden">Estado</span>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium w-fit mx-auto
                  ${
                    s.estado === "realizado"
                      ? "bg-green-100 text-green-800"
                      : s.estado === "pendiente"
                      ? "bg-yellow-100 text-yellow-800"
                      : s.estado === "persiste"
                      ? "bg-red-100 text-red-800"
                      : "bg-gray-200 text-gray-700"
                  }`}
              >
                {s.estado || "-"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

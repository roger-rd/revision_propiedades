import { useEffect, useState } from 'react';
import api from '../services/api';
import { Solicitud } from '../interface/informesInterface';
import { useAuth } from '../context/useAuth';


export default function Informes() {
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const { empresa } = useAuth();
  const empresaId = empresa?.id;

  useEffect(() => {
    if (!empresaId) return;

    api.get(`/solicitudes/empresa/${empresaId}`)
      .then(res => {
        setSolicitudes(res.data);
      })
      .catch(err => console.error('Error cargando solicitudes', err));
  }, [empresaId]);

  const generarInforme = (id: number) => {
    window.open(`http://localhost:3001/api/informes/${id}/generar`, '_blank');
  };

  const generarInformeGold = (id: number) => {
  window.open(`http://localhost:3001/api/informes/${id}/generar?template=gold`, '_blank');
};

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📄 Informes disponibles</h1>

      <table className="min-w-full bg-white border">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 border">Cliente</th>
            <th className="py-2 px-4 border">RUT</th>
            <th className="py-2 px-4 border">Dirección</th>
            <th className="py-2 px-4 border">Estado</th>
            <th className="py-2 px-4 border">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {solicitudes.map((s) => (
            <tr key={s.id}>
              <td className="py-2 px-4 border">{s.cliente.nombre}</td>
              <td className="py-2 px-4 border">{s.cliente.rut}</td>
              <td className="py-2 px-4 border">{s.direccion}</td>
              <td className="py-2 px-4 border">
                <span className="bg-gray-200 rounded px-2 py-1 text-sm">{s.estado}</span>
              </td>
              <td className="py-2 px-4 border space-x-2">
                <button
                  className="bg-blue-600 text-white px-3 py-1 mb-2 text-center rounded hover:bg-blue-700 text-sm"
                  onClick={() => generarInforme(s.id)}
                >
                  Informe clásico
                </button>

                <button
                  className="bg-emerald-600 text-white px-3 py-1 rounded hover:bg-emerald-700 text-sm"
                  onClick={() => generarInformeGold(s.id)}
                  title="Plantilla tipo GOLD"
                >
                  Informe GOLD
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

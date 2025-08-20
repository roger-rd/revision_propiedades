import { useEffect, useState } from 'react';
import api from '../services/api';
import { Solicitud } from '../interface/informesInterface';
import { useAuth } from '../context/useAuth';

export default function Informes() {
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { empresa } = useAuth();
  const empresaId = empresa?.id;

  const getBase = () => (api.defaults.baseURL ?? '').replace(/\/+$/, '');

  useEffect(() => {
    if (!empresaId) return;
    setLoading(true);
    setError(null);

    api.get(`/solicitudes/empresa/${empresaId}`)
      .then(res => setSolicitudes(res.data))
      .catch(err => {
        console.error('Error cargando solicitudes', err);
        setError('No se pudieron cargar las solicitudes.');
      })
      .finally(() => setLoading(false));
  }, [empresaId]);

  const generarInforme = (id: number) => {
    const base = getBase();
    if (!base) {
      console.error('baseURL no definida. Revisa VITE_API_URL');
      return;
    }
    const url = `${base}/informes/${id}/generar`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const generarInformeGold = (id: number) => {
    const base = getBase();
    if (!base) {
      console.error('baseURL no definida. Revisa VITE_API_URL');
      return;
    }
    const url = `${base}/informes/${id}/generar?template=gold`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="flex items-center justify-between gap-2 mb-4">
        <h1 className="text-xl sm:text-2xl font-bold text-primary">📄 Informes disponibles</h1>
      </div>

      {/* Estado: cargando */}
      {loading && (
        <div className="animate-pulse space-y-3">
          <div className="h-10 bg-gray-200 rounded" />
          <div className="h-24 bg-gray-200 rounded" />
          <div className="h-24 bg-gray-200 rounded" />
        </div>
      )}

      {/* Estado: error */}
      {!loading && error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Estado: vacío */}
      {!loading && !error && solicitudes.length === 0 && (
        <div className="text-gray-600 bg-white border rounded p-6">
          No hay solicitudes para mostrar todavía.
        </div>
      )}

      {/* MOBILE (≤ md): tarjetas */}
      {!loading && !error && solicitudes.length > 0 && (
        <div className="grid grid-cols-1 gap-4 lg:hidden">
          {solicitudes.map((s) => (
            <div
              key={s.id}
              className="bg-white border rounded-xl p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm text-gray-500">Cliente</p>
                  <p className="font-medium truncate">{s.cliente.nombre}</p>
                </div>
                <span className="shrink-0 bg-gray-100 text-gray-700 rounded-full px-2 py-1 text-xs font-medium">
                  {s.estado}
                </span>
              </div>

              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="min-w-0">
                  <p className="text-sm text-gray-500">RUT</p>
                  <p className="font-medium break-words">{s.cliente.rut}</p>
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-gray-500">Dirección</p>
                  <p className="font-medium line-clamp-2">{s.direccion}</p>
                </div>
              </div>

              <div className="mt-4 flex flex-col xs:flex-row gap-2">
                <button
                  className="w-full xs:w-auto inline-flex justify-center items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 active:scale-[0.99] text-sm transition"
                  onClick={() => generarInforme(s.id)}
                  aria-label={`Generar informe clásico de ${s.cliente.nombre}`}
                >
                  Informe clásico
                </button>
                <button
                  className="w-full xs:w-auto inline-flex justify-center items-center bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 active:scale-[0.99] text-sm transition"
                  onClick={() => generarInformeGold(s.id)}
                  title="Plantilla tipo GOLD"
                  aria-label={`Generar informe GOLD de ${s.cliente.nombre}`}
                >
                  Informe GOLD
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* DESKTOP (≥ lg): tabla con scroll horizontal seguro */}
      {!loading && !error && solicitudes.length > 0 && (
        <div className="hidden lg:block">
          <section className="rounded-xl border bg-white shadow-sm">
            {/* Contenedor con altura limitada y scroll interno */}
            <div className="overflow-auto max-h-[60vh]">
              <table className="table-fixed w-full text-left text-[13px] leading-tight">
                {/* Anchos de columna para evitar que crezcan de más */}
                <colgroup>
                  <col className="w-[24%]" />
                  <col className="w-[14%]" />
                  <col className="w-[36%]" />
                  <col className="w-[12%]" />
                  <col className="w-[14%]" />
                </colgroup>

                <thead className="bg-gray-50 sticky top-0 z-10">
                  <tr>
                    <th className="py-2.5 px-3 font-semibold text-gray-700">Cliente</th>
                    <th className="py-2.5 px-3 font-semibold text-gray-700">RUT</th>
                    <th className="py-2.5 px-3 font-semibold text-gray-700">Dirección</th>
                    <th className="py-2.5 px-3 font-semibold text-gray-700">Estado</th>
                    <th className="py-2.5 px-3 font-semibold text-gray-700">Acciones</th>
                  </tr>
                </thead>

                <tbody>
                  {solicitudes.map((s, idx) => (
                    <tr key={s.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="py-2 px-3 align-top whitespace-nowrap">{s.cliente.nombre}</td>
                      <td className="py-2 px-3 align-top whitespace-nowrap">{s.cliente.rut}</td>
                      <td className="py-2 px-3 align-top">
                        {/* clamp para 1 línea, con tooltip completo */}
                        <div className="truncate" title={s.direccion}>{s.direccion}</div>
                      </td>
                      <td className="py-2 px-3 align-top">
                        <span className="bg-gray-100 text-gray-700 rounded-full px-2 py-0.5 text-[11px] font-medium">
                          {s.estado}
                        </span>
                      </td>
                      <td className="py-2 px-3 align-top">
                        <div className="flex flex-wrap gap-1.5">
                          <button
                            className="inline-flex items-center justify-center bg-primary text-white px-2.5 py-1.5 rounded-md hover:bg-blue-700 text-[12px]"
                            onClick={() => generarInforme(s.id)}
                            aria-label={`Generar informe clásico de ${s.cliente.nombre}`}
                          >
                            Clásico
                          </button>
                          <button
                            className="inline-flex justify-center items-center bg-secondary text-white px-3 py-0.5 rounded-md hover:bg-emerald-700 text-sm"
                            onClick={() => generarInformeGold(s.id)}
                            title="Plantilla tipo GOLD"
                            aria-label={`Generar informe GOLD de ${s.cliente.nombre}`}
                          >
                            GOLD
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Footer opcional */}
            {/* <div className="px-3 py-2 border-t text-xs text-gray-500">Mostrando X de Y</div> */}
          </section>
        </div>
      )}
    </div>
  );
}

/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import { showToast } from "../utils/toast";

type TotalsRow = { api_name: string; units: number; cost_usd: number };
type DailyRow  = { date: string; api_name: string; units: number };
type PriceMap  = Record<string, number>;

type Summary = {
  totals: TotalsRow[];
  grand_total_usd: number;
  daily: DailyRow[];
  price_per_1000_usd: PriceMap;
};

const API_LABELS: Record<string, string> = {
  places_autocomplete: "Places Autocomplete",
  place_details: "Place Details",
  geocoding: "Geocoding",
  maps_js: "Maps JavaScript",
};

export default function GastosGoogleAPI() {
  const [from, setFrom] = useState<string>("");
  const [to, setTo] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<Summary | null>(null);

  async function cargar() {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (from) params.set("from", from);
      if (to) params.set("to", to);
      const { data } = await api.get(`/google-billing/summary?${params.toString()}`);
      setSummary(data);
    } catch (e) {
      console.error(e);
      showToast("❌ Error al cargar gastos de Google API", "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { cargar(); }, []);

  const totalsSorted = useMemo(() => {
    if (!summary) return [];
    return [...summary.totals].sort((a, b) => b.cost_usd - a.cost_usd);
  }, [summary]);

  const pivot = useMemo(() => {
    if (!summary) return { days: [] as string[], apis: [] as string[], data: {} as Record<string, Record<string, number>> };
    const daysSet = new Set<string>();
    const apisSet = new Set<string>();
    const data: Record<string, Record<string, number>> = {};
    for (const row of summary.daily) {
      daysSet.add(row.date);
      apisSet.add(row.api_name);
      if (!data[row.date]) data[row.date] = {};
      data[row.date][row.api_name] = (data[row.date][row.api_name] || 0) + row.units;
    }
    const days = [...daysSet].sort((a, b) => (a < b ? 1 : -1)); // DESC
    const apis = [...apisSet].sort();
    return { days, apis, data };
  }, [summary]);

  return (
    <div className="bg-white p-6 rounded shadow max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <h1 className="text-2xl font-bold text-primary">Gasto Google API</h1>
        <div className="flex gap-2">
          <button
            onClick={() => cargar()}
            disabled={loading}
            className="rounded px-3 py-2 ring-1 ring-gray-300 hover:bg-gray-50"
          >
            {loading ? "Cargando…" : "Recargar"}
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="grid sm:grid-cols-5 gap-3 mb-4">
        <input type="date" value={from} onChange={e=>setFrom(e.target.value)} className="border rounded px-3 py-2" />
        <input type="date" value={to} onChange={e=>setTo(e.target.value)} className="border rounded px-3 py-2" />
        <button
          onClick={cargar}
          className="bg-primary text-white rounded px-3 py-2 hover:bg-secondary"
          disabled={loading}
        >
          Filtrar
        </button>
        <button
          onClick={() => { setFrom(""); setTo(""); cargar(); }}
          className="rounded px-3 py-2 ring-1 ring-gray-300 hover:bg-gray-50"
          disabled={loading}
        >
          Limpiar
        </button>
        <div className="text-right font-semibold">
          Total:{" "}
          {summary
            ? `$${summary.grand_total_usd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD`
            : "$0.00 USD"}
        </div>
      </div>

      {/* Resumen por API */}
      <div className="overflow-x-auto mb-6">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left border-b">
              <th className="py-2">API</th>
              <th className="py-2 text-right">Unidades</th>
              <th className="py-2 text-right">Precio (USD / 1000)</th>
              <th className="py-2 text-right">Costo (USD)</th>
            </tr>
          </thead>
        <tbody>
          {totalsSorted.map((t) => (
            <tr key={t.api_name} className="border-b">
              <td className="py-2">{API_LABELS[t.api_name] || t.api_name}</td>
              <td className="py-2 text-right">{t.units.toLocaleString()}</td>
              <td className="py-2 text-right">
                {summary?.price_per_1000_usd?.[t.api_name]
                  ? summary.price_per_1000_usd[t.api_name].toLocaleString(undefined, { minimumFractionDigits: 2 })
                  : "—"}
              </td>
              <td className="py-2 text-right">
                ${t.cost_usd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </td>
            </tr>
          ))}
          {(!summary || totalsSorted.length === 0) && (
            <tr>
              <td colSpan={4} className="py-6 text-center text-gray-500">Sin datos</td>
            </tr>
          )}
        </tbody>
        </table>
      </div>

      {/* Tabla diaria pivoteada */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left border-b">
              <th className="py-2">Fecha</th>
              {pivot.apis.map(api => (
                <th key={api} className="py-2 text-right">
                  {API_LABELS[api] || api}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pivot.days.map(d => (
              <tr key={d} className="border-b">
                <td className="py-2">{new Date(d).toLocaleDateString()}</td>
                {pivot.apis.map(api => (
                  <td key={api} className="py-2 text-right">
                    {(pivot.data[d]?.[api] || 0).toLocaleString()}
                  </td>
                ))}
              </tr>
            ))}
            {pivot.days.length === 0 && (
              <tr>
                <td colSpan={1 + pivot.apis.length} className="py-6 text-center text-gray-500">Sin datos</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-gray-500 mt-4">
        * Los precios por 1000 unidades provienen de variables de entorno del servidor. Ajusta <code>GOOGLE_PRICE_*</code> según tu plan.
      </p>
    </div>
  );
}

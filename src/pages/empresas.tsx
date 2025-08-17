/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import api from "../services/api";
import { Empresa } from "../interface/configuracionInterface";
import { showToast } from "../utils/toast";


export default function Empresas() {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [form, setForm] = useState<Partial<Empresa>>({});
  const [cargando, setCargando] = useState(false);
  const [guardando, setGuardando] = useState(false);

  async function cargar() {
    setCargando(true);
    try {
      const { data } = await api.get("/empresas");
      setEmpresas(data || []);
    } catch (e:any) {
      showToast(e?.response?.data?.error || "Error al cargar empresas", "error");
    } finally { setCargando(false); }
  }

  useEffect(() => { cargar(); }, []);

  async function guardar(e: React.FormEvent) {
    e.preventDefault();
    setGuardando(true);
    try {
      if (form.id) {
        await api.put(`/empresas/${form.id}`, form);
        showToast("✅ Empresa actualizada", "success");
      } else {
        await api.post(`/empresas`, form);
        showToast("✅ Empresa creada", "success");
      }
      setForm({});
      await cargar();
    } catch (e:any) {
      showToast(e?.response?.data?.error || "Error al guardar", "error");
    } finally { setGuardando(false); }
  }

  async function eliminar(id: number) {
    if (!confirm("¿Eliminar empresa?")) return;
    try {
      await api.delete(`/empresas/${id}`);
      setEmpresas(empresas.filter(e => e.id !== id));
      showToast("🗑️ Empresa eliminada", "info");
    } catch (e:any) {
      showToast(e?.response?.data?.error || "Error al eliminar", "error");
    }
  }

  return (
    <div className="p-4 max-w-5xl mx-auto space-y-4">
      <h1 className="text-xl font-semibold">Empresas</h1>

      <form onSubmit={guardar} className="bg-white p-4 rounded shadow grid grid-cols-1 md:grid-cols-2 gap-3">
        <input className="border rounded p-2" placeholder="Nombre"
          value={form.nombre || ""} onChange={e=>setForm({...form, nombre: e.target.value})}/>
        <input className="border rounded p-2" placeholder="Correo"
          value={form.correo || ""} onChange={e=>setForm({...form, correo: e.target.value})}/>
        <input className="border rounded p-2" placeholder="Logo URL"
          value={form.logo_url || ""} onChange={e=>setForm({...form, logo_url: e.target.value})}/>
        <div className="flex items-center gap-2">
          <span className="text-sm">Color primario</span>
          <input type="color" className="border rounded h-10 w-16"
            value={form.color_primario || "#0ea5e9"} onChange={e=>setForm({...form, color_primario: e.target.value})}/>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm">Color secundario</span>
          <input type="color" className="border rounded h-10 w-16"
            value={form.color_segundario || "#64748b"} onChange={e=>setForm({...form, color_segundario: e.target.value})}/>
        </div>

        <div className="col-span-full flex gap-2">
          <button disabled={guardando} className="px-4 py-2 rounded text-white bg-primary hover:bg-secondary disabled:opacity-60">
            {guardando ? "Guardando..." : (form.id ? "Actualizar" : "Crear")}
          </button>
          {form.id && (
            <button type="button" onClick={()=>setForm({})} className="px-4 py-2 rounded border">Cancelar</button>
          )}
        </div>
      </form>

      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-2">Nombre</th>
              <th className="text-left p-2">Correo</th>
              <th className="text-left p-2">Logo</th>
              <th className="text-left p-2">Colores</th>
              <th className="p-2 w-40"></th>
            </tr>
          </thead>
          <tbody>
            {cargando ? (
              <tr><td colSpan={5} className="p-4">Cargando...</td></tr>
            ) : empresas.map(e => (
              <tr key={e.id} className="border-t">
                <td className="p-2">{e.nombre}</td>
                <td className="p-2">{e.correo}</td>
                <td className="p-2">{e.logo_url ? <img src={e.logo_url} alt="" className="h-8"/> : "-"}</td>
                <td className="p-2">
                  <div className="flex gap-2">
                    <div className="h-5 w-5 rounded" style={{ background: e.color_primario || "" }} />
                    <div className="h-5 w-5 rounded" style={{ background: e.color_segundario || "" }} />
                  </div>
                </td>
                <td className="p-2 text-right space-x-2">
                  <button onClick={()=>setForm(e)} className="px-2 py-1 rounded bg-blue-600 text-white">Editar</button>
                  <button onClick={()=>eliminar(e.id)} className="px-2 py-1 rounded bg-red-600 text-white">Eliminar</button>
                </td>
              </tr>
            ))}
            {!cargando && empresas.length === 0 && (
              <tr><td colSpan={5} className="p-4 text-center text-gray-500">Sin empresas</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

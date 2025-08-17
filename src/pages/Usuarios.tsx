/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import api from "../services/api";
import { showToast } from "../utils/toast";
import { Usuario } from "../interface/configuracionInterface";

type Rol = "admin"|"mesonero"|"bartender"|"cocina"|"visor";
const ROLES: Rol[] = ["admin","mesonero","bartender","cocina","visor"];

interface Empresa { id: number; nombre: string; }

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [form, setForm] = useState<Partial<Usuario>>({});
  const [password, setPassword] = useState("");
  const [cargando, setCargando] = useState(false);
  const [guardando, setGuardando] = useState(false);

  async function cargar() {
    setCargando(true);
    try {
      const [{ data: us }, { data: es }] = await Promise.all([
        // Si tu backend lista por empresa, ajusta el ID aquí:
        api.get('/usuarios', { params: { id_empresa: 1 } }),
        api.get("/empresas"),
      ]);
      setUsuarios(us || []);
      setEmpresas(es || []);
    } catch (e:any) {
      showToast(e?.response?.data?.error || "Error al cargar datos", "error");
    } finally { setCargando(false); }
  }

  useEffect(() => { cargar(); }, []);

  async function guardar(e: React.FormEvent) {
    e.preventDefault();

    // Validaciones mínimas
    const nombre = (form.nombre || "").trim();
    const correo = (form.correo || "").trim();
    const rol = (form.rol as Rol) || "visor";
    // Si quieres tomar el id_empresa seleccionado en el form:
    const id_empresa = form.id_empresa ?? 1; // <-- usa el seleccionado o 1 por defecto

    if (!nombre || !correo) {
      showToast("Nombre y correo son obligatorios", "error");
      return;
    }
    if (!form.id && !password) {
      showToast("La contraseña es obligatoria al crear", "error");
      return;
    }

    setGuardando(true);
    try {
      if (form.id) {
        // EDITAR
        const payload: any = {
          nombre,
          correo,
          rol,
          id_empresa,
        };
        if (password) payload.password = password;

        const { data } = await api.put(`/usuarios/${form.id}`, payload);
        setUsuarios(prev => prev.map(u => u.id === data.id ? data : u));
        showToast("✅ Usuario actualizado", "success");
      } else {
        // CREAR
        const payload = {
          nombre,
          correo,
          password: password || "Cambiar123!",
          rol,
          id_empresa,
        };
        const { data } = await api.post('/usuarios', payload);
        setUsuarios(prev => [data, ...prev]);
        showToast("✅ Usuario creado", "success");
      }

      setForm({});
      setPassword("");
    } catch (e:any) {
      showToast(e?.response?.data?.error || "Error al guardar", "error");
    } finally { setGuardando(false); }
  }

  async function eliminar(id: number) {
    if (!confirm("¿Eliminar usuario?")) return;
    try {
      await api.delete(`/usuarios/${id}`);
      setUsuarios(prev => prev.filter(u => u.id !== id));
      showToast("🗑️ Usuario eliminado", "info");
    } catch (e:any) {
      showToast(e?.response?.data?.error || "Error al eliminar", "error");
    }
  }

  return (
    <div className="p-4 max-w-6xl mx-auto space-y-4">
      <h1 className="text-xl font-semibold">Usuarios</h1>

      <form onSubmit={guardar} className="bg-white p-4 rounded shadow grid grid-cols-1 md:grid-cols-3 gap-3">
        <input className="border rounded p-2" placeholder="Nombre"
          value={form.nombre || ""} onChange={e=>setForm({ ...form, nombre: e.target.value })}/>
        <input className="border rounded p-2" placeholder="Correo"
          value={form.correo || ""} onChange={e=>setForm({ ...form, correo: e.target.value })}/>

        <select className="border rounded p-2" value={(form.rol as Rol) || "visor"}
          onChange={e=>setForm({ ...form, rol: e.target.value as Rol })}>
          {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
        </select>

        <select className="border rounded p-2" value={form.id_empresa ?? ""}
          onChange={e=>setForm({ ...form, id_empresa: e.target.value ? Number(e.target.value) : null })}>
          <option value="">Sin empresa</option>
          {empresas.map(e => <option key={e.id} value={e.id}>{e.nombre}</option>)}
        </select>

        {/* Contraseña: requerida al crear, opcional al editar */}
        <input className="border rounded p-2" placeholder={form.id ? "Nueva contraseña (opcional)" : "Contraseña"}
          type="password" value={password} onChange={e=>setPassword(e.target.value)} />

        <div className="col-span-full flex gap-2">
          <button disabled={guardando} className="px-4 py-2 rounded text-white bg-primary hover:bg-secondary disabled:opacity-60">
            {guardando ? "Guardando..." : (form.id ? "Actualizar" : "Crear")}
          </button>
          {form.id && (
            <button type="button" onClick={()=>{ setForm({}); setPassword(""); }} className="px-4 py-2 rounded border">
              Cancelar
            </button>
          )}
        </div>
      </form>

      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-2">Nombre</th>
              <th className="text-left p-2">Correo</th>
              <th className="text-left p-2">Rol</th>
              <th className="text-left p-2">Empresa</th>
              <th className="p-2 w-40"></th>
            </tr>
          </thead>
          <tbody>
            {cargando ? (
              <tr><td colSpan={5} className="p-4">Cargando...</td></tr>
            ) : usuarios.map(u => (
              <tr key={u.id} className="border-t">
                <td className="p-2">{u.nombre}</td>
                <td className="p-2">{u.correo}</td>
                <td className="p-2">{u.rol}</td>
                <td className="p-2">{empresas.find(e => e.id === u.id_empresa)?.nombre || "-"}</td>
                <td className="p-2 text-right space-x-2">
                  <button onClick={()=>setForm(u)} className="px-2 py-1 rounded bg-blue-600 text-white">Editar</button>
                  <button onClick={()=>eliminar(u.id)} className="px-2 py-1 rounded bg-red-600 text-white">Eliminar</button>
                </td>
              </tr>
            ))}
            {!cargando && usuarios.length === 0 && (
              <tr><td colSpan={5} className="p-4 text-center text-gray-500">Sin usuarios</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

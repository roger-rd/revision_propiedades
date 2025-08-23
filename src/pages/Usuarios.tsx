/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import { showToast } from "../utils/toast";
import { Usuario } from "../interface/configuracionInterface";

type Rol = "admin"|"mesonero"|"bartender"|"cocina"|"visor";
const ROLES: Rol[] = ["admin","mesonero","bartender","cocina","visor"];
interface Empresa { id: number; nombre: string; }

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [filtroEmpresa, setFiltroEmpresa] = useState<number | "all">("all"); // 👈 NUEVO
  const [form, setForm] = useState<Partial<Usuario>>({});
  const [password, setPassword] = useState("");
  const [cargando, setCargando] = useState(false);
  const [guardando, setGuardando] = useState(false);

  // para mostrar nombre empresa incluso cuando no está en la lista (fallback)
  const nombreEmpresa = useMemo(() => {
    const map = new Map(empresas.map(e => [e.id, e.nombre]));
    return (id?: number|null) => (id ? (map.get(id) ?? `#${id}`) : "-");
  }, [empresas]);

  async function cargar() {
    setCargando(true);
    try {
      // 1) empresas
      const { data: es } = await api.get("/empresas");
      setEmpresas(es || []);

      // 2) usuarios, con filtro
      const params: any = {};
      if (filtroEmpresa === "all") {
        params.empresa = "all";                 // 👈 si backend espera id_empresa, usa: params.id_empresa = undefined
      } else if (typeof filtroEmpresa === "number") {
        params.empresa = String(filtroEmpresa); // 👈 si backend espera id_empresa, usa: params.id_empresa = filtroEmpresa
      }
      const { data: us } = await api.get("/usuarios", { params });
      setUsuarios(us || []);
    } catch (e: any) {
      showToast(e?.response?.data?.error || "Error al cargar datos", "error");
    } finally {
      setCargando(false);
    }
  }

  // carga inicial y cada vez que cambia el filtro
  useEffect(() => { cargar(); /* eslint-disable-next-line */ }, 
  [filtroEmpresa]);

  async function guardar(e: React.FormEvent) {
    e.preventDefault();

    const nombre = (form.nombre || "").trim();
    const correo = (form.correo || "").trim();
    const rol = (form.rol as Rol) || "visor";

    // empresa a usar: la que elijas en el form, si no, la del filtro (si no es "all")
    const id_empresa =
      form.id_empresa ?? (typeof filtroEmpresa === "number" ? filtroEmpresa : undefined);

    if (!nombre || !correo) {
      showToast("Nombre y correo son obligatorios", "error");
      return;
    }
    if (!form.id && !password) {
      showToast("La contraseña es obligatoria al crear", "error");
      return;
    }
    if (!id_empresa) {
      showToast("Selecciona una empresa para crear/actualizar", "error");
      return;
    }

    setGuardando(true);
    try {
      if (form.id) {
        // EDITAR
        const payload: any = { nombre, correo, rol, id_empresa };
        if (password) payload.password = password;

        const { data } = await api.put(`/usuarios/${form.id}`, payload);
        setUsuarios(prev => prev.map(u => (u.id === data.id ? data : u)));
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
        const { data } = await api.post("/usuarios", payload);
        setUsuarios(prev => [data, ...prev]);
        showToast("✅ Usuario creado", "success");
      }
      setForm({});
      setPassword("");
    } catch (e: any) {
      showToast(e?.response?.data?.error || "Error al guardar", "error");
    } finally {
      setGuardando(false);
    }
  }

  async function eliminar(id: number) {
    if (!confirm("¿Eliminar usuario?")) return;
    try {
      await api.delete(`/usuarios/${id}`);
      setUsuarios(prev => prev.filter(u => u.id !== id));
      showToast("🗑️ Usuario eliminado", "info");
    } catch (e: any) {
      showToast(e?.response?.data?.error || "Error al eliminar", "error");
    }
  }

  return (
    <div className="p-4 max-w-6xl mx-auto space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-xl font-semibold">Usuarios</h1>

        {/* Filtro por empresa */}
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Empresa:</label>
          <select
            className="border rounded p-2"
            value={filtroEmpresa}
            onChange={(e) => {
              const v = e.target.value;
              setFiltroEmpresa(v === "all" ? "all" : Number(v));
            }}
          >
            <option value="all">Todas las empresas</option>
            {empresas.map(e => (
              <option key={e.id} value={e.id}>{e.nombre}</option>
            ))}
          </select>
        </div>
      </div>

      <form onSubmit={guardar} className="bg-white p-4 rounded shadow grid grid-cols-1 md:grid-cols-3 gap-3">
        <input
          className="border rounded p-2"
          placeholder="Nombre"
          value={form.nombre || ""}
          onChange={e => setForm({ ...form, nombre: e.target.value })}
        />
        <input
          className="border rounded p-2"
          placeholder="Correo"
          value={form.correo || ""}
          onChange={e => setForm({ ...form, correo: e.target.value })}
        />

        <select
          className="border rounded p-2"
          value={(form.rol as Rol) || "visor"}
          onChange={e => setForm({ ...form, rol: e.target.value as Rol })}
        >
          {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
        </select>

        {/* Empresa para el form (permite sobre-escribir el filtro si quieres asignar a otra) */}
        <select
          className="border rounded p-2"
          value={form.id_empresa ?? (typeof filtroEmpresa === "number" ? filtroEmpresa : "")}
          onChange={e => setForm({ ...form, id_empresa: e.target.value ? Number(e.target.value) : undefined })}
        >
          <option value="">(elige empresa)</option>
          {empresas.map(e => <option key={e.id} value={e.id}>{e.nombre}</option>)}
        </select>

        {/* Contraseña: requerida al crear, opcional al editar */}
        <input
          className="border rounded p-2"
          placeholder={form.id ? "Nueva contraseña (opcional)" : "Contraseña"}
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        <div className="col-span-full flex gap-2">
          <button
            disabled={guardando}
            className="px-4 py-2 rounded text-white bg-primary hover:bg-secondary disabled:opacity-60"
          >
            {guardando ? "Guardando..." : (form.id ? "Actualizar" : "Crear")}
          </button>
          {form.id && (
            <button
              type="button"
              onClick={() => { setForm({}); setPassword(""); }}
              className="px-4 py-2 rounded border"
            >
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
                <td className="p-2">{nombreEmpresa(u.id_empresa)}</td>
                <td className="p-2 text-right space-x-2">
                  <button onClick={() => setForm(u)} className="px-2 py-1 rounded bg-blue-600 text-white">Editar</button>
                  <button onClick={() => eliminar(u.id)} className="px-2 py-1 rounded bg-red-600 text-white">Eliminar</button>
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

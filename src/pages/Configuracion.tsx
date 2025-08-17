import { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/useAuth';
import { Empresa, Usuario } from '../interface/configuracionInterface';
import { showToast } from '../utils/toast';



export default function Configuracion() {
  const { empresa, usuario, setEmpresa } = useAuth();
  const [tab, setTab] = useState<'perfil' | 'empresa' | 'marca'>('perfil');

  // Perfil
  const [perfil, setPerfil] = useState<Usuario | null>(null);
  const [passActual, setPassActual] = useState('');
  const [passNueva, setPassNueva] = useState('');

  // Empresa
  const [emp, setEmp] = useState<Empresa | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        if (usuario?.id) {
          const r = await api.get(`/usuarios/${usuario.id}`);
          setPerfil(r.data);
        }
        if (empresa?.id) {
          const r = await api.get(`/empresas/${empresa.id}`);
          setEmp(r.data);
          const p = r.data.color_primario ?? '#111827';
          const s = r.data.color_segundario ?? '#374151';
          document.documentElement.style.setProperty('--primary', p);
          document.documentElement.style.setProperty('--secondary', s);
        }
      } catch (e) {
        console.error(e);
      }
    })();
  }, [usuario?.id, empresa?.id]);

  const guardarPerfil = async () => {
    if (!perfil) return;
    try {
      // Solo lo que acepta el backend
      await api.put(`/usuarios/${perfil.id}`, {
        nombre: perfil.nombre,
        correo: perfil.correo,
      });
      showToast('✅ Perfil actualizado', "success");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      console.error(e);
      showToast(e?.response?.data?.error || 'No se pudo actualizar el perfil', "error");
    }
  };

  const cambiarPassword = async () => {
    if (!usuario?.id) return;
    try {
      await api.put(`/usuarios/${usuario.id}/password`, {
        password_actual: passActual,
        password_nueva: passNueva,
      });
      setPassActual(''); setPassNueva('');
      showToast('✅ Contraseña actualizada', "success");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      console.error(e);
      showToast(e?.response?.data?.error || 'No se pudo actualizar la contraseña', "error");
    }
  };

  const guardarEmpresa = async () => {
    if (!emp) return;
    try {
      // Solo nombre y colores
      const { data } = await api.put(`/empresas/${emp.id}`, {
        nombre: emp.nombre,
        color_primario: emp.color_primario,
        color_segundario: emp.color_segundario,
      });
      // cache-busting por si el CDN mantiene CSS antiguo
      const updated = {
        ...data,
        logo_url: data.logo_url ? `${data.logo_url}?v=${Date.now()}` : data.logo_url,
      };
      setEmp(updated);
      setEmpresa(updated);
      showToast('✅ Empresa actualizada', "success");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      console.error(e);
      showToast(e?.response?.data?.error || 'No se pudo actualizar la empresa', "error");
    }
  };

  const subirLogo = async () => {
    if (!logoFile || !emp) return;
    try {
      const form = new FormData();
      form.append('logo', logoFile);
      const { data } = await api.put(`/empresas/${emp.id}/logo`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      // cache-busting del logo
      const updated = {
        ...data,
        logo_url: data.logo_url ? `${data.logo_url}?v=${Date.now()}` : data.logo_url,
      };

      setEmp(updated);
      setEmpresa(updated);
      setPreview(null);
      setLogoFile(null);
      showToast(' Logo actualizado', 'success')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      console.error(e);
      showToast(e?.response?.data?.error || 'No se pudo subir el logo', 'error');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Configuración</h1>

      <div className="flex gap-2 mb-6">
        <button className={`px-3 py-1 rounded ${tab === 'perfil' ? 'bg-primary text-white' : 'bg-gray-100'}`} onClick={() => setTab('perfil')}>Perfil</button>
        <button className={`px-3 py-1 rounded ${tab === 'empresa' ? 'bg-primary text-white' : 'bg-gray-100'}`} onClick={() => setTab('empresa')}>Empresa</button>
        <button className={`px-3 py-1 rounded ${tab === 'marca' ? 'bg-primary text-white' : 'bg-gray-100'}`} onClick={() => setTab('marca')}>Marca</button>
      </div>

      {tab === 'perfil' && perfil && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm">Nombre</label>
            <input
              className="border w-full px-3 py-2 rounded"
              value={perfil.nombre}
              onChange={e => setPerfil({ ...perfil, nombre: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm">Correo</label>
            <input
              className="border w-full px-3 py-2 rounded"
              value={perfil.correo}
              onChange={e => setPerfil({ ...perfil, correo: e.target.value })}
            />
          </div>

          <button onClick={guardarPerfil} className="bg-primary text-white px-4 py-2 rounded">
            Guardar perfil
          </button>

          <hr className="my-4" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-sm">Contraseña actual</label>
              <input
                type="password"
                className="border w-full px-3 py-2 rounded"
                value={passActual}
                onChange={e => setPassActual(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm">Nueva contraseña</label>
              <input
                type="password"
                className="border w-full px-3 py-2 rounded"
                value={passNueva}
                onChange={e => setPassNueva(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <button onClick={cambiarPassword} className="bg-secondary text-white px-4 py-2 rounded">
                Actualizar contraseña
              </button>
            </div>
          </div>
        </div>
      )}

      {tab === 'empresa' && emp && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm">Nombre empresa</label>
            <input
              className="border w-full px-3 py-2 rounded"
              value={emp.nombre}
              onChange={e => setEmp({ ...emp, nombre: e.target.value })}
            />
          </div>
          {/* Dirección eliminada porque no existe en la BD */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm">Color primario</label>
              <input
                type="color"
                className="h-10 w-full p-0 border rounded"
                value={emp.color_primario ?? '#111827'}
                onChange={e => setEmp({ ...emp, color_primario: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm">Color secundario</label>
              <input
                type="color"
                className="h-10 w-full p-0 border rounded"
                value={emp.color_segundario ?? '#374151'}
                onChange={e => setEmp({ ...emp, color_segundario: e.target.value })}
              />
            </div>
          </div>
          <button onClick={guardarEmpresa} className="bg-primary text-white px-4 py-2 rounded">
            Guardar empresa
          </button>
        </div>
      )}

      {tab === 'marca' && emp && (
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <img
              src={preview || emp.logo_url || '/logo-fallback.png'}
              alt="logo"
              className="w-28 h-28 object-contain border rounded bg-white"
            />
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const f = e.target.files?.[0] || null;
                  setLogoFile(f);
                  setPreview(f ? URL.createObjectURL(f) : null);
                }}
              />
              <div className="mt-2">
                <button
                  disabled={!logoFile}
                  onClick={subirLogo}
                  className="bg-primary text-white px-4 py-2 rounded disabled:opacity-50"
                >
                  Subir logo
                </button>
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-500">Recomendado: PNG o SVG fondo transparente, 512x512</p>
        </div>
      )}
    </div>
  );
}

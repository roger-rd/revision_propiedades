/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/useAuth';
import { Empresa, Usuario } from '../interface/configuracionInterface';
import { showToast } from '../utils/toast';

type TabKey = 'perfil' | 'empresa' | 'marca';

export default function Configuracion() {
  const { empresa, usuario, setEmpresa } = useAuth();
  const [tab, setTab] = useState<TabKey>('perfil');

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
      await api.put(`/usuarios/${perfil.id}`, {
        nombre: perfil.nombre,
        correo: perfil.correo,
      });
      showToast('✅ Perfil actualizado', "success");
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
    } catch (e: any) {
      console.error(e);
      showToast(e?.response?.data?.error || 'No se pudo actualizar la contraseña', "error");
    }
  };

  const guardarEmpresa = async () => {
    if (!emp) return;
    try {
      const { data } = await api.put(`/empresas/${emp.id}`, {
        nombre: emp.nombre,
        color_primario: emp.color_primario,
        color_segundario: emp.color_segundario,
      });
      const updated = {
        ...data,
        logo_url: data.logo_url ? `${data.logo_url}?v=${Date.now()}` : data.logo_url,
      };
      setEmp(updated);
      setEmpresa(updated);
      showToast('✅ Empresa actualizada', "success");
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
      const updated = {
        ...data,
        logo_url: data.logo_url ? `${data.logo_url}?v=${Date.now()}` : data.logo_url,
      };
      setEmp(updated);
      setEmpresa(updated);
      setPreview(null);
      setLogoFile(null);
      showToast(' Logo actualizado', 'success');
    } catch (e: any) {
      console.error(e);
      showToast(e?.response?.data?.error || 'No se pudo subir el logo', 'error');
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      <header className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-primary">Configuración</h1>
      </header>

      {/* Tabs: mobile-first, sticky y scroll horizontal cuando no caben */}
      <div className="sticky top-0 z-10 bg-white/90 backdrop-blur mb-4 sm:mb-6">
        <div className="flex gap-2 overflow-x-auto no-scrollbar py-2">
          {(['perfil','empresa','marca'] as TabKey[]).map((key) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={[
                "shrink-0 px-4 py-2 rounded-full border text-sm transition",
                tab === key
                  ? "bg-[var(--primary,#1f2937)] text-white border-[var(--primary,#1f2937)]"
                  : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
              ].join(' ')}
              aria-current={tab === key ? 'page' : undefined}
            >
              {key === 'perfil' && 'Perfil'}
              {key === 'empresa' && 'Empresa'}
              {key === 'marca' && 'Marca'}
            </button>
          ))}
        </div>
      </div>

      {/* Contenido */}
      <div className="space-y-6">
        {/* PERFIL */}
        {tab === 'perfil' && perfil && (
          <section className="bg-white rounded-xl border shadow-sm p-4 sm:p-6">
            <h2 className="text-lg font-semibold mb-3">Datos personales</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Nombre</label>
                <input
                  className="border w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary,#1f2937)]"
                  value={perfil.nombre}
                  onChange={e => setPerfil({ ...perfil, nombre: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Correo</label>
                <input
                  className="border w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary,#1f2937)]"
                  value={perfil.correo}
                  onChange={e => setPerfil({ ...perfil, correo: e.target.value })}
                />
              </div>
            </div>

            <div className="mt-4">
              <button
                onClick={guardarPerfil}
                className="w-full sm:w-auto bg-[var(--primary,#1f2937)] text-white px-5 py-2.5 rounded-lg hover:opacity-95 active:scale-[0.99]"
              >
                Guardar perfil
              </button>
            </div>

            <hr className="my-6" />

            <h3 className="text-base font-semibold mb-3">Cambiar contraseña</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Contraseña actual</label>
                <input
                  type="password"
                  className="border w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary,#1f2937)]"
                  value={passActual}
                  onChange={e => setPassActual(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Nueva contraseña</label>
                <input
                  type="password"
                  className="border w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary,#1f2937)]"
                  value={passNueva}
                  onChange={e => setPassNueva(e.target.value)}
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={cambiarPassword}
                  className="w-full md:w-auto bg-[var(--secondary,#374151)] text-white px-5 py-2.5 rounded-lg hover:opacity-95 active:scale-[0.99)]"
                >
                  Actualizar contraseña
                </button>
              </div>
            </div>
          </section>
        )}

        {/* EMPRESA */}
        {tab === 'empresa' && emp && (
          <section className="bg-white rounded-xl border shadow-sm p-4 sm:p-6">
            <h2 className="text-lg font-semibold mb-3">Datos de la empresa</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm text-gray-600 mb-1">Nombre empresa</label>
                <input
                  className="border w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary,#1f2937)]"
                  value={emp.nombre}
                  onChange={e => setEmp({ ...emp, nombre: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">Color primario</label>
                <input
                  type="color"
                  className="h-11 w-full p-0 border rounded-lg"
                  value={emp.color_primario ?? '#111827'}
                  onChange={e => setEmp({ ...emp, color_primario: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Color secundario</label>
                <input
                  type="color"
                  className="h-11 w-full p-0 border rounded-lg"
                  value={emp.color_segundario ?? '#374151'}
                  onChange={e => setEmp({ ...emp, color_segundario: e.target.value })}
                />
              </div>
            </div>

            <div className="mt-4">
              <button
                onClick={guardarEmpresa}
                className="w-full sm:w-auto bg-[var(--primary,#1f2937)] text-white px-5 py-2.5 rounded-lg hover:opacity-95 active:scale-[0.99)]"
              >
                Guardar empresa
              </button>
            </div>
          </section>
        )}

        {/* MARCA */}
        {tab === 'marca' && emp && (
          <section className="bg-white rounded-xl border shadow-sm p-4 sm:p-6">
            <h2 className="text-lg font-semibold mb-3">Identidad de marca</h2>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex items-center justify-center sm:justify-start">
                <div className="size-28 sm:size-32 md:size-36 border rounded-lg bg-white p-2 flex items-center justify-center">
                  {/* El contenedor mantiene proporción y evita que la imagen "salte" */}
                  <img
                    src={preview || emp.logo_url || '/logo-fallback.png'}
                    alt="Logo de la empresa"
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              </div>

              <div className="flex-1">
                <label className="block text-sm text-gray-600 mb-2">Subir nuevo logo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const f = e.target.files?.[0] || null;
                    setLogoFile(f);
                    setPreview(f ? URL.createObjectURL(f) : null);
                  }}
                  className="block w-full text-sm file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-gray-100 file:hover:bg-gray-200 file:cursor-pointer"
                />
                <div className="mt-3 flex flex-col sm:flex-row gap-2">
                  <button
                    disabled={!logoFile}
                    onClick={subirLogo}
                    className="w-full sm:w-auto bg-[var(--primary,#1f2937)] text-white px-5 py-2.5 rounded-lg disabled:opacity-50 hover:opacity-95 active:scale-[0.99)]"
                  >
                    Subir logo
                  </button>
                  {preview && (
                    <button
                      type="button"
                      onClick={() => { setPreview(null); setLogoFile(null); }}
                      className="w-full sm:w-auto border px-5 py-2.5 rounded-lg hover:bg-gray-50"
                    >
                      Cancelar
                    </button>
                  )}
                </div>
                <p className="mt-2 text-xs sm:text-sm text-gray-500">
                  Recomendado: PNG o SVG con fondo transparente, 512×512.
                </p>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import api from '../services/api';

export default function Login() {
  const { login, usuario } = useAuth();
  const navigate = useNavigate();

  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  // Si ya hay sesión, manda al dashboard
  useEffect(() => {
    if (usuario) navigate('/');
  }, [usuario, navigate]);

  // Maneja auto-logout (tu lógica)
  useEffect(() => {
    const fueAutoLogout = localStorage.getItem('autoLogout');
    if (fueAutoLogout) {
      localStorage.removeItem('autoLogout');
      navigate('/sesion-cerrada');
    }
  }, [navigate]);

  const aplicarColoresEmpresa = (empresa: { color_primario?: string | null; color_segundario?: string | null }) => {
    const primary = empresa.color_primario || '#0ea5e9';   // fallback
    const secondary = empresa.color_segundario || '#64748b';
    document.documentElement.style.setProperty('--primary', primary);
    document.documentElement.style.setProperty('--secondary', secondary);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setCargando(true);

    try {
      const { data } = await api.post('/usuarios/login', { correo, password });

      // Guarda token (el interceptor ya lo pondrá en Authorization)
      localStorage.setItem('token', data.token);

      // Actualiza contexto con usuario y empresa
      login(data.usuario, data.empresa);

      // Aplica colores de marca
      aplicarColoresEmpresa(data.empresa);

      navigate('/'); // Dashboard
    } catch (err: any) {
      console.error('Error al iniciar sesión:', err);
      const msg = err?.response?.data?.error || 'Error al iniciar sesión';
      setError(`❌ ${msg}`);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-96 space-y-6">
        <h1 className="text-2xl font-bold text-center text-primary">Login RDRP</h1>

        {error && (
          <div className="bg-red-100 text-red-600 p-2 rounded-md text-center">{error}</div>
        )}

        <div className="flex flex-col">
          <label className="text-primary">Correo</label>
          <input
            type="email"
            className="p-2 border rounded-md mt-1"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
            placeholder="admin@rdrp.cl"
            autoFocus
          />
        </div>

        <div className="flex flex-col">
          <label className="text-primary">Contraseña</label>
          <input
            type="password"
            className="p-2 border rounded-md mt-1"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e as any)}
          />
        </div>
        <a href="/recuperar-contraseña" className="text-sm text-blue-600 hover:underline">¿Olvidaste tu contraseña?</a>

        <button
          type="submit"
          disabled={cargando}
          className={`w-full text-white py-2 rounded-md transition duration-200
            ${cargando ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary hover:bg-secondary'}`}
        >
          {cargando ? 'Ingresando…' : 'Iniciar sesión'}
        </button>
      </form>
    </div>
  );
}

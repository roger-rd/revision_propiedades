import { useEffect, useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { showToast } from "../utils/toast";

export default function ResetConfirm() {
  const [params] = useSearchParams();
  const token = params.get("token") || "";
  const [pass1, setPass1] = useState("");
  const [pass2, setPass2] = useState("");
  const [cambiando, setCambiando] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      showToast("Token faltante", "error");
      navigate("/restablecer");
      return;
    }
    // Validación opcional (puedes comentarla si no usas el endpoint)
    (async () => {
      try {
        await api.get(`/auth/reset/validate`, { params: { token } });
      } catch {
        showToast("Enlace inválido o expirado ❌", "error");
        navigate("/restablecer")
      }
    })();
  }, [token, navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!pass1 || !pass2) return showToast("Completa ambos campos", "error");
    if (pass1 !== pass2) return showToast("Las contraseñas no coinciden", "error");
    if (pass1.length < 6) return showToast("Mínimo 6 caracteres", "error");

    setCambiando(true);
    try {
      await api.post("/auth/reset/confirm", { token, nuevaContrasena: pass1 });
      showToast("Contraseña actualizada ✅", "success");
      navigate("/login");
    } catch {
      showToast("No se pudo actualizar la contraseña ❌", "error");
    } finally {
      setCambiando(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white shadow rounded p-6 space-y-4">
        <h1 className="text-xl font-semibold">Crear nueva contraseña</h1>
        <input
          type="password"
          placeholder="Nueva contraseña"
          value={pass1}
          onChange={(e) => setPass1(e.target.value)}
          className="w-full border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-sky-400"
        />
        <input
          type="password"
          placeholder="Repite la contraseña"
          value={pass2}
          onChange={(e) => setPass2(e.target.value)}
          className="w-full border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-sky-400"
        />
        <button
          disabled={cambiando}
          className="w-full bg-sky-500 text-white rounded px-4 py-2 hover:bg-sky-600 disabled:opacity-60"
        >
          {cambiando ? "Guardando..." : "Guardar contraseña"}
        </button>
        <div className="text-center text-sm">
          <Link to="/login" className="text-sky-600 hover:underline">Volver al inicio de sesión</Link>
        </div>
      </form>
    </div>
  );
}

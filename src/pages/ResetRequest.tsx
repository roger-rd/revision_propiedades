/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import api from "../services/api";
import { showToast } from "../utils/toast";
import { Link } from "react-router-dom";

export default function ResetRequest() {
  const [correo, setCorreo] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!correo) {
      showToast("Ingresa tu correo", "error");
      return;
    }
    setEnviando(true);
    try {
      await api.post("/auth/reset/request", { correo });
      showToast("Si el correo existe, te enviamos un enlace ✅", "info");
    } catch (err) {
      showToast("No se pudo enviar la solicitud ❌", "error");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white shadow rounded p-6 space-y-4">
        <h1 className="text-xl font-semibold">Recuperar contraseña</h1>
        <p className="text-sm text-gray-600">
          Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña.
        </p>
        <input
          type="email"
          placeholder="tu@correo.com"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          className="w-full border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-sky-400"
        />
        <button
          disabled={enviando}
          className="w-full bg-sky-500 text-white rounded px-4 py-2 hover:bg-sky-600 disabled:opacity-60"
        >
          {enviando ? "Enviando..." : "Enviar enlace"}
        </button>

        <div className="text-center text-sm">
          <Link to="/login" className="text-sky-600 hover:underline">Volver al inicio de sesión</Link>
        </div>
      </form>
    </div>
  );
}

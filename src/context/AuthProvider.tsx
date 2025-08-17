import { useState, ReactNode, useEffect } from "react";
import { Empresa, Usuario } from "../interface/loginInterface";
import { AuthContext } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const LS_USER = "usuario";
const LS_EMPRESA = "empresa";

function applyTheme(empresa: Empresa | null) {
  const p = empresa?.color_primario ?? "#0ea5e9";
  const s = empresa?.color_segundario ?? "#64748b";
  document.documentElement.style.setProperty("--primary", p);
  document.documentElement.style.setProperty("--secondary", s);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(() => {
    const stored = localStorage.getItem(LS_USER);
    return stored ? JSON.parse(stored) : null;
  });

  const [empresa, setEmpresa] = useState<Empresa | null>(() => {
    const stored = localStorage.getItem(LS_EMPRESA);
    return stored ? JSON.parse(stored) : null;
  });

  const navigate = useNavigate();

    async function refreshEmpresa(id: number) {
    const { data } = await api.get(`/empresas/${id}`);
    const updated = {
      ...data,
      logo_url: data.logo_url ? `${data.logo_url}?v=${Date.now()}` : data.logo_url,
    };
    setEmpresa(updated);
    return updated;
  }

  useEffect(() => {
    applyTheme(empresa);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    localStorage.setItem(LS_USER, JSON.stringify(usuario));
  }, [usuario]);

  useEffect(() => {
    localStorage.setItem(LS_EMPRESA, JSON.stringify(empresa));
    applyTheme(empresa);
  }, [empresa]);

  async function login(usuarioData: Usuario, empresaData: Empresa) {
    setUsuario(usuarioData);
    setEmpresa(empresaData);
    localStorage.setItem(LS_USER, JSON.stringify(usuarioData));
    localStorage.setItem(LS_EMPRESA, JSON.stringify(empresaData));
    applyTheme(empresaData);
     const full = await refreshEmpresa(empresaData.id);
     applyTheme(full);
  }

  function logout() {
    setUsuario(null);
    setEmpresa(null);
    localStorage.removeItem(LS_USER);
    localStorage.removeItem(LS_EMPRESA);
    applyTheme(null);
    navigate("/login");
  }

  return (
    <AuthContext.Provider value={{ usuario, empresa, login, logout, setEmpresa, refreshEmpresa }}>
      {children}
    </AuthContext.Provider>
  );
}

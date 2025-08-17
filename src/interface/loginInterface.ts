export interface Empresa {
  id: number;
  nombre: string;
  color_primario: string | null;
  color_segundario: string | null;
  logo_url: string | null;
}

export interface Usuario {
  id: number;
  nombre: string;
  correo: string;
  rol: string;
}

export interface AuthContextType {
  usuario: Usuario | null;
  empresa: Empresa | null;
  login: (usuarioData: Usuario, empresaData: Empresa) => void;
  logout: () => void;
  setEmpresa: (e: Empresa) => void;
  refreshEmpresa: (id: number) => Promise<Empresa | null>;
}

export interface ModalAutoCerrarProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  segundos?: number;
}
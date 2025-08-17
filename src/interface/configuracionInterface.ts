export type Empresa = {
  id: number;
  nombre: string;
  correo: string;
  color_primario: string | null;
  color_segundario: string | null; // OJO: con g
  logo_url: string | null;
};

export type Usuario = {
  id: number;
  nombre: string;
  correo: string;
  rol?: string;
  id_empresa: number | null;
  actualizado_en?: string | null;
  // del JOIN (opcionales, por si los usas en UI):
  empresa_nombre?: string;
  logo_url?: string | null;
  color_primario?: string | null;
  color_segundario?: string | null;
};
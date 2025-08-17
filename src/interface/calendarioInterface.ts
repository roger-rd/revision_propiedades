export interface Cita {
  id: number;
  fecha: string;       
  hora: string;          
  direccion: string;
  cliente_nombre: string;
  id_cliente?: number;
  observacion?: string | null;
}

export type Cliente = {
    id: number;
    nombre: string;
    direccion: string;
};

export type AbrirAgendarDetail = {
  id_cliente?: number;
  direccion?: string;
  fecha?: string;
};
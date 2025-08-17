export interface Solicitud {
  id: number;
  direccion: string;
  estado: string;
  cliente: {
    nombre: string;
    rut: string;
  };
}
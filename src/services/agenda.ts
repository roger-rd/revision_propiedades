import api from "./api";

export async function getCitasPorEmpresa(id_empresa: number) {
  const { data } = await api.get(`/agenda/empresa/${id_empresa}`);
  return data;
}

export async function crearCita(payload: {
  id_empresa: number;
  id_cliente: number;
  direccion: string;
  fecha: string;
  hora: string;  
  observacion?: string;
}) {
  const { data } = await api.post(`/agenda`, payload);
  return data;
}

export async function eliminarCita(id: number) {
  const { data } = await api.delete(`/agenda/${id}`);
  return data;
}

export interface Solicitud{
    id: number;
    direccion: string;
    tamano: string;
    estado: string;
    fecha_solicitud:Date
    cliente: {
    id: number;
    nombre: string;
  };
}

export interface ClienteResumen{
  id:number;
  nombre:string;
}

export  interface Observacion {
  id?:number;
  descripcion: string;
  estado: string;
  elemento: string;
  imagen: File | null;
  fotos: {url_foto: string}[];
  modoEdicion: boolean
}

export interface Espacio {
  id?:number
  nombre: string;
  observaciones: Observacion[];
  modoEdicion?:boolean
}

export interface GaleriaImagenesProps{
  imagenes: {url_foto: string}[];
}

export interface SolicitudResumen {
  id?: string;
  direccion: string;
  tamano: string;
  estado: string;
  fecha_solicitud: string;
  id_cliente: number;
  inmobiliaria: string;
  tipo_propiedad: string;
  tipo_inspeccion: string;
  numero_vivienda:string
}

export interface ModalProps {
  visible: boolean;
  onClose: () => void;
  solicitudId: number;
  espacios: Espacio[];
  // setEspacios: (espacios: Espacio[]) => void;
  setEspacios: React.Dispatch<React.SetStateAction<Espacio[]>>;
  onGuardar: () => void;
  onEliminar: () => void
}

export interface ClienteSelectorProps {
  clientes: { id: number; nombre: string }[];
  seleccionado: number | null;
  onChange: (id: number) => void;
}

export interface PropsModalNuevasSolicitud {
  visible: boolean;
  onClose: () => void;
  onCrear: (data: {
    tamano: string;
    estado: string;
    inmobiliaria: string;
    tipo_propiedad: string;
    tipo_inspeccion: string;
  }) => void;
}
export interface PropsEditarSolicitud {
  visible: boolean;
  onClose: () => void;
  solicitud: SolicitudResumen | null;
  onGuardar: (actualizada: SolicitudResumen) => void;
}

export interface ModalEliminarEspacioProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  nombreEspacio?: string;
  tiempo?: number;
}
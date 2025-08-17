export interface Props {
  open: boolean;
  onClose: () => void;                 // cierra el modal
  onConfirm: () => Promise<void> | void; // acción al confirmar (puede ser async)
  titulo?: string;
  mensaje?: string;
  /** Texto a resaltar dentro del mensaje (ej: nombre del cliente/solicitud) */
  resaltar?: string;
  /** Etiquetas de botones */
  confirmText?: string; // default: "Eliminar"
  cancelText?: string;  // default: "Cancelar"
}
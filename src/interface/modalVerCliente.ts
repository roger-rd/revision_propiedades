import { Cliente } from "./clienteInterface";

export interface ModalVerClienteProps {
    cliente: Cliente | null;
    visible: boolean;
    onClose: () => void;
    onEditar: (cliente: Cliente) => void;
    onEliminar: (id: number, id_empresa:number) => void;
    ocultarAcciones?: boolean;
  }
import { useEffect, useRef } from "react";
import { X } from "lucide-react"; // Icono (si ya usas lucide-react, si no lo quitas)

type Props = {
  open: boolean;
  fechaTexto: string;
  onConfirm: () => void; // Agendar
  onView: () => void;    // Ver citas
  onClose?: () => void;
};

export default function ConfirmAgendarModal({ open, fechaTexto, onConfirm, onView, onClose }: Props) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dlg = ref.current;
    if (!dlg) return;
    if (open && !dlg.open) dlg.showModal();
    if (!open && dlg.open) dlg.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      className="rounded-xl p-0 w-[95%] max-w-sm shadow-xl"
      onClose={onClose}
    >
      {/* Header con título y botón de cerrar */}
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="text-lg font-semibold">Confirmar</h3>
        <button
          onClick={onClose}
          className="p-1 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition"
          aria-label="Cerrar"
        >
          <X size={18} />
        </button>
      </div>

      {/* Contenido */}
      <div className="p-4 space-y-4">
        <p className="text-sm">
          ¿Desea agendar una cita para <b>{fechaTexto || "—"}</b>?
        </p>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onView}
            className="px-3 py-2 text-sm rounded bg-gray-100 hover:bg-gray-200"
          >
            Ver citas
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-3 py-2 text-sm rounded bg-primary text-white hover:opacity-90"
          >
            Agendar
          </button>
        </div>
      </div>
    </dialog>
  );
}

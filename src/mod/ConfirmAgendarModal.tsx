import { useEffect, useRef } from "react";

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
    <dialog ref={ref} className="rounded-xl p-0 w-[95%] max-w-sm" onClose={onClose}>
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold">Confirmar</h3>
      </div>
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

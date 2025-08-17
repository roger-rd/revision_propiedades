import { Fragment, useRef, useState } from "react";
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { Props } from "../interface/modalEliminar";



export default function ModalConfirmacionEliminar({
  open,
  onClose,
  onConfirm,
  titulo = "Eliminar registro",
  mensaje = "¿Estás seguro de que quieres eliminar este elemento? Esta acción no se puede deshacer.",
  resaltar,
  confirmText = "Eliminar",
  cancelText = "Cancelar",
}: Props) {
  const [pending, setPending] = useState(false);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  async function handleConfirm() {
    try {
      setPending(true);
      await onConfirm();
      onClose(); // cerrar al terminar ok
    } finally {
      setPending(false);
    }
  }

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        initialFocus={cancelButtonRef}
        onClose={() => {
          if (!pending) onClose(); // bloquear cierre mientras procesa
        }}
      >
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50 transition-opacity" />
        </TransitionChild>

        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="relative transform overflow-hidden rounded-xl bg-white px-6 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <ExclamationTriangleIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <DialogTitle as="h3" className="text-lg font-semibold text-gray-900">
                      {titulo}
                    </DialogTitle>
                    <div className="mt-2">
                      <p className="text-sm text-gray-600">
                        {mensaje} {resaltar && <strong className="text-gray-900">“{resaltar}”</strong>}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 disabled:opacity-60 disabled:cursor-not-allowed sm:ml-3 sm:w-auto"
                    onClick={handleConfirm}
                    disabled={pending}
                  >
                    {pending ? "Eliminando…" : confirmText}
                  </button>
                  <button
                    ref={cancelButtonRef} 
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    onClick={onClose}
                    disabled={pending}
                  >
                    {cancelText}
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

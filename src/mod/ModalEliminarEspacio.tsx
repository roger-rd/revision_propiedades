import { Fragment } from "react";
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from "@headlessui/react";
import { ModalEliminarEspacioProps } from "../interface/solicitudesInterface";

export default function ModalEliminarEspacio({
  visible,
  onClose,
  onConfirm,
  nombreEspacio = "este espacio",

}: ModalEliminarEspacioProps) {

  return (
    <Transition appear show={visible} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-30" />
        </TransitionChild>

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-center align-middle shadow-xl transition-all">
              <DialogTitle as="h3" className="text-lg font-medium text-gray-900 mb-4">
                ¿Estás seguro que deseas eliminar <span className="font-semibold">{nombreEspacio}</span>?
              </DialogTitle>

              <div className="flex justify-center gap-4">
                <button
                  onClick={() => {
                    (document.activeElement as HTMLElement)?.blur();

                    requestAnimationFrame(() => {
                      const principal = document.getElementById("boton-agregar-espacio");
                      if (principal) principal.focus();
                      else document.body.focus();

                      onConfirm(); // cerrar y eliminar al final
                    });
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Sí, eliminar
                </button>
                <button
                  onClick={() => {
                    (document.activeElement as HTMLElement)?.blur();

                    setTimeout(() => {
                      const principal = document.getElementById("boton-agregar-espacio");
                      if (principal) principal.focus();
                    }, 50);

                    onClose(); // Al final
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                >
                  Cancelar
                </button>

              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
}

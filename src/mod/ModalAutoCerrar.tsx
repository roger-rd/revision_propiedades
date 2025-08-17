import { Fragment, useEffect, useState } from "react";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { ModalAutoCerrarProps } from "../interface/loginInterface";



export default function ModalAutoCerrar({
  visible,
  onClose,
  onConfirm,
  segundos = 10,
}: ModalAutoCerrarProps) {
  const [contador, setContador] = useState(segundos);
  const [porcentaje, setPorcentaje] = useState(100);

  useEffect(() => {
    if (!visible) return;

    setContador(segundos);
    setPorcentaje(100);

    const intervalo = setInterval(() => {
      setContador((prev) => {
        if (prev <= 1) {
          clearInterval(intervalo);
          onClose();
          return 0;
        }
        return prev - 1;
      });

      setPorcentaje((prev) => prev - (100 / segundos));
    }, 1000);

    return () => clearInterval(intervalo);
  }, [visible, onClose, segundos]);

  if (!visible) return null;

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
          <div className="fixed inset-0 bg-black bg-opacity-25" />
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
            <DialogPanel className="w-full max-w-sm rounded-lg bg-white p-6 text-center shadow-xl transition-all">
              <DialogTitle className="text-lg font-bold text-gray-900 mb-2">
                ¿Estás todavía?
              </DialogTitle>

              <p className="text-gray-600 mb-4">Este modal se cerrará en {contador} segundos.</p>

              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden mb-4">
                <div
                  className="bg-primary h-full transition-all duration-1000"
                  style={{ width: `${porcentaje}%` }}
                ></div>
              </div>

              <button
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className="bg-primary text-white px-4 py-2 rounded hover:bg-secondary"
              >
                Sí
              </button>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
}

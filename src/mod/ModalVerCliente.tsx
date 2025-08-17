import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from "@headlessui/react";
import { Fragment, useState } from "react";
import { ModalVerClienteProps } from "../interface/modalVerCliente";
import ModalConfirmacionEliminar from "./ModalConfirmacionEliminar";

export default function ModalVerCliente({
  cliente,
  visible,
  onClose,
  onEditar,
  onEliminar,
  ocultarAcciones = false,
}: ModalVerClienteProps) {
  const [openEliminar, setOpenEliminar] = useState(false);

  if (!cliente) return null;

  // URL gratuita de Google Maps
  const mapUrl = `https://www.google.com/maps?q=${cliente.latitud},${cliente.longitud}&z=16&output=embed`;

  const handleEliminar = () => {
    if (cliente?.id && cliente?.id_empresa) {
      onEliminar(cliente.id, cliente.id_empresa);
    } else {
      console.error("Faltan datos para eliminar el cliente");
    }
  };

  return (
    <>
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

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <TransitionChild
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <DialogPanel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <DialogTitle className="text-lg font-bold text-primary mb-4">
                    Información del cliente
                  </DialogTitle>

                  <div className="space-y-2 text-sm">
                    <p><strong>Nombre:</strong> {cliente.nombre}</p>
                    <p><strong>RUT:</strong> {cliente.rut}</p>
                    <p><strong>Correo:</strong> {cliente.correo}</p>
                    <p><strong>Teléfono:</strong> {cliente.telefono}</p>
                    <p><strong>Dirección:</strong> {cliente.direccion}</p>
                    <p><strong>Casa/Dpto/Bloque:</strong> {cliente.numero_vivienda}</p>
                  </div>

                  <div className="mt-4">
                    <iframe
                      className="w-full h-64 rounded"
                      loading="lazy"
                      allowFullScreen
                      referrerPolicy="no-referrer-when-downgrade"
                      src={mapUrl}
                    ></iframe>
                  </div>

                  {!ocultarAcciones && (
                    <div className="flex justify-end gap-2 mt-4">
                      <button
                        onClick={() => onEditar(cliente!)}
                        className="bg-blue-600 text-white px-4 py-2 rounded"
                      >
                        Editar
                      </button>
                      {/* <button
                        onClick={(e) => {
                          (e.currentTarget as HTMLButtonElement).blur();
                          // Abre en el siguiente frame para que Headless UI ajuste aria-hidden/inert
                          requestAnimationFrame(() => setOpenEliminar(true));
                        }}
                        className="bg-red-600 text-white px-4 py-2 rounded"
                      >
                        Eliminar
                      </button> */}

                      <button
                        onClick={(e) => {
                          if (cliente?.id && cliente?.id_empresa) {
                            // Evita el warning A11y con diálogos anidados:
                            (e.currentTarget as HTMLButtonElement).blur();
                            requestAnimationFrame(() => {
                              onEliminar(cliente.id, cliente.id_empresa);
                            });
                          } else {
                            console.error("Faltan datos para eliminar el cliente");
                          }
                        }}
                        className="bg-red-600 text-white px-4 py-2 rounded"
                      >
                        Eliminar
                      </button>

                    </div>
                  )}

                  <div className="mt-4 text-right">
                    <button
                      onClick={onClose}
                      className="text-sm text-gray-500 hover:underline"
                    >
                      Cerrar
                    </button>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Modal de confirmación reutilizado */}
      <ModalConfirmacionEliminar
        open={openEliminar}
        onClose={() => setOpenEliminar(false)}
        onConfirm={handleEliminar}
        titulo="Eliminar cliente"
        mensaje="¿Estás seguro de que deseas eliminar este cliente? Esta acción no se puede deshacer."
      />
    </>
  );
}

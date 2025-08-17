import { Dialog, DialogPanel, DialogTitle, ListboxButton, ListboxOption, ListboxOptions, Transition, TransitionChild } from "@headlessui/react";
import { Fragment, useState } from "react";
import { PropsModalNuevasSolicitud } from "../interface/solicitudesInterface";
import { Listbox } from "@headlessui/react"
import { ChevronsUpDown, Check } from "lucide-react"


export default function ModalNuevaSolicitud({ visible, onClose, onCrear }: PropsModalNuevasSolicitud) {
  const [form, setForm] = useState({
    direccion: "",
    tamano: "",
    estado: "Pendiente",
    inmobiliaria: "",
    tipo_propiedad: "Casa",
    tipo_inspeccion: "Entrega Final",
  });
  const estados = ["Pendiente", "Realizado", "Persiste"];
  const propiedad = ["Casa", "Departamento", "Oficina"];
  const revision = ["Entrega", "Segunda Revision"];



  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCrear(form);
    onClose();
    setForm({
      direccion: "",
      tamano: "",
      estado: "Pendiente",
      inmobiliaria: "",
      tipo_propiedad: "Casa",
      tipo_inspeccion: "Entrega Final",
    });
  };

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
            <DialogPanel className="w-full max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-3xl xl:max-w-4xl transform overflow-y-auto rounded-xl bg-white p-4 text-left align-middle shadow-xl transition-all max-h-[99vh]">
              <DialogTitle className="text-lg font-bold text-primary mb-4">
                Nueva Solicitud
              </DialogTitle>

              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  name="direccion"
                  value={form.direccion}
                  onChange={handleChange}
                  placeholder="Direccion de Propiedad"
                  required
                  className="input"
                />
                <input
                  type="text"
                  name="tamano"
                  value={form.tamano}
                  onChange={handleChange}
                  placeholder="Tamaño (ej: 100 m2)"
                  required
                  className="input"
                />
                <input
                  type="text"
                  name="inmobiliaria"
                  value={form.inmobiliaria}
                  onChange={handleChange}
                  placeholder="Inmobiliaria"
                  required
                  className="input"
                />
                <Listbox value={form.tipo_inspeccion} onChange={(value) => setForm({ ...form, tipo_inspeccion: value })}>
                  <div className="relative mb-4">
                    <ListboxButton className="w-full border border-gray-300 rounded px-4 py-2 text-left bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary text-sm">
                      <span>{form.tipo_inspeccion || "Seleccionar tipo_inspeccion"}</span>
                      <span className="absolute inset-y-0 right-0 flex items-center pr-3">
                        <ChevronsUpDown className="w-4 h-4 text-gray-400" />
                      </span>
                    </ListboxButton>
                    <ListboxOptions className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded shadow-lg max-h-60 overflow-auto text-sm">
                      {revision.map((revision) => (
                        <ListboxOption
                          key={revision}
                          value={revision}
                          className={({ active }) =>
                            `cursor-pointer select-none px-4 py-2 ${active ? 'bg-primary text-white' : 'text-gray-900'}`
                          }
                        >
                          {({ selected }) => (
                            <div className="flex justify-between items-center">
                              <span className={selected ? 'font-medium' : 'font-normal'}>
                                {revision.charAt(0).toUpperCase() + revision.slice(1)}
                              </span>
                              {selected && <Check className="w-4 h-4 text-white" />}
                            </div>
                          )}
                        </ListboxOption>
                      ))}
                    </ListboxOptions>
                  </div>
                </Listbox>

                <Listbox value={form.tipo_propiedad} onChange={(value) => setForm({ ...form, tipo_propiedad: value })}>
                  <div className="relative mb-4">
                    <ListboxButton className="w-full border border-gray-300 rounded px-4 py-2 text-left bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary text-sm">
                      <span>{form.tipo_propiedad || "Seleccionar tipo_propiedad"}</span>
                      <span className="absolute inset-y-0 right-0 flex items-center pr-3">
                        <ChevronsUpDown className="w-4 h-4 text-gray-400" />
                      </span>
                    </ListboxButton>
                    <ListboxOptions className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded shadow-lg max-h-60 overflow-auto text-sm">
                      {propiedad.map((propiedad) => (
                        <ListboxOption
                          key={propiedad}
                          value={propiedad}
                          className={({ active }) =>
                            `cursor-pointer select-none px-4 py-2 ${active ? 'bg-primary text-white' : 'text-gray-900'}`
                          }
                        >
                          {({ selected }) => (
                            <div className="flex justify-between items-center">
                              <span className={selected ? 'font-medium' : 'font-normal'}>
                                {propiedad.charAt(0).toUpperCase() + propiedad.slice(1)}
                              </span>
                              {selected && <Check className="w-4 h-4 text-white" />}
                            </div>
                          )}
                        </ListboxOption>
                      ))}
                    </ListboxOptions>
                  </div>
                </Listbox>

                <Listbox value={form.estado} onChange={(value) => setForm({ ...form, estado: value })}>
                  <div className="relative mb-4">
                    <ListboxButton className="w-full border border-gray-300 rounded px-4 py-2 text-left bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary text-sm">
                      <span>{form.estado || "Seleccionar estado"}</span>
                      <span className="absolute inset-y-0 right-0 flex items-center pr-3">
                        <ChevronsUpDown className="w-4 h-4 text-gray-400" />
                      </span>
                    </ListboxButton>
                    <ListboxOptions className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded shadow-lg max-h-60 overflow-auto text-sm">
                      {estados.map((estado) => (
                        <ListboxOption
                          key={estado}
                          value={estado}
                          className={({ active }) =>
                            `cursor-pointer select-none px-4 py-2 ${active ? 'bg-primary text-white' : 'text-gray-900'}`
                          }
                        >
                          {({ selected }) => (
                            <div className="flex justify-between items-center">
                              <span className={selected ? 'font-medium' : 'font-normal'}>
                                {estado.charAt(0).toUpperCase() + estado.slice(1)}
                              </span>
                              {selected && <Check className="w-4 h-4 text-white" />}
                            </div>
                          )}
                        </ListboxOption>
                      ))}
                    </ListboxOptions>
                  </div>
                </Listbox>

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="text-gray-500 hover:underline"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="bg-primary text-white px-4 py-2 rounded hover:bg-secondary"
                  >
                    Crear solicitud
                  </button>
                </div>
              </form>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
}

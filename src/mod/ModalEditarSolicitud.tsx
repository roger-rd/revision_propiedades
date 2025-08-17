import { Dialog, DialogPanel, DialogTitle, ListboxButton, ListboxOption, ListboxOptions, Transition, TransitionChild } from "@headlessui/react";
import { Fragment, useState, useEffect } from "react";
import { PropsEditarSolicitud } from "../interface/solicitudesInterface";
import { Listbox } from "@headlessui/react"
import { ChevronsUpDown, Check } from "lucide-react"
import api from "../services/api";
import { showToast } from "../utils/toast";


const estados = ["pendiente", "realizado", "persiste"];
const propiedad = ["Casa", "Departamento", "Oficina"];
const revision = ["entrega", "segunda revision"];

export default function ModalEditarSolicitud({ visible, onClose, solicitud, onGuardar }: PropsEditarSolicitud) {
    const [form, setForm] = useState({
        tamano: "",
        inmobiliaria: "",
        tipo_propiedad: "casa",
        tipo_inspeccion: "entrega",
        estado: "pendiente",
    });

    useEffect(() => {
        if (solicitud) {
            setForm({
                tamano: solicitud.tamano || "",
                inmobiliaria: solicitud.inmobiliaria || "",
                tipo_propiedad: solicitud.tipo_propiedad || "casa",
                tipo_inspeccion: solicitud.tipo_inspeccion || "entrega",
                estado: solicitud.estado || "pendiente",
            });
        }
    }, [solicitud]);

    const handleChange = (key: string, value: string) => {
        setForm(prev => ({ ...prev, [key]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!solicitud) return;

        try {
            await api.put(`/solicitudes/${solicitud.id}`, {
                ...form,
                direccion:solicitud.direccion
            });
                onGuardar({ ...solicitud, ...form });
                onClose();
        } catch (error) {
            console.error("Error:", error);
            showToast("❌ Error de red al actualizar solicitud","error");
        }
    };

    if (!solicitud) return null;

    const renderListbox = (label: string, value: string, options: string[], key: keyof typeof form) => (
        <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-700 font-semibold">{label}</label>
            <Listbox value={value} onChange={(val) => handleChange(key, val)}>
                <div className="relative">
                    <ListboxButton className="w-full border border-gray-300 rounded px-4 py-2 text-left bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary text-sm">
                        <span>{value}</span>
                        <span className="absolute inset-y-0 right-0 flex items-center pr-3">
                            <ChevronsUpDown className="w-4 h-4 text-gray-400" />
                        </span>
                    </ListboxButton>
                    <ListboxOptions className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded shadow-lg max-h-60 overflow-auto text-sm">
                        {options.map((opt) => (
                            <ListboxOption
                                key={opt}
                                value={opt}
                                className={({ active }) =>
                                    `cursor-pointer select-none px-4 py-2 ${active ? 'bg-primary text-white' : 'text-gray-900'}`
                                }
                            >
                                {({ selected }) => (
                                    <div className="flex justify-between items-center">
                                        <span className={selected ? 'font-medium' : 'font-normal'}>
                                            {opt.charAt(0).toUpperCase() + opt.slice(1)}
                                        </span>
                                        {selected && <Check className="w-4 h-4 text-white" />}
                                    </div>
                                )}
                            </ListboxOption>
                        ))}
                    </ListboxOptions>
                </div>
            </Listbox>
        </div>
    );

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
                        <DialogPanel className="w-full max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-3xl xl:max-w-4xl transform overflow-y-auto rounded-xl bg-white p-4 text-left align-middle shadow-xl transition-all max-h-[95vh]">

                            <DialogTitle className="text-lg font-bold text-primary mb-4">
                                Editar Solicitud #{solicitud.id}
                            </DialogTitle>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <input
                                    type="text"
                                    value={solicitud.direccion}
                                    disabled
                                    className="input bg-gray-100 text-gray-600 cursor-not-allowed"
                                />
                                <input
                                    type="text"
                                    name="tamano"
                                    value={form.tamano}
                                    onChange={(e) => handleChange("tamano", e.target.value)}
                                    placeholder="Tamaño"
                                    required
                                    className="input"
                                />
                                <input
                                    type="text"
                                    name="inmobiliaria"
                                    value={form.inmobiliaria}
                                    onChange={(e) => handleChange("inmobiliaria", e.target.value)}
                                    placeholder="Inmobiliaria"
                                    required
                                    className="input"
                                />

                                {renderListbox("Tipo de propiedad", form.tipo_propiedad, propiedad, "tipo_propiedad")}
                                {renderListbox("Tipo de inspección", form.tipo_inspeccion, revision, "tipo_inspeccion")}
                                {renderListbox("Estado", form.estado, estados, "estado")}

                                <div className="flex justify-end gap-3 mt-4">
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
                                        Guardar cambios
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

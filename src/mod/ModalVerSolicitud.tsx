/* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { ChangeEvent, Fragment, useState } from "react";
// import {
//   Dialog,
//   DialogPanel,
//   DialogTitle,
//   Transition,
//   TransitionChild,
//   Listbox,
//   ListboxButton,
//   ListboxOption,
//   ListboxOptions,
// } from "@headlessui/react";
// import { ChevronsUpDown, Check, ChevronUp, ChevronDown } from "lucide-react";
// import GaleriaImagenes from "../components/GaleriaImagenes";
// import { ModalProps } from "../interface/solicitudesInterface";
// import { showToast } from "../utils/toast";
// import api from "../services/api";
// import ModalConfirmacionEliminar from "../mod/ModalConfirmacionEliminar";

// export default function ModalVerSolicitud({
//   visible,
//   onClose,
//   solicitudId,
//   espacios,
//   setEspacios,
//   onEliminar,
// }: ModalProps) {
//   const [espacioAbierto, setEspacioAbierto] = useState<number | null>(null);
//   const [espacioAEliminar, setEspacioAEliminar] = useState<number | null>(null);
//   const [openEliminarSolicitud, setOpenEliminarSolicitud] = useState(false);
//   const [observacionAEliminar, setObservacionAEliminar] = useState<{
//     espacioIndex: number;
//     obsIndex: number;
//   } | null>(null);

//   const [loadingObservacion, setLoadingObservacion] = useState(false);

//   if (!visible) return null;

//   type CampoTexto = "descripcion" | "estado" | "elemento";
//   const estados = ["pendiente", "realizado", "persiste"] as const;

//   /* ------------ UI helpers ------------ */
//   const toggleAcordeon = (index: number) => {
//     setEspacioAbierto((prev) => (prev === index ? null : index));
//   };

//   /* ------------ Espacios ------------ */
//   const agregarEspacio = async () => {
//     try {
//       const { data: nuevo } = await api.post("/espacios", {
//         id_solicitud: solicitudId,
//         nombre: "",
//       });
//       if (!nuevo?.id) throw new Error("No se pudo crear el espacio");

//       setEspacios((prev) => [
//         ...prev,
//         { id: nuevo.id, nombre: nuevo.nombre, observaciones: [], modoEdicion: true },
//       ]);
//       showToast("✅ Espacio creado", "success");
//     } catch (error) {
//       console.error("Error al crear espacio:", error);
//       showToast("❌ Error al crear espacio", "error");
//     }
//   };

//   const handleCambioNombreEspacio = (index: number, nuevoNombre: string) => {
//     const copia = [...espacios];
//     copia[index].nombre = nuevoNombre;
//     setEspacios(copia);
//   };

//   const guardarOEditarEspacio = async (index: number) => {
//     const espacio = espacios[index];
//     const nombre = (espacio.nombre || "").trim();

//     // Toggle a edición
//     if (!espacio.modoEdicion) {
//       const copia = [...espacios];
//       copia[index].modoEdicion = true;
//       setEspacios(copia);
//       return;
//     }

//     if (!nombre) {
//       showToast("❌ El nombre del espacio no puede estar vacío", "error");
//       return;
//     }

//     try {
//       await api.put(`/espacios/${espacio.id}`, { nombre });
//       const copia = [...espacios];
//       copia[index].modoEdicion = false;
//       setEspacios(copia);
//       showToast("✅ Espacio actualizado", "success");
//     } catch (error) {
//       console.error(error);
//       showToast("❌ Error al actualizar el espacio", "error");
//     }
//   };

//   const confirmarEliminarEspacio = async () => {
//     if (espacioAEliminar === null) return;
//     const idx = espacioAEliminar;
//     const espacio = espacios[idx];
//     if (!espacio?.id) {
//       showToast("❌ Espacio ya no existe", "error");
//       setEspacioAEliminar(null);
//       return;
//     }

//     try {
//       await api.delete(`/espacios/${espacio.id}`);
//       const copia = [...espacios];
//       copia.splice(idx, 1);
//       setEspacios(copia);
//       showToast("✅ Espacio eliminado", "success");
//     } catch (error) {
//       console.error(error);
//       showToast("❌ Error al eliminar espacio", "error");
//     } finally {
//       setEspacioAEliminar(null);
//     }
//   };

//   /* ------------ Observaciones ------------ */
//   const agregarObservacion = (index: number) => {
//     const copia = [...espacios];
//     copia[index].observaciones.push({
//       id: undefined,
//       descripcion: "",
//       estado: "pendiente",
//       imagen: null,
//       fotos: [],
//       elemento: "",
//       modoEdicion: true,
//     });
//     setEspacios(copia);
//   };

//   const handleObservacionChange = (
//     espacioIndex: number,
//     obsIndex: number,
//     campo: CampoTexto | "imagen",
//     valor: string | File | null
//   ) => {
//     const copia = [...espacios];
//     const obs = copia[espacioIndex].observaciones[obsIndex];

//     if (campo === "imagen" && (valor === null || valor instanceof File)) {
//       obs.imagen = valor;
//     } else if (typeof valor === "string") {
//       if (campo === "descripcion") obs.descripcion = valor;
//       if (campo === "estado") obs.estado = valor;
//       if (campo === "elemento") obs.elemento = valor;
//     }
//     setEspacios(copia);
//   };

//   const toggleModoEdicion = (espacioIndex: number, obsIndex: number) => {
//     const copia = [...espacios];
//     const obs = copia[espacioIndex].observaciones[obsIndex];
//     obs.modoEdicion = !obs.modoEdicion;
//     setEspacios(copia);
//   };

//   // 👉 Nuevo: eliminar foto ya persistida (llama al back y actualiza estado)
//   const eliminarFotoPersistida = async (espacioIndex: number, obsIndex: number, fotoIndex: number) => {
//     const foto: any = espacios[espacioIndex]?.observaciones[obsIndex]?.fotos[fotoIndex];
//     if (!foto) return;

//     const fotoId =
//       foto?.id ??
//       foto?.id_foto ??
//       foto?.foto_id ??
//       foto?.id_fotos_observacion ??
//       null;

//     const ok = window.confirm("¿Eliminar esta foto definitivamente?");
//     if (!ok) return;

//     try {
//       if (fotoId) {
//         await api.delete(`/fotos-observacion/${fotoId}`);
//       } else if (foto?.url_foto) {
//         await api.delete(`/fotos-observacion/by-url`, {
//           data: { url_foto: foto.url_foto },
//           headers: { 'Content-Type': 'application/json' },
//         });
//       } else {
//         showToast("❌ No se encontró el ID/URL de la foto", "error");
//         return;
//       }
//     } catch (err: any) {
//       // Fallback si /:id falló con 500
//       if (foto?.url_foto) {
//         try {
//           await api.delete(`/fotos-observacion/by-url`, {
//             data: { url_foto: foto.url_foto },
//             headers: { 'Content-Type': 'application/json' },
//           });
//         } catch (e) {
//           console.error(e);
//           showToast("❌ Error al eliminar foto", "error");
//           return;
//         }
//       } else {
//         console.error(err);
//         showToast("❌ Error al eliminar foto", "error");
//         return;
//       }
//     }

//     // Quita de UI
//     setEspacios((prev) => {
//       const copia = [...prev];
//       copia[espacioIndex].observaciones[obsIndex].fotos.splice(fotoIndex, 1);
//       return copia;
//     });
//     showToast("🗑️ Foto eliminada", "success");
//   };


//   const guardarOEditarObservacion = async (espacioIndex: number, obsIndex: number) => {
//     const obsActual = espacios[espacioIndex].observaciones[obsIndex];

//     // Toggle a edición si está cerrada
//     if (!obsActual.modoEdicion) {
//       toggleModoEdicion(espacioIndex, obsIndex);
//       return;
//     }

//     setLoadingObservacion(true);

//     const descripcion = (obsActual.descripcion || "").trim();
//     const elemento = (obsActual.elemento || "").trim();
//     if (!descripcion || !elemento) {
//       showToast("❌ No se permite guardar con campos vacíos", "error");
//       setLoadingObservacion(false);
//       return;
//     }

//     try {
//       const esNueva = !obsActual.id;
//       const payload = {
//         id_espacio: espacios[espacioIndex].id,
//         descripcion,
//         estado: obsActual.estado,
//         elemento,
//       };

//       const { data } = esNueva
//         ? await api.post("/observaciones", payload)
//         : await api.put(`/observaciones/${obsActual.id}`, payload);

//       // Si es nueva, setear el id devuelto
//       if (esNueva && data?.id) {
//         const copia = [...espacios];
//         copia[espacioIndex].observaciones[obsIndex].id = data.id;
//         setEspacios(copia);
//       }

//       // Subir imagen si existe y ya hay id
//       if (obsActual.imagen instanceof File && (obsActual.id || (data && data.id))) {
//         const obsId = obsActual.id || data.id;

//         // Máximo 2 fotos
//         if (obsActual.fotos.length >= 2) {
//           showToast("⚠️ Solo puedes subir hasta 2 fotos por observación", "warning");
//           setLoadingObservacion(false);
//           return;
//         }

//         const formData = new FormData();
//         formData.append("file", obsActual.imagen);
//         formData.append("id_observacion", String(obsId));

//         try {
//           const res = await api.post("/fotos-observacion/archivo", formData, {
            
//             headers: { "Content-Type": "multipart/form-data" },
            
//           });

//           console.log("UP FOTO RES ===>", res.data);

//          const copia = [...espacios];
//           copia[espacioIndex].observaciones[obsIndex].fotos.push({
//             // intenta varias claves comunes por si el back devuelve otro nombre
//             id: res?.data?.id ?? res?.data?.foto?.id ?? res?.data?.id_foto ?? res?.data?.foto_id,
//             url_foto: res?.data?.url_foto ?? res?.data?.foto?.url_foto,
//             id_public: res?.data?.id_public ?? res?.data?.foto?.id_public,
//           });
//           copia[espacioIndex].observaciones[obsIndex].imagen = null;
//           setEspacios(copia);

//           showToast("✅ Imagen subida", "success");
//         } catch (err) {
//           console.error("Error al subir imagen:", err);
//           showToast("❌ Error al subir imagen", "error");
//         }
//       }

//       showToast(esNueva ? "✅ Observación creada" : "✅ Observación actualizada", "success");
//     } catch (error) {
//       console.error(error);
//       showToast("❌ Error al guardar observación", "error");
//     }

//     setLoadingObservacion(false);
//     toggleModoEdicion(espacioIndex, obsIndex);
//   };

//   // Abre el modal de confirmación para eliminar una observación
//   const abrirEliminarObservacion = (espacioIndex: number, obsIndex: number, e?: React.MouseEvent) => {
//     (e?.currentTarget as HTMLButtonElement | undefined)?.blur();
//     requestAnimationFrame(() => setObservacionAEliminar({ espacioIndex, obsIndex }));
//   };

//   // Confirmación de eliminar observación (con API si tiene id, o solo front)
//   const confirmarEliminarObservacion = async () => {
//     if (!observacionAEliminar) return;
//     const { espacioIndex, obsIndex } = observacionAEliminar;
//     const obs = espacios[espacioIndex]?.observaciones[obsIndex];
//     if (!obs) {
//       setObservacionAEliminar(null);
//       return;
//     }

//     try {
//       if (obs.id) {
//         await api.delete(`/observaciones/${obs.id}`);
//       }
//       setEspacios((prev) => {
//         const copia = [...prev];
//         copia[espacioIndex].observaciones.splice(obsIndex, 1);
//         return copia;
//       });
//       showToast("✅ Observación eliminada", "success");
//     } catch (err) {
//       console.error(err);
//       showToast("❌ Error al eliminar observación", "error");
//     } finally {
//       setObservacionAEliminar(null);
//     }
//   };

//   return (
//     <>
//       <Transition appear show={visible} as={Fragment}>
//         <Dialog as="div" className="relative z-50" onClose={onClose}>
//           <TransitionChild
//             as={Fragment}
//             enter="ease-out duration-300"
//             enterFrom="opacity-0"
//             enterTo="opacity-100"
//             leave="ease-in duration-200"
//             leaveFrom="opacity-100"
//             leaveTo="opacity-0"
//           >
//             <div className="fixed inset-0 bg-black bg-opacity-25" />
//           </TransitionChild>

//           <div className="fixed inset-0 flex items-center justify-center p-2">
//             <TransitionChild
//               as={Fragment}
//               enter="ease-out duration-300"
//               enterFrom="opacity-0 scale-95"
//               enterTo="opacity-100 scale-100"
//               leave="ease-in duration-200"
//               leaveFrom="opacity-100 scale-100"
//               leaveTo="opacity-0 scale-95"
//             >
//               <DialogPanel className="w-full max-w-xl transform overflow-y-auto rounded-xl bg-white p-4 shadow-xl transition-all max-h-[95vh]">
//                 <DialogTitle className="text-lg font-semibold text-primary mb-3">
//                   Solicitud
//                 </DialogTitle>

//                 {/* Lista de ESPACIOS */}
//                 {espacios.map((espacio, i) => (
//                   <div key={i} className="mb-4 border rounded">
//                     <button
//                       type="button"
//                       className="w-full flex justify-between items-center p-3 bg-gray-100 hover:bg-gray-200 text-left"
//                       onClick={() => toggleAcordeon(i)}
//                     >
//                       <span className="font-medium">
//                         {espacio.nombre || `Espacio #${i + 1}`}
//                       </span>
//                       {espacioAbierto === i ? (
//                         <ChevronUp className="w-4 h-4" />
//                       ) : (
//                         <ChevronDown className="w-4 h-4" />
//                       )}
//                     </button>

//                     {espacioAbierto === i && (
//                       <div className="p-3 border-t">
//                         <input
//                           type="text"
//                           value={espacio.nombre}
//                           onChange={(e) => handleCambioNombreEspacio(i, e.target.value)}
//                           className="w-full p-2 border rounded mb-3 text-sm"
//                           placeholder="Nombre del espacio"
//                           disabled={!espacio.modoEdicion}
//                         />

//                         <div className="flex gap-2 mb-3">
//                           <button
//                             onClick={() => guardarOEditarEspacio(i)}
//                             className={`${
//                               espacio.modoEdicion
//                                 ? "bg-green-600 hover:bg-green-700"
//                                 : "bg-yellow-500 hover:bg-yellow-600"
//                             } text-white px-4 py-1 rounded text-sm`}
//                           >
//                             {espacio.modoEdicion ? "💾 Guardar nombre" : "✏️ Editar"}
//                           </button>
//                         </div>

//                         {/* Observaciones */}
//                         {espacio.observaciones.map((obs, j) => (
//                           <div key={j} className="bg-gray-50 border p-2 rounded mb-2">
//                             <input
//                               type="text"
//                               value={obs.elemento}
//                               onChange={(e) => handleObservacionChange(i, j, "elemento", e.target.value)}
//                               placeholder="Elemento observado"
//                               disabled={!obs.modoEdicion}
//                               className="w-full p-2 border rounded mb-2 text-sm"
//                             />

//                             <textarea
//                               value={obs.descripcion}
//                               onChange={(e) => handleObservacionChange(i, j, "descripcion", e.target.value)}
//                               placeholder="Descripción"
//                               disabled={!obs.modoEdicion}
//                               className="w-full p-2 border rounded mb-2 text-sm"
//                             />

//                             <Listbox
//                               value={obs.estado}
//                               onChange={(value) => handleObservacionChange(i, j, "estado", value)}
//                               disabled={!obs.modoEdicion}
//                             >
//                               <div className="relative mb-2">
//                                 <ListboxButton
//                                   className={`w-full border rounded px-4 py-2 text-left text-sm ${
//                                     obs.modoEdicion ? "bg-white" : "bg-gray-100 text-gray-500"
//                                   }`}
//                                 >
//                                   <span className="capitalize">{obs.estado}</span>
//                                   <span className="absolute inset-y-0 right-0 flex items-center pr-3">
//                                     <ChevronsUpDown className="w-4 h-4 text-gray-400" />
//                                   </span>
//                                 </ListboxButton>
//                                 <ListboxOptions className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded shadow-lg max-h-60 overflow-auto text-sm">
//                                   {estados.map((estado) => (
//                                     <ListboxOption
//                                       key={estado}
//                                       value={estado}
//                                       className={({ active }) =>
//                                         `cursor-pointer select-none px-4 py-2 ${
//                                           active ? "bg-primary text-white" : "text-gray-900"
//                                         }`
//                                       }
//                                     >
//                                       {({ selected }) => (
//                                         <div className="flex justify-between items-center">
//                                           <span className={selected ? "font-medium" : "font-normal"}>{estado}</span>
//                                           {selected && <Check className="w-4 h-4 text-white" />}
//                                         </div>
//                                       )}
//                                     </ListboxOption>
//                                   ))}
//                                 </ListboxOptions>
//                               </div>
//                             </Listbox>

//                             <label className="block bg-gray-200 text-gray-700 text-center py-2 px-3 rounded cursor-pointer mb-2 text-sm">
//                               📷 Subir imagen
//                               <input
//                                 type="file"
//                                 accept="image/*"
//                                 onChange={(e: ChangeEvent<HTMLInputElement>) =>
//                                   handleObservacionChange(i, j, "imagen", e.target.files?.[0] || null)
//                                 }
//                                 disabled={!obs.modoEdicion}
//                                 className="hidden"
//                               />
//                             </label>

//                             {obs.imagen && (
//                               <div className="relative w-fit">
//                                 <img
//                                   src={URL.createObjectURL(obs.imagen)}
//                                   alt="preview"
//                                   className="w-24 h-24 object-cover rounded border"
//                                 />
//                                 <button
//                                   onClick={() => handleObservacionChange(i, j, "imagen", null)}
//                                   className="absolute top-0 right-0 bg-black/60 text-white rounded-full px-2 py-0.5 text-xs hover:bg-red-600"
//                                 >
//                                   ❌
//                                 </button>
//                               </div>
//                             )}

//                             {/* 👇 Ahora la galería muestra la “X” SOLO cuando está en modo edición */}
//                             <GaleriaImagenes
//                               imagenes={obs.fotos}
//                               editable={obs.modoEdicion}
//                               onDelete={(fotoIndex) => eliminarFotoPersistida(i, j, fotoIndex)}
//                             />

//                             <div className="flex gap-2 mt-2">
//                               <button
//                                 onClick={() => guardarOEditarObservacion(i, j)}
//                                 disabled={loadingObservacion}
//                                 className={`${
//                                   obs.modoEdicion ? "bg-green-600 hover:bg-green-700" : "bg-yellow-500 hover:bg-yellow-600"
//                                 } text-white px-2 py-1 rounded text-sm ${loadingObservacion ? "opacity-60 cursor-not-allowed" : ""}`}
//                               >
//                                 {loadingObservacion ? "Guardando..." : obs.modoEdicion ? "💾 Guardar" : "✏️ Editar"}
//                               </button>

//                               <button
//                                 onClick={(e) => abrirEliminarObservacion(i, j, e)}
//                                 disabled={loadingObservacion}
//                                 className="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600"
//                               >
//                                 🗑️ Eliminar
//                               </button>
//                             </div>
//                           </div>
//                         ))}

//                         <button
//                           onClick={() => agregarObservacion(i)}
//                           className="bg-secondary text-white px-3 py-1 rounded hover:bg-primary text-sm mt-2 w-full"
//                         >
//                           + Agregar observación
//                         </button>

//                         <button
//                           onClick={() => setEspacioAEliminar(i)}
//                           className="mt-2 w-full bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
//                         >
//                           🗑️ Eliminar espacio
//                         </button>
//                       </div>
//                     )}
//                   </div>
//                 ))}

//                 {/* Acciones finales */}
//                 <div className="flex flex-col sm:flex-row justify-between gap-2 mt-4">
//                   <button
//                     id="boton-agregar-espacio"
//                     onClick={agregarEspacio}
//                     className="bg-primary text-white w-full sm:w-auto px-4 py-2 rounded hover:bg-secondary"
//                   >
//                     + Agregar espacio
//                   </button>
//                   <button
//                     onClick={(e) => {
//                       (e.currentTarget as HTMLButtonElement).blur();
//                       requestAnimationFrame(() => setOpenEliminarSolicitud(true));
//                     }}
//                     className="bg-red-700 text-white w-full sm:w-auto px-4 py-2 rounded hover:bg-red-800"
//                   >
//                     🗑 Eliminar solicitud
//                   </button>
//                 </div>

//                 <div className="mt-4 text-right">
//                   <button onClick={onClose} className="text-sm text-gray-500 hover:underline">
//                     Cerrar
//                   </button>
//                 </div>
//               </DialogPanel>
//             </TransitionChild>
//           </div>
//         </Dialog>
//       </Transition>

//       {/* Modal eliminar ESPACIO */}
//       <ModalConfirmacionEliminar
//         open={espacioAEliminar !== null}
//         onClose={() => setEspacioAEliminar(null)}
//         onConfirm={confirmarEliminarEspacio}
//         titulo="Eliminar espacio"
//         mensaje="¿Seguro que deseas eliminar este espacio?"
//         confirmText="Eliminar espacio"
//       />

//       {/* Modal eliminar SOLICITUD */}
//       <ModalConfirmacionEliminar
//         open={openEliminarSolicitud}
//         onClose={() => setOpenEliminarSolicitud(false)}
//         onConfirm={onEliminar}
//         titulo="Eliminar solicitud"
//         mensaje="¿Seguro que deseas eliminar esta solicitud?"
//         confirmText="Eliminar solicitud"
//       />

//       {/* Modal eliminar OBSERVACIÓN */}
//       <ModalConfirmacionEliminar
//         open={observacionAEliminar !== null}
//         onClose={() => setObservacionAEliminar(null)}
//         onConfirm={confirmarEliminarObservacion}
//         titulo="Eliminar observación"
//         mensaje="¿Seguro que deseas eliminar esta observación?"
//         confirmText="Eliminar observación"
//       />
//     </>
//   );
// }

import { ChangeEvent, Fragment, useState } from "react";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { ChevronsUpDown, Check, ChevronUp, ChevronDown } from "lucide-react";
import GaleriaImagenes from "../components/GaleriaImagenes";
import { ModalProps } from "../interface/solicitudesInterface";
import { showToast } from "../utils/toast";
import api from "../services/api";
import ModalConfirmacionEliminar from "../mod/ModalConfirmacionEliminar";

export default function ModalVerSolicitud({
  visible,
  onClose,
  solicitudId,
  espacios,
  setEspacios,
  onEliminar,
}: ModalProps) {
  const [espacioAbierto, setEspacioAbierto] = useState<number | null>(null);
  const [espacioAEliminar, setEspacioAEliminar] = useState<number | null>(null);
  const [openEliminarSolicitud, setOpenEliminarSolicitud] = useState(false);
  const [observacionAEliminar, setObservacionAEliminar] = useState<{ espacioIndex: number; obsIndex: number } | null>(null);

  // 👇 NUEVO: estado para confirmar eliminación de FOTO
  const [fotoAEliminar, setFotoAEliminar] = useState<{ espacioIndex: number; obsIndex: number; fotoIndex: number } | null>(null);

  const [loadingObservacion, setLoadingObservacion] = useState(false);

  if (!visible) return null;

  type CampoTexto = "descripcion" | "estado" | "elemento";
  const estados = ["pendiente", "realizado", "persiste"] as const;

  /* ------------ UI helpers ------------ */
  const toggleAcordeon = (index: number) => {
    setEspacioAbierto((prev) => (prev === index ? null : index));
  };

  /* ------------ Espacios ------------ */
  const agregarEspacio = async () => {
    try {
      const { data: nuevo } = await api.post("/espacios", {
        id_solicitud: solicitudId,
        nombre: "",
      });
      if (!nuevo?.id) throw new Error("No se pudo crear el espacio");

      setEspacios((prev) => [
        ...prev,
        { id: nuevo.id, nombre: nuevo.nombre, observaciones: [], modoEdicion: true },
      ]);
      showToast("✅ Espacio creado", "success");
    } catch (error) {
      console.error("Error al crear espacio:", error);
      showToast("❌ Error al crear espacio", "error");
    }
  };

  const handleCambioNombreEspacio = (index: number, nuevoNombre: string) => {
    const copia = [...espacios];
    copia[index].nombre = nuevoNombre;
    setEspacios(copia);
  };

  const guardarOEditarEspacio = async (index: number) => {
    const espacio = espacios[index];
    const nombre = (espacio.nombre || "").trim();

    // Toggle a edición
    if (!espacio.modoEdicion) {
      const copia = [...espacios];
      copia[index].modoEdicion = true;
      setEspacios(copia);
      return;
    }

    if (!nombre) {
      showToast("❌ El nombre del espacio no puede estar vacío", "error");
      return;
    }

    try {
      await api.put(`/espacios/${espacio.id}`, { nombre });
      const copia = [...espacios];
      copia[index].modoEdicion = false;
      setEspacios(copia);
      showToast("✅ Espacio actualizado", "success");
    } catch (error) {
      console.error(error);
      showToast("❌ Error al actualizar el espacio", "error");
    }
  };

  const confirmarEliminarEspacio = async () => {
    if (espacioAEliminar === null) return;
    const idx = espacioAEliminar;
    const espacio = espacios[idx];
    if (!espacio?.id) {
      showToast("❌ Espacio ya no existe", "error");
      setEspacioAEliminar(null);
      return;
    }

    try {
      await api.delete(`/espacios/${espacio.id}`);
      const copia = [...espacios];
      copia.splice(idx, 1);
      setEspacios(copia);
      showToast("✅ Espacio eliminado", "success");
    } catch (error) {
      console.error(error);
      showToast("❌ Error al eliminar espacio", "error");
    } finally {
      setEspacioAEliminar(null);
    }
  };

  /* ------------ Observaciones ------------ */
  const agregarObservacion = (index: number) => {
    const copia = [...espacios];
    copia[index].observaciones.push({
      id: undefined,
      descripcion: "",
      estado: "pendiente",
      imagen: null,
      fotos: [],
      elemento: "",
      modoEdicion: true,
    });
    setEspacios(copia);
  };

  const handleObservacionChange = (
    espacioIndex: number,
    obsIndex: number,
    campo: CampoTexto | "imagen",
    valor: string | File | null
  ) => {
    const copia = [...espacios];
    const obs = copia[espacioIndex].observaciones[obsIndex];

    if (campo === "imagen" && (valor === null || valor instanceof File)) {
      obs.imagen = valor;
    } else if (typeof valor === "string") {
      if (campo === "descripcion") obs.descripcion = valor;
      if (campo === "estado") obs.estado = valor;
      if (campo === "elemento") obs.elemento = valor;
    }
    setEspacios(copia);
  };

  const toggleModoEdicion = (espacioIndex: number, obsIndex: number) => {
    const copia = [...espacios];
    const obs = copia[espacioIndex].observaciones[obsIndex];
    obs.modoEdicion = !obs.modoEdicion;
    setEspacios(copia);
  };

  // 👉 abrir modal para eliminar FOTO
  const abrirEliminarFoto = (espacioIndex: number, obsIndex: number, fotoIndex: number) => {
    setFotoAEliminar({ espacioIndex, obsIndex, fotoIndex });
  };

  // 👉 confirmar eliminación de FOTO (con fallback por URL)
  const confirmarEliminarFoto = async () => {
    if (!fotoAEliminar) return;
    const { espacioIndex, obsIndex, fotoIndex } = fotoAEliminar;
    const foto: any = espacios[espacioIndex]?.observaciones[obsIndex]?.fotos[fotoIndex];
    if (!foto) {
      setFotoAEliminar(null);
      return;
    }

    const fotoId =
      foto?.id ??
      foto?.id_foto ??
      foto?.foto_id ??
      foto?.id_fotos_observacion ??
      null;

    try {
      if (fotoId) {
        await api.delete(`/fotos-observacion/${fotoId}`);
      } else if (foto?.url_foto) {
        await api.delete(`/fotos-observacion/by-url`, {
          data: { url_foto: foto.url_foto },
          headers: { "Content-Type": "application/json" },
        });
      } else {
        showToast("❌ No se encontró el ID/URL de la foto", "error");
        setFotoAEliminar(null);
        return;
      }

      setEspacios((prev) => {
        const copia = [...prev];
        copia[espacioIndex].observaciones[obsIndex].fotos.splice(fotoIndex, 1);
        return copia;
      });

      showToast("🗑️ Foto eliminada", "success");
    } catch (err: any) {
      // Fallback por URL si el delete por ID falló en el back
      if (foto?.url_foto) {
        try {
          await api.delete(`/fotos-observacion/by-url`, {
            data: { url_foto: foto.url_foto },
            headers: { "Content-Type": "application/json" },
          });
          setEspacios((prev) => {
            const copia = [...prev];
            copia[espacioIndex].observaciones[obsIndex].fotos.splice(fotoIndex, 1);
            return copia;
          });
          showToast("🗑️ Foto eliminada", "success");
        } catch (e) {
          console.error(e);
          showToast("❌ Error al eliminar foto", "error");
        }
      } else {
        console.error(err);
        showToast("❌ Error al eliminar foto", "error");
      }
    } finally {
      setFotoAEliminar(null);
    }
  };

  const guardarOEditarObservacion = async (espacioIndex: number, obsIndex: number) => {
    const obsActual = espacios[espacioIndex].observaciones[obsIndex];

    // Toggle a edición si está cerrada
    if (!obsActual.modoEdicion) {
      toggleModoEdicion(espacioIndex, obsIndex);
      return;
    }

    setLoadingObservacion(true);

    const descripcion = (obsActual.descripcion || "").trim();
    const elemento = (obsActual.elemento || "").trim();
    if (!descripcion || !elemento) {
      showToast("❌ No se permite guardar con campos vacíos", "error");
      setLoadingObservacion(false);
      return;
    }

    try {
      const esNueva = !obsActual.id;
      const payload = {
        id_espacio: espacios[espacioIndex].id,
        descripcion,
        estado: obsActual.estado,
        elemento,
      };

      const { data } = esNueva
        ? await api.post("/observaciones", payload)
        : await api.put(`/observaciones/${obsActual.id}`, payload);

      // Si es nueva, setear el id devuelto
      if (esNueva && data?.id) {
        const copia = [...espacios];
        copia[espacioIndex].observaciones[obsIndex].id = data.id;
        setEspacios(copia);
      }

      // Subir imagen si existe y ya hay id
      if (obsActual.imagen instanceof File && (obsActual.id || (data && data.id))) {
        const obsId = obsActual.id || data.id;

        // Máximo 2 fotos
        if (obsActual.fotos.length >= 2) {
          showToast("⚠️ Solo puedes subir hasta 2 fotos por observación", "warning");
          setLoadingObservacion(false);
          return;
        }

        const formData = new FormData();
        formData.append("file", obsActual.imagen);
        formData.append("id_observacion", String(obsId));

        try {
          const res = await api.post("/fotos-observacion/archivo", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });

          const copia = [...espacios];
          // Guarda también id e id_public para poder borrarla luego
          copia[espacioIndex].observaciones[obsIndex].fotos.push({
            id: res?.data?.id ?? res?.data?.foto?.id ?? res?.data?.id_foto ?? res?.data?.foto_id,
            url_foto: res?.data?.url_foto ?? res?.data?.foto?.url_foto,
            id_public: res?.data?.id_public ?? res?.data?.foto?.id_public,
          });
          copia[espacioIndex].observaciones[obsIndex].imagen = null;
          setEspacios(copia);

          showToast("✅ Imagen subida", "success");
        } catch (err) {
          console.error("Error al subir imagen:", err);
          showToast("❌ Error al subir imagen", "error");
        }
      }

      showToast(esNueva ? "✅ Observación creada" : "✅ Observación actualizada", "success");
    } catch (error) {
      console.error(error);
      showToast("❌ Error al guardar observación", "error");
    }

    setLoadingObservacion(false);
    toggleModoEdicion(espacioIndex, obsIndex);
  };

  // Abre el modal de confirmación para eliminar una observación
  const abrirEliminarObservacion = (espacioIndex: number, obsIndex: number, e?: React.MouseEvent) => {
    (e?.currentTarget as HTMLButtonElement | undefined)?.blur();
    requestAnimationFrame(() => setObservacionAEliminar({ espacioIndex, obsIndex }));
  };

  // Confirmación de eliminar observación (con API si tiene id, o solo front)
  const confirmarEliminarObservacion = async () => {
    if (!observacionAEliminar) return;
    const { espacioIndex, obsIndex } = observacionAEliminar;
    const obs = espacios[espacioIndex]?.observaciones[obsIndex];
    if (!obs) {
      setObservacionAEliminar(null);
      return;
    }

    try {
      if (obs.id) {
        await api.delete(`/observaciones/${obs.id}`);
      }
      setEspacios((prev) => {
        const copia = [...prev];
        copia[espacioIndex].observaciones.splice(obsIndex, 1);
        return copia;
      });
      showToast("✅ Observación eliminada", "success");
    } catch (err) {
      console.error(err);
      showToast("❌ Error al eliminar observación", "error");
    } finally {
      setObservacionAEliminar(null);
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

          <div className="fixed inset-0 flex items-center justify-center p-2">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="w-full max-w-xl transform overflow-y-auto rounded-xl bg-white p-4 shadow-xl transition-all max-h-[95vh]">
                <DialogTitle className="text-lg font-semibold text-primary mb-3">
                  Solicitud
                </DialogTitle>

                {/* Lista de ESPACIOS */}
                {espacios.map((espacio, i) => (
                  <div key={i} className="mb-4 border rounded">
                    <button
                      type="button"
                      className="w-full flex justify-between items-center p-3 bg-gray-100 hover:bg-gray-200 text-left"
                      onClick={() => toggleAcordeon(i)}
                    >
                      <span className="font-medium">
                        {espacio.nombre || `Espacio #${i + 1}`}
                      </span>
                      {espacioAbierto === i ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>

                    {espacioAbierto === i && (
                      <div className="p-3 border-t">
                        <input
                          type="text"
                          value={espacio.nombre}
                          onChange={(e) => handleCambioNombreEspacio(i, e.target.value)}
                          className="w-full p-2 border rounded mb-3 text-sm"
                          placeholder="Nombre del espacio"
                          disabled={!espacio.modoEdicion}
                        />

                        <div className="flex gap-2 mb-3">
                          <button
                            onClick={() => guardarOEditarEspacio(i)}
                            className={`${
                              espacio.modoEdicion ? "bg-green-600 hover:bg-green-700" : "bg-yellow-500 hover:bg-yellow-600"
                            } text-white px-4 py-1 rounded text-sm`}
                          >
                            {espacio.modoEdicion ? "💾 Guardar nombre" : "✏️ Editar"}
                          </button>
                        </div>

                        {/* Observaciones */}
                        {espacio.observaciones.map((obs, j) => (
                          <div key={j} className="bg-gray-50 border p-2 rounded mb-2">
                            <input
                              type="text"
                              value={obs.elemento}
                              onChange={(e) => handleObservacionChange(i, j, "elemento", e.target.value)}
                              placeholder="Elemento observado"
                              disabled={!obs.modoEdicion}
                              className="w-full p-2 border rounded mb-2 text-sm"
                            />

                            <textarea
                              value={obs.descripcion}
                              onChange={(e) => handleObservacionChange(i, j, "descripcion", e.target.value)}
                              placeholder="Descripción"
                              disabled={!obs.modoEdicion}
                              className="w-full p-2 border rounded mb-2 text-sm"
                            />

                            <Listbox value={obs.estado} onChange={(value) => handleObservacionChange(i, j, "estado", value)} disabled={!obs.modoEdicion}>
                              <div className="relative mb-2">
                                <ListboxButton
                                  className={`w-full border rounded px-4 py-2 text-left text-sm ${obs.modoEdicion ? "bg-white" : "bg-gray-100 text-gray-500"}`}
                                >
                                  <span className="capitalize">{obs.estado}</span>
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
                                        `cursor-pointer select-none px-4 py-2 ${active ? "bg-primary text-white" : "text-gray-900"}`
                                      }
                                    >
                                      {({ selected }) => (
                                        <div className="flex justify-between items-center">
                                          <span className={selected ? "font-medium" : "font-normal"}>{estado}</span>
                                          {selected && <Check className="w-4 h-4 text-white" />}
                                        </div>
                                      )}
                                    </ListboxOption>
                                  ))}
                                </ListboxOptions>
                              </div>
                            </Listbox>

                            <label className="block bg-gray-200 text-gray-700 text-center py-2 px-3 rounded cursor-pointer mb-2 text-sm">
                              📷 Subir imagen
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                  handleObservacionChange(i, j, "imagen", e.target.files?.[0] || null)
                                }
                                disabled={!obs.modoEdicion}
                                className="hidden"
                              />
                            </label>

                            {obs.imagen && (
                              <div className="relative w-fit">
                                <img src={URL.createObjectURL(obs.imagen)} alt="preview" className="w-24 h-24 object-cover rounded border" />
                                <button
                                  onClick={() => handleObservacionChange(i, j, "imagen", null)}
                                  className="absolute top-0 right-0 bg-black/60 text-white rounded-full px-2 py-0.5 text-xs hover:bg-red-600"
                                >
                                  ❌
                                </button>
                              </div>
                            )}

                            {/* Galería con “X” solo cuando está en edición */}
                            <GaleriaImagenes
                              imagenes={obs.fotos}
                              editable={obs.modoEdicion}
                              onDelete={(fotoIndex) => abrirEliminarFoto(i, j, fotoIndex)}
                            />

                            <div className="flex gap-2 mt-2">
                              <button
                                onClick={() => guardarOEditarObservacion(i, j)}
                                disabled={loadingObservacion}
                                className={`${
                                  obs.modoEdicion ? "bg-green-600 hover:bg-green-700" : "bg-yellow-500 hover:bg-yellow-600"
                                } text-white px-2 py-1 rounded text-sm ${loadingObservacion ? "opacity-60 cursor-not-allowed" : ""}`}
                              >
                                {loadingObservacion ? "Guardando..." : obs.modoEdicion ? "💾 Guardar" : "✏️ Editar"}
                              </button>

                              <button
                                onClick={(e) => abrirEliminarObservacion(i, j, e)}
                                disabled={loadingObservacion}
                                className="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600"
                              >
                                🗑️ Eliminar
                              </button>
                            </div>
                          </div>
                        ))}

                        <button
                          onClick={() => agregarObservacion(i)}
                          className="bg-secondary text-white px-3 py-1 rounded hover:bg-primary text-sm mt-2 w-full"
                        >
                          + Agregar observación
                        </button>

                        <button
                          onClick={() => setEspacioAEliminar(i)}
                          className="mt-2 w-full bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
                        >
                          🗑️ Eliminar espacio
                        </button>
                      </div>
                    )}
                  </div>
                ))}

                {/* Acciones finales */}
                <div className="flex flex-col sm:flex-row justify-between gap-2 mt-4">
                  <button
                    id="boton-agregar-espacio"
                    onClick={agregarEspacio}
                    className="bg-primary text-white w-full sm:w-auto px-4 py-2 rounded hover:bg-secondary"
                  >
                    + Agregar espacio
                  </button>
                  <button
                    onClick={(e) => {
                      (e.currentTarget as HTMLButtonElement).blur();
                      requestAnimationFrame(() => setOpenEliminarSolicitud(true));
                    }}
                    className="bg-red-700 text-white w-full sm:w-auto px-4 py-2 rounded hover:bg-red-800"
                  >
                    🗑 Eliminar solicitud
                  </button>
                </div>

                <div className="mt-4 text-right">
                  <button onClick={onClose} className="text-sm text-gray-500 hover:underline">
                    Cerrar
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </Dialog>
      </Transition>

      {/* Modal eliminar ESPACIO */}
      <ModalConfirmacionEliminar
        open={espacioAEliminar !== null}
        onClose={() => setEspacioAEliminar(null)}
        onConfirm={confirmarEliminarEspacio}
        titulo="Eliminar espacio"
        mensaje="¿Seguro que deseas eliminar este espacio?"
        confirmText="Eliminar espacio"
      />

      {/* Modal eliminar SOLICITUD */}
      <ModalConfirmacionEliminar
        open={openEliminarSolicitud}
        onClose={() => setOpenEliminarSolicitud(false)}
        onConfirm={onEliminar}
        titulo="Eliminar solicitud"
        mensaje="¿Seguro que deseas eliminar esta solicitud?"
        confirmText="Eliminar solicitud"
      />

      {/* Modal eliminar OBSERVACIÓN */}
      <ModalConfirmacionEliminar
        open={observacionAEliminar !== null}
        onClose={() => setObservacionAEliminar(null)}
        onConfirm={confirmarEliminarObservacion}
        titulo="Eliminar observación"
        mensaje="¿Seguro que deseas eliminar esta observación?"
        confirmText="Eliminar observación"
      />

      {/* 👇 NUEVO: Modal eliminar FOTO */}
      <ModalConfirmacionEliminar
        open={fotoAEliminar !== null}
        onClose={() => setFotoAEliminar(null)}
        onConfirm={confirmarEliminarFoto}
        titulo="Eliminar foto"
        mensaje="¿Seguro que deseas eliminar esta foto?"
        confirmText="Eliminar foto"
      />
    </>
  );
}

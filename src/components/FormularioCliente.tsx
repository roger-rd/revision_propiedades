import { useEffect, useState } from "react";
import { useAuth } from "../context/useAuth";
import { validarRut } from "../utils/validarRut";
import { Cliente } from "../interface/clienteInterface";
import { motion,AnimatePresence } from "framer-motion";
import clsx from "clsx";
import api from "../services/api";
import { AutocompleteInput } from "./AutocompleteInput";

interface Props {
  onClienteCreado: () => void;
  clienteEditar?: Cliente | null;
}



const campos = {
  nombre: "",
  rut: "",
  correo: "",
  telefono: "",
  direccion: "",
  numero_vivienda: "",
  latitud: "",
  longitud: "",
  place_id: "",
};

export default function FormularioCliente({ onClienteCreado, clienteEditar }: Props) {
  const { empresa } = useAuth();
  const [rutValido, setRutValido] = useState(true)
  const [form, setForm] = useState(campos);
  const [mensaje, setMensaje] = useState("");
  const [estadoAnimacion, setEstadoAnimacion] = useState<"none" | "success" | "error">("none");


  useEffect(() => {
    if (clienteEditar) {
      setForm({
        nombre: clienteEditar.nombre,
        rut: clienteEditar.rut,
        correo: clienteEditar.correo,
        telefono: clienteEditar.telefono,
        direccion: clienteEditar.direccion,
        numero_vivienda: clienteEditar.numero_vivienda || "",
        latitud: clienteEditar.latitud || "",
        longitud: clienteEditar.longitud || "",
        place_id: clienteEditar.place_id || "",
      });
    } else {
      setForm(campos);
    }
  }, [clienteEditar]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} =e.target;
    setForm((prev)=> ({...prev, [name]: value}));
    if(name ==="rut"){
      setRutValido(validarRut(value));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!empresa?.id) {
      setMensaje("❌ Error: Empresa no definida.");
      setEstadoAnimacion("error");
      return;
    }

    if (!validarRut(form.rut)) {
      setMensaje("❌ RUT inválido.");
      setEstadoAnimacion("error");
      return;
    }

    const datos = {
      ...form,
      id_empresa: empresa.id,
    };

    // Limpia animación después de 2s
    try {
      if (clienteEditar) {
        await api.put(`/clientes/${clienteEditar.id}`, datos);
      } else {
        await api.post("/clientes", datos);
      }

      setMensaje(`✅ Cliente ${clienteEditar ? "actualizado" : "creado"} correctamente.`);
      setForm(campos);
      setEstadoAnimacion("success");
      onClienteCreado();
    } catch (error) {
      console.error("Error de red:", error);
      setMensaje("❌ Error de red.");
      setEstadoAnimacion("error");
    }

    setTimeout(() => setEstadoAnimacion("none"), 2000);
  };

  return (
    <AnimatePresence>
      <motion.form
        onSubmit={handleSubmit}
        className={clsx("space-y-4", {
          "animate-pulse": estadoAnimacion === "success",
          "animate-shake": estadoAnimacion === "error",
        })}
      >
        <input type="text" name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre" required className="input" />
        <div>
          <input
              type="text"
              name="rut"
              value={form.rut}
              onChange={handleChange}
              placeholder="RUT"
              required
              className={clsx("input", { "border-red-500": !rutValido })}
            />
            {!rutValido && (
              <p className="text-sm text-red-600 mt-1">❌ RUT inválido</p>
            )}
        </div>
        <input type="email" name="correo" value={form.correo} onChange={handleChange} placeholder="Correo" required className="input" />
        <input type="text" name="telefono" value={form.telefono} onChange={handleChange} placeholder="Teléfono" required className="input" />

        <AutocompleteInput
            value={form.direccion}
            onChange={(direccion: string) =>
              setForm((prev) => ({ ...prev, direccion }))
            }
            onSelect={(resultado) =>
              setForm((prev) => ({
                ...prev,
                direccion: resultado.direccion,
                latitud: resultado.latitud.toString(),
                longitud: resultado.longitud.toString(),
                place_id: resultado.place_id,
              }))
            }
          />
        <input type="text" name="numero_vivienda" value={form.numero_vivienda} onChange={handleChange} placeholder="Casa/Dpto/Bloque" required className="input" />

        {form.latitud && form.longitud && (
          <div className="mt-4 rounded-lg overflow-hidden border-4 border-primary animate-glow">
            <iframe
              title="Mapa"
              width="100%"
              height="250"
              loading="lazy"
              className="w-full h-64"
              src={`https://www.google.com/maps?q=${form.latitud},${form.longitud}&z=16&output=embed`}
            ></iframe>
          </div>
        )}

        <button
          type="submit"
          disabled={!rutValido}
          className={clsx("px-4 py-2 rounded text-white", {
            "bg-primary hover:bg-secondary": rutValido,
            "bg-gray-400 cursor-not-allowed": !rutValido,
          })}
        >
          Guardar cliente
        </button>

          {mensaje && (
              <p
                  className={`text-sm mt-2 transition-opacity duration-500 ease-in-out ${mensaje.includes("✅") ? "text-green-600" : "text-red-600"
                  } animate-fade-in`}
                  >
                  {mensaje}
              </p>
              )}
      </motion.form>
    </AnimatePresence>
  );
}

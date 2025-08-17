import { useState, useEffect } from "react";
import FormularioCliente from "../components/FormularioCliente";
import { useAuth } from "../context/useAuth";
import { Cliente } from "../interface/clienteInterface";
import ModalFormularioCliente from "../mod/ModalFormularioCliente";
import { motion, AnimatePresence } from "framer-motion";
import api from "../services/api";
import ModalConfirmacionEliminar from "../mod/ModalConfirmacionEliminar";
import { showToast } from "../utils/toast";
import ModalVerCliente from "../mod/ModalVerCliente";


export default function Clientes() {
  const { empresa } = useAuth();
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [clienteEditar, setClienteEditar] = useState<Cliente | null>(null);
  const [clienteSeleccionado, setClienteSeleccionado] = useState<Cliente | null>(null);

  // Estado para confirmación de eliminar cliente
  const [clienteAEliminar, setClienteAEliminar] = useState<{ id: number; id_empresa: number } | null>(null);

  // Cargar clientes
  useEffect(() => {
    if (!empresa) return;
    api
      .get(`/clientes/${empresa.id}`)
      .then((res) => setClientes(res.data))
      .catch((err) => console.error("Error al cargar clientes:", err));
  }, [empresa]);

  // Alternar formulario
  const toggleFormulario = () => {
    setMostrarFormulario((v) => !v);
    setClienteEditar(null);
  };

  // Actualizar lista de clientes
  const actualizarLista = async () => {
    if (!empresa) return;
    try {
      const res = await api.get(`/clientes/${empresa.id}`);
      setClientes(res.data);
    } catch (error) {
      console.error("Error al actualizar lista de clientes: ", error);
    }
  };

  // Confirmar eliminación (se llama desde el modal genérico)
  const confirmarEliminarCliente = async () => {
    if (!clienteAEliminar) return;
    try {
      await api.delete(`/clientes/${clienteAEliminar.id}/${clienteAEliminar.id_empresa}`);
      setClientes((prev) => prev.filter((c) => c.id !== clienteAEliminar.id));
      setClienteSeleccionado(null); // cierra el modal de ver cliente si estaba abierto
      showToast("✅ Cliente eliminado", "success");
    } catch (error) {
      console.error("❌ Error al eliminar cliente:", error);
      showToast("❌ Error al eliminar cliente", "error");
    } finally {
      setClienteAEliminar(null);
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-primary">Clientes</h1>
        <button
          onClick={toggleFormulario}
          className="bg-primary text-white px-4 py-2 rounded hover:bg-secondary"
        >
          {mostrarFormulario ? "Cerrar formulario" : "Agregar cliente"}
        </button>
      </div>

      <ModalFormularioCliente
        visible={mostrarFormulario}
        onClose={() => {
          setMostrarFormulario(false);
          setClienteEditar(null);
        }}
        title={clienteEditar ? "Editar cliente" : "Agregar nuevo cliente"}
      >
        <FormularioCliente
          clienteEditar={clienteEditar}
          onClienteCreado={() => {
            setClienteEditar(null);
            setMostrarFormulario(false);
            actualizarLista();
          }}
        />
      </ModalFormularioCliente>

      <ModalVerCliente
        cliente={clienteSeleccionado}
        onClose={() => setClienteSeleccionado(null)}
        onEditar={(cliente) => {
          setClienteEditar(cliente);
          setClienteSeleccionado(null); // cerramos el modal de vista
          setMostrarFormulario(true); // abrimos el formulario de edición
        }}
        onEliminar={(id: number, id_empresa: number) => {
          // OJO: el blur()+raf se hace dentro del propio ModalVerCliente (parche más abajo).
          // Aquí solo abrimos el modal de confirmación en el siguiente frame.
          requestAnimationFrame(() => setClienteAEliminar({ id, id_empresa }));
        }}
        visible={!!clienteSeleccionado}
      />

      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2 text-gray-800">Lista de clientes</h2>
        <AnimatePresence>
          {clientes.length === 0 ? (
            <p className="text-gray-500">No hay clientes aún.</p>
          ) : (
            <ul className="divide-y">
              {clientes.map((cliente) => (
                <motion.li
                  key={cliente.id}
                  initial={{ opacity: 0, scale: 0.95, backgroundColor: "#fefcbf" }}
                  animate={{ opacity: 1, scale: 1, backgroundColor: "#ffffff" }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  className="py-2 flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium">{cliente.nombre}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setClienteSeleccionado(cliente)}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      Ver
                    </button>
                  </div>
                </motion.li>
              ))}
            </ul>
          )}
        </AnimatePresence>
      </div>

      {/* Modal genérico de confirmación para eliminar CLIENTE */}
      <ModalConfirmacionEliminar
        open={clienteAEliminar !== null}
        onClose={() => setClienteAEliminar(null)}
        onConfirm={confirmarEliminarCliente}
        titulo="Eliminar cliente"
        mensaje="¿Seguro que deseas eliminar este cliente? Esta acción no se puede deshacer."
        confirmText="Eliminar cliente"
      />
    </div>
  );
}

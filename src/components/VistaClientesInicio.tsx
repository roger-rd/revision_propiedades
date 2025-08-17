import { useEffect, useState } from "react";
import { useAuth } from "../context/useAuth";
import { Link } from "react-router-dom";
import { Cliente } from "../interface/clienteInterface";
import api from "../services/api";
import ModalVerCliente from "../mod/ModalVerCliente";



export default function VistaClientesInicio() {
  const { empresa } = useAuth();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [clienteSeleccionado, setClienteSeleccionado] = useState<Cliente | null>(null);

  useEffect(() => {
    if (!empresa) return;

      api.get(`/clientes/${empresa.id}`)
      .then((res) => setClientes(res.data))
      .catch((err) => console.error("Error al cargar clientes:", err));
  }, [empresa]);

  const filtrados = clientes
    .filter((c) =>
      c.nombre.toLowerCase().includes(busqueda.toLowerCase())
    )
    .slice(0, 3); // Mostrar solo 3

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-primary">Clientes</h2>
        <Link
          to="/clientes"
          className="bg-secondary text-white px-4 py-1 rounded hover:bg-primary"
        >
          Agregar cliente
        </Link>
      </div>

      <input
        type="text"
        placeholder="Buscar cliente..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        className="mb-4 w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
      />

      <table className="w-full text-sm  text-gray-800">
        <thead >
          <tr className="border-b text-left">
            <th className="py-2 text-center">Nombre</th>
            <th className="py-2 text-center">Telefono</th>
            <th className="py-2 hidden md:table-cell text-center">Dirección</th>

            <th></th>
          </tr>
        </thead>
        <tbody>
          {filtrados.map((c) => (
            <tr key={c.id} className="border-b last:border-none hover:bg-gray-50">
              <td className="py-2 text-center">{c.nombre}</td>
              <td className="text-center">{c.telefono}</td>
              <td className="hidden md:table-cell text center">{c.direccion}</td>

              <td>
                <button
                  onClick={() => setClienteSeleccionado(c)}
                  className="text-primary font-medium hover:underline text-sm"
                >
                  Ver
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ModalVerCliente
        cliente={clienteSeleccionado}
        onClose={() => setClienteSeleccionado(null)}
        onEditar={() => {}}
        onEliminar={() => {}}
        visible={clienteSeleccionado !== null}
        ocultarAcciones={true}
      />
    </div>
  );
}

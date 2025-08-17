import { useEffect, useState } from "react";
import { useAuth } from "../context/useAuth";
import { Cliente } from "../interface/clienteInterface";
import LoadingSpinner from "./LoadingSpinner";
import api from "../services/api";


export default function ListaClientes() {
  const { empresa } = useAuth();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    if (!empresa) return;

    api.get(`/clientes/${empresa.id}`)
      .then((res) => setClientes(res.data))
      .catch((err) => console.error("Error al cargar clientes:", err));
  }, [empresa]);

  const filtrados = clientes.filter((cliente) =>
    cliente.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    cliente.rut.toLowerCase().includes(busqueda.toLowerCase())
  );

  if (!empresa) return <LoadingSpinner mensaje="Cargando empresa..." />;
  if (!clientes.length) return <LoadingSpinner mensaje="Buscando clientes..." />;

  return (
    <div className="mt-10 bg-white p-4 rounded shadow">
      <h2 className="text-xl font-semibold mb-4 text-primary">Clientes registrados</h2>
      <input
        type="text"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        placeholder="Buscar por nombre o RUT..."
        className="input mb-4"
      />
      <table className="w-full text-sm text-gray-700">
        <thead>
          <tr className="border-b text-left">
            <th>Nombre</th>
            <th>RUT</th>
            <th>Correo</th>
            <th>Teléfono</th>
            <th>Dirección</th>
          </tr>
        </thead>
        <tbody>
          {filtrados.map((c) => (
            <tr key={c.id} className="border-b">
              <td>{c.nombre}</td>
              <td>{c.rut}</td>
              <td>{c.correo}</td>
              <td>{c.telefono}</td>
              <td>{c.direccion}</td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

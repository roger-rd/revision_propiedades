import { useEffect, useState } from "react";
import { useAuth } from "../context/useAuth";
import { Cliente } from "../interface/clienteInterface";
import { Espacio, SolicitudResumen } from "../interface/solicitudesInterface";
import ModalVerSolicitud from "../mod/ModalVerSolicitud";
import ClienteSelector from "../components/ClienteSelector";
import ModalNuevaSolicitud from "../mod/ModalNuevaSolicitud";
import ModalEditarSolicitud from "../mod/ModalEditarSolicitud";
import api from "../services/api";
import { showToast } from "../utils/toast";


export default function Solicitudes() {
  const { empresa } = useAuth();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState<number | null>(null);
  const [solicitudesPrevias, setSolicitudesPrevias] = useState<SolicitudResumen[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [solicitudSeleccionada, setSolicitudSeleccionada] = useState<number | null>(null);
  const [espaciosSolicitud, setEspaciosSolicitud] = useState<Espacio[]>([]);
  const [modalNuevaVisible, setModalNuevaVisible] = useState(false);
  const [modalEditarVisible, setModalEditarVisible] = useState(false);
  const [solicitudParaEditar, setSolicitudParaEditar] = useState<SolicitudResumen | null>(null);


  useEffect(() => {
    if (!empresa) return;
    api.get(`/clientes/${empresa.id}`)
      .then(res => setClientes(res.data))
      .catch(err => console.error("Error al cargar clientes:", err));
  }, [empresa]);

  useEffect(() => {
    if (!clienteSeleccionado || !empresa) return;
    if (clienteSeleccionado === 0) return;

    api.get(`/solicitudes/empresa/${empresa.id}`)
      .then(res => {
        const filtradas = res.data.filter((s: SolicitudResumen) => s.id_cliente === clienteSeleccionado);
        setSolicitudesPrevias(filtradas);
      })
      .catch(err => console.error("Error al cargar solicitudes:", err));
  }, [clienteSeleccionado, empresa]);


  const handleSeleccionSolicitud = async (idSolicitud: number) => {
    try {
      const res = await api.get(`/solicitudes/${idSolicitud}/completa`);
      const data = res.data
      setSolicitudSeleccionada(idSolicitud);
      setEspaciosSolicitud(data.solicitud.espacios);
      setModalVisible(true);
    } catch (error) {
      console.error("Error al cargar solicitud completa:", error);
    }
  };

  const handleEliminarSolicitud = async () => {
    if (!solicitudSeleccionada) return;

    try {
      await api.delete(`/solicitudes/${solicitudSeleccionada}`);
      showToast("✅ Solicitud eliminada correctamente", "success");
      setSolicitudesPrevias(prev =>
        prev.filter(s => Number(s.id) !== solicitudSeleccionada)
      );
      setModalVisible(false);
      setSolicitudSeleccionada(null);
      setEspaciosSolicitud([]);
    } catch (error) {
      console.error("Error al eliminar solicitud:", error);
      showToast("❌ Error en la red al eliminar", "error");
    }
  };

  return (
    <div className="px-4 py-6 sm:px-6 md:px-10 lg:px-12 bg-white rounded-xl shadow max-w-4xl mx-auto">
      <h1 className="text-xl sm:text-2xl font-bold mb-6 text-primary text-center sm:text-left">Nueva Solicitud</h1>

      <label className="block mb-2 text-sm font-semibold text-gray-700">Seleccionar cliente:</label>
      <ClienteSelector
        clientes={clientes}
        seleccionado={clienteSeleccionado}
        onChange={setClienteSeleccionado}
      />
      <div className="space-y-3 max-h-[40vh] overflow-y-auto">
        {solicitudesPrevias.map((solicitud, index) => (
          <div
            key={index}
            className="cursor-pointer bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md hover:bg-gray-50 transition"
            onClick={() => {
              if (solicitud.id !== undefined) {
                handleSeleccionSolicitud(Number(solicitud.id));
              }
            }}
          >

            <div className="text-sm text-gray-600">
              <p><strong className="text-gray-800">📍 Dirección:</strong> {solicitud.direccion}{solicitud.numero_vivienda}</p>
              <p><strong className="text-gray-800">📐 Tamaño:</strong> {solicitud.tamano}</p>
              <p><strong className="text-gray-800">📆 Fecha:</strong> {new Date(solicitud.fecha_solicitud).toLocaleDateString()}</p>
              <p><strong className="text-gray-800">🏠 Vivienda:</strong> {solicitud.tipo_propiedad}</p>
              <p><strong className="text-gray-800">🗂️ Tipo de inspeccion:</strong> {solicitud.tipo_inspeccion}</p>
              <p><strong className="text-gray-800">📊 Inmobiliaria:</strong> {solicitud.inmobiliaria}</p>
              <p><strong className="text-gray-800">📋 Estado:</strong>


                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold
                ${solicitud.estado === "realizado"
                    ? "bg-green-100 text-green-700"
                    : solicitud.estado === "pendiente"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-gray-100 text-gray-600"
                  }`}>
                  {solicitud.estado}
                </span>
              </p>
            </div>
            <div className="flex justify-end mt-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSolicitudParaEditar(solicitud);
                  setModalEditarVisible(true);
                }}
                className="text-blue-600 hover:underline text-sm"
              >
                ✏️ Editar
              </button>
            </div>
          </div>

        ))}

      </div>

      <div className="relative group inline-block mt-8">
        <button
          onClick={() => setModalNuevaVisible(true)}
          disabled={!clienteSeleccionado}
          className={`px-6 py-2 rounded transition font-semibold ${clienteSeleccionado
            ? "bg-primary text-white hover:bg-secondary"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
        >
          ➕ Agregar nueva solicitud
        </button>

        {!clienteSeleccionado && (
          <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            Debes seleccionar un cliente
          </div>
        )}
      </div>

      {/* Modal */}
      <ModalEditarSolicitud
        visible={modalEditarVisible}
        onClose={() => {
          setModalEditarVisible(false);
          setSolicitudParaEditar(null);
        }}
        solicitud={solicitudParaEditar}
        onGuardar={(actualizada) => {
          setSolicitudesPrevias(prev =>
            prev.map(s =>
              s.id === actualizada.id ? actualizada : s
            )
          );
        }}
      />
      <ModalVerSolicitud
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setSolicitudSeleccionada(null);
          setEspaciosSolicitud([]);
        }}
        solicitudId={solicitudSeleccionada ?? 0}
        espacios={espaciosSolicitud}
        setEspacios={setEspaciosSolicitud}
        onGuardar={async () => {
          if (!solicitudSeleccionada) return;

          const formData = new FormData();
          formData.append("espacios", JSON.stringify(espaciosSolicitud));

          espaciosSolicitud.forEach((espacio, i) => {
            espacio.observaciones.forEach((obs, j) => {
              if (obs.imagen) {
                formData.append(`imagen_${i}_${j}`, obs.imagen);
              }
            });
          });

          try {
            await api.post(`/solicitudes/${solicitudSeleccionada}/espacios`);
            showToast("Espacios guardados correctamente.", "success");
            setModalVisible(false);
          } catch (error) {
            console.error("Error al guardar espacios:", error);
            showToast("Error al guardar espacios.", "error");
          }
        }}
        onEliminar={handleEliminarSolicitud}
      />

      <ModalNuevaSolicitud
        visible={modalNuevaVisible}
        onClose={() => setModalNuevaVisible(false)}
        onCrear={async (formData) => {
          if (!clienteSeleccionado || !empresa) return;

          const cliente = clientes.find(c => c.id === clienteSeleccionado);
          if (!cliente) return;

          const nuevaSolicitud = {
            id_cliente: clienteSeleccionado,
            id_empresa: empresa.id,
            direccion: cliente.direccion,
            ...formData,
          };

          try {
            const res = await api.post("/solicitudes", nuevaSolicitud);
            setSolicitudesPrevias(prev => [...prev, res.data]);
            setModalNuevaVisible(false);
            showToast("✅ Solicitud creada correctamente", "success");
          } catch (error) {
            console.error("Error:", error);
            showToast("❌ Error al crear solicitud", "error");
          }
        }}
      />
    </div>
  );
}

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useAuth } from "../context/useAuth";
import { AbrirAgendarDetail, Cita, Cliente } from "../interface/calendarioInterface";
import api from "../services/api";
import { crearCita, getCitasPorEmpresa, eliminarCita } from "../services/agenda";
import ConfirmAgendarModal from "../mod/ConfirmAgendarModal";
import CrearCitaModal from "../mod/CrearCitaModal";
import { showToast } from "../utils/toast";
import ModalConfirmacionEliminar from "../mod/ModalConfirmacionEliminar";


export default function CalendarioCitas() {
    const { empresa } = useAuth();
    const [modalEliminar, setModalEliminar] = useState<number | null>(null);

    // Estado de datos
    const [citas, setCitas] = useState<Cita[]>([]);
    const [clientes, setClientes] = useState<Cliente[]>([]);

    // Estado de UI / selección
    const [fechaSeleccionada, setFechaSeleccionada] = useState<Date | null>(null);
    const [fechaPendiente, setFechaPendiente] = useState<Date | null>(null);

    // Estado de modals
    const [openConfirm, setOpenConfirm] = useState(false);
    const [openCrear, setOpenCrear] = useState(false);

    // Estado de clientes en modal crear
    const [cargandoClientes, setCargandoClientes] = useState(false);
    const [errorClientes, setErrorClientes] = useState<string | null>(null);
    const [valorCliente, setValorCliente] = useState<string>("");
    const [clientePreseleccionado, setClientePreseleccionado] = useState<number | null>(null);
    const [direccionPrellenada, setDireccionPrellenada] = useState<string>("");

    // Guardando cita
    const [guardando, setGuardando] = useState(false);
    // Normaliza clientes de API a Cliente[]
    function normalizeClientes(raw: any[]): Cliente[] {
        return (raw || [])
            .map((r) => ({
                id: r.id ?? r.id_cliente ?? r.cliente_id,
                nombre:
                    r.nombre ??
                    r.nombre_cliente ??
                    r.cliente_nombre ??
                    [r.nombres, r.apellidos].filter(Boolean).join(" ") ??
                    "Sin nombre",
                direccion: r.direccion ?? r.direccion_cliente ?? "",
            }))
            .filter((c) => typeof c.id === "number" && c.nombre);
    }

    // --- Cargar citas ---
    useEffect(() => {
        if (!empresa?.id) return;
        void getCitasPorEmpresa(empresa.id).then(setCitas).catch((e) => {
            console.error("Error al cargar agenda:", e);
        });
    }, [empresa?.id]);

    // --- Cargar clientes ---
    useEffect(() => {
        if (!empresa?.id) return;
        setCargandoClientes(true);
        setErrorClientes(null);
        // Si tu endpoint es /clientes/empresa/:id cambia aquí:
        api
            .get(`/clientes/${empresa.id}`)
            .then(({ data }) => setClientes(normalizeClientes(data)))
            .catch((err) => {
                console.error("Error al cargar clientes:", err);
                setErrorClientes("No se pudieron cargar los clientes.");
                setClientes([]);
            })
            .finally(() => setCargandoClientes(false));
    }, [empresa?.id]);

    //     // Sincroniza preselección cuando hay clientes cargados
    useEffect(() => {
        if (!clientePreseleccionado || !clientes.length) return;
        const c = clientes.find((x) => x.id === clientePreseleccionado);
        setValorCliente(c ? String(c.id) : "");
        if (c?.direccion) setDireccionPrellenada(c.direccion);
    }, [clientePreseleccionado, clientes]);

    // --- Evento global abrir-agendar ---
    useEffect(() => {
        function onAbrirAgendar(e: Event) {
            const ev = e as CustomEvent<AbrirAgendarDetail>;
            const { id_cliente, direccion, fecha } = ev.detail || {};
            const base = fecha ? new Date(fecha) : new Date();

            if (typeof id_cliente === "number" && !Number.isNaN(id_cliente)) {
                // Crear directo (sin confirmación)
                setClientePreseleccionado(id_cliente);
                setValorCliente(String(id_cliente));
                if (direccion) setDireccionPrellenada(direccion);
                setFechaSeleccionada(base);
                setOpenCrear(true);
            } else {
                // Solo mirar → confirmación primero
                setDireccionPrellenada(direccion ?? "");
                setFechaPendiente(base);
                setOpenConfirm(true);
            }
        }
        window.addEventListener("abrir-agendar", onAbrirAgendar as EventListener);
        return () => window.removeEventListener("abrir-agendar", onAbrirAgendar as EventListener);
    }, []);

    // --- Puntos en días con cita ---
    function tileContent({ date }: { date: Date }) {
        const hay = citas.some((c) => sameDate(new Date(c.fecha), date));
        return hay ? <div className="mt-1 w-1.5 h-1.5 rounded-full bg-primary mx-auto" /> : null;
    }

    // --- Próximas visitas (2 semanas) ---
    const proximas = useMemo(() => {
        const hoy = new Date();
        const max = addDays(hoy, 14);
        return citas
            .filter((c) => {
                const d = new Date(c.fecha);
                return stripTime(d) >= stripTime(hoy) && stripTime(d) <= stripTime(max);
            })
            .sort((a, b) => (a.fecha + a.hora).localeCompare(b.fecha + b.hora))
            .slice(0, 10);
    }, [citas]);

    // --- Citas del día seleccionado ---
    const citasDelDia = useMemo(() => {
        if (!fechaSeleccionada) return [];
        return citas
            .filter((c) => sameDate(new Date(c.fecha), fechaSeleccionada))
            .sort((a, b) => a.hora.localeCompare(b.hora));
    }, [citas, fechaSeleccionada]);

    // --- Click en calendario: pide confirmación ---
    function onSelectFecha(value: Date) {
        setFechaPendiente(value);
        setOpenConfirm(true);
    }

    // --- Confirm modal handlers ---
    function confirmarAgendarSi() {
        if (fechaPendiente) setFechaSeleccionada(fechaPendiente);
        setOpenConfirm(false);
        setOpenCrear(true);
        setFechaPendiente(null);
    }
    function confirmarAgendarNo() {
        // Ver citas del día seleccionado
        if (fechaPendiente) setFechaSeleccionada(fechaPendiente);
        setOpenConfirm(false);
        setFechaPendiente(null);
    }

    // --- Crear cita ---
    async function handleCrear(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!empresa?.id || !fechaSeleccionada || guardando) return;

        setGuardando(true);

        // ¡Importante! cachear el form antes de await (synthetic events)
        const formEl = e.currentTarget as HTMLFormElement;

        const id_cliente = Number(valorCliente);
        if (!id_cliente) {
            showToast("Selecciona un cliente", "error");
            setGuardando(false);
            return;
        }

        const form = new FormData(formEl);
        const hora = String(form.get("hora"));
        const observacion = String(form.get("observacion") || "");
        const direccion =
            direccionPrellenada ||
            String(form.get("direccion") || "") ||
            clientes.find((c) => c.id === id_cliente)?.direccion ||
            "";

        const fechaISO = toYMD(fechaSeleccionada);

        // 1) POST (si falla, mostrar error real y salir)
        try {
            const creada = await crearCita({
                id_empresa: empresa.id,
                id_cliente,
                direccion,
                fecha: fechaISO,
                hora,
                observacion,
            });

            // Usamos 'creada' para actualizar la UI al tiro
            setCitas((prev) => [...prev, creada]);

            showToast(
                `✅ Cita creada correctamente para ${creada.cliente_nombre || "el cliente"}`,
                "success"
            );
        } catch (err: any) {
            const backendMsg = err?.response?.data?.error;
            showToast(`❌ Error al crear cita: ${backendMsg || "Error desconocido"}`, "error");
            setGuardando(false);
            return;
        }

        // 2) Refresco (opcional redundante; lo dejamos por si otro usuario crea/borra)
        try {
            const data = await getCitasPorEmpresa(empresa.id);
            setCitas(data);
        } catch (err) {
            console.warn("Cita creada, pero falló el refresco:", err);
            // No mostramos error rudo, ya notificamos éxito
        }

        // 3) Cierre + reset
        try {
            formEl.reset();
            setClientePreseleccionado(null);
            setDireccionPrellenada("");
            setValorCliente("");
            setOpenCrear(false);
        } catch (err) {
            console.warn("Cita creada, pero falló el reset/cierre:", err);
        } finally {
            setGuardando(false);
        }
    }

    // --- Eliminar cita ---
    async function handleEliminar(id: number) {
        try {
            await eliminarCita(id);
            if (empresa?.id) {
                const data = await getCitasPorEmpresa(empresa.id);
                setCitas(data);
            }
            showToast("🗑️ Cita eliminada", "success");
        } catch {
            showToast("No se pudo eliminar la cita", "error");
        }
    }

    return (
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Columna izquierda: Próximas + Citas del día */}
            <div className="bg-white p-4 rounded shadow">
                <h2 className="text-lg font-bold mb-3 text-primary">Próximas visitas</h2>
                <ul className="space-y-2">
                    {proximas.map((c) => (
                        <li key={c.id} className="border-b pb-2 text-sm flex items-start justify-between gap-2">
                            <div>
                                <p className="font-semibold">{c.cliente_nombre}</p>
                                <p className="text-xs">{c.direccion}</p>
                                <p className="text-xs text-gray-500">
                                    {new Date(c.fecha).toLocaleDateString()} • {c.hora}
                                </p>
                            </div>
                            <button
                                onClick={() => setModalEliminar(c.id)}
                                className="text-xs px-2 py-1 rounded bg-red-100 hover:bg-red-200 text-red-700"
                            >
                                Eliminar
                            </button>

                        </li>
                    ))}
                    {proximas.length === 0 && <li className="text-sm text-gray-500">Sin visitas próximas.</li>}
                </ul>

                <h3 className="mt-6 font-semibold">Citas del día seleccionado</h3>
                <ul className="mt-2 space-y-2">
                    {citasDelDia.map((c) => (
                        <li key={c.id} className="border p-2 rounded text-sm flex items-center justify-between">
                            <div>
                                <p className="font-semibold">{c.cliente_nombre}</p>
                                <p className="text-xs">{c.direccion}</p>
                                <p className="text-xs text-gray-500">{c.hora}</p>
                            </div>
                            <button
                                onClick={() => setModalEliminar(c.id)}
                                className="text-xs px-2 py-1 rounded bg-red-100 hover:bg-red-200 text-red-700"
                            >
                                Eliminar
                            </button>
                        </li>
                    ))}
                    {fechaSeleccionada && citasDelDia.length === 0 && (
                        <li className="text-xs text-gray-500">No hay citas para este día.</li>
                    )}
                </ul>
            </div>

            {/* Columna derecha: Calendario */}
            <div className="bg-white p-4 rounded shadow flex justify-center items-center">
                <div className="w-full max-w-sm">
                    <Calendar
                        onChange={(value) => onSelectFecha(value as Date)}
                        value={fechaSeleccionada}
                        tileContent={tileContent}
                    />
                </div>
            </div>

            {/* MODALS EXTERNOS */}
            <ConfirmAgendarModal
                open={openConfirm}
                fechaTexto={fechaPendiente ? fechaPendiente.toLocaleDateString() : "—"}
                onConfirm={confirmarAgendarSi}
                onView={confirmarAgendarNo}
                onClose={() => setOpenConfirm(false)}
            />

            <CrearCitaModal
                open={openCrear}
                fechaSeleccionada={fechaSeleccionada}
                clientes={clientes}
                cargandoClientes={cargandoClientes}
                errorClientes={errorClientes}
                valorCliente={valorCliente}
                setValorCliente={setValorCliente}
                direccionPrellenada={direccionPrellenada}
                setDireccionPrellenada={setDireccionPrellenada}
                guardando={guardando}
                onSubmit={handleCrear}
                onClose={() => setOpenCrear(false)}
            />
            <ModalConfirmacionEliminar
                open={modalEliminar !== null}
                // setOpen espera (open:boolean) => void, así cerramos cuando nos pidan false
                onClose={() => setModalEliminar(null)}
                titulo="Eliminar cita"
                mensaje="¿Estás seguro de que deseas eliminar esta cita?"
                onConfirm={() => {
                    if (modalEliminar !== null) {
                        void handleEliminar(modalEliminar);
                    }
                    setModalEliminar(null);
                }}
            />

        </section>
    );
}

/* Helpers */
function toYMD(d: Date) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
}
function stripTime(d: Date) {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}
function sameDate(a: Date, b: Date) {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}
function addDays(d: Date, n: number) {
    const r = new Date(d);
    r.setDate(d.getDate() + n);
    return r;
}

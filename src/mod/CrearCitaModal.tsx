import { useEffect, useRef } from "react";
import { Cliente } from "../interface/calendarioInterface";


type Props = {
  open: boolean;
  fechaSeleccionada: Date | null;
  clientes: Cliente[];
  cargandoClientes: boolean;
  errorClientes: string | null;
  valorCliente: string;
  setValorCliente: (v: string) => void;
  direccionPrellenada: string;
  setDireccionPrellenada: (v: string) => void;
  guardando: boolean;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onClose?: () => void;
};

export default function CrearCitaModal({
  open,
  fechaSeleccionada,
  clientes,
  cargandoClientes,
  errorClientes,
  valorCliente,
  setValorCliente,
  direccionPrellenada,
  setDireccionPrellenada,
  guardando,
  onSubmit,
  onClose,
}: Props) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dlg = ref.current;
    if (!dlg) return;
    if (open && !dlg.open) dlg.showModal();
    if (!open && dlg.open) dlg.close();
  }, [open]);

  return (
    <dialog ref={ref} className="rounded-xl p-0 w-[95%] max-w-lg" onClose={onClose}>
      <form method="dialog" className="p-4 border-b flex justify-between items-center">
        <h3 className="text-lg font-semibold">Agendar cita</h3>
        <button className="px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 text-sm">Cerrar</button>
      </form>

      <form onSubmit={onSubmit} className="p-4 space-y-4">
        <div className="text-sm">
          <span className="font-medium">Fecha: </span>
          {fechaSeleccionada ? fechaSeleccionada.toLocaleDateString() : "—"}
        </div>

        <div>
          <label className="block text-sm mb-1">Cliente</label>
          {cargandoClientes && <p className="text-xs text-gray-500 mb-1">Cargando clientes…</p>}
          {errorClientes && <p className="text-xs text-red-600 mb-1">{errorClientes}</p>}
          <select
            name="id_cliente"
            required
            className="w-full border rounded px-3 py-2"
            value={valorCliente}
            onChange={(e) => {
              setValorCliente(e.target.value);
              const elegido = clientes.find((c) => String(c.id) === e.target.value);
              if (elegido?.direccion) setDireccionPrellenada(elegido.direccion);
            }}
          >
            <option value="">{clientes.length ? "Seleccione…" : "Sin clientes"}</option>
            {clientes.map((c) => (
              <option key={c.id} value={c.id}>{c.nombre}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm mb-1">Hora (HH:MM)</label>
          <input type="time" name="hora" required className="w-full border rounded px-3 py-2" />
        </div>

        <div>
          <label className="block text-sm mb-1">Dirección (opcional)</label>
          <input
            name="direccion"
            placeholder="Calle 123…"
            className="w-full border rounded px-3 py-2"
            value={direccionPrellenada}
            onChange={(e) => setDireccionPrellenada(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Observación</label>
          <textarea name="observacion" rows={3} className="w-full border rounded px-3 py-2" />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="submit"
            disabled={guardando}
            className="px-3 py-2 text-sm rounded bg-primary text-white hover:opacity-90 disabled:opacity-60"
          >
            {guardando ? "Guardando…" : "Guardar"}
          </button>
        </div>
      </form>
    </dialog>
  );
}

import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";

type GastoForm = {
  id?: number;
  id_empresa: number;
  fecha: string;           // YYYY-MM-DD
  categoria: string;       // luz, agua, internet...
  descripcion?: string;
  monto: number | string;  // controlado; convertimos a número al enviar
  medio_pago?: string;     // efectivo, tarjeta...
  recurrente?: boolean;
  factura_url?: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  /** Si viene, es edición; si no, creación */
  initialData?: Partial<GastoForm>;
  /** callback que persiste (POST o PUT). Debe lanzar error si falla */
  onSave: (payload: GastoForm) => Promise<void>;
  /** id_empresa requerido para crear */
  idEmpresa: number;
};

const CATEGORIAS = [
  "luz",
  "agua",
  "internet",
  "transporte",
  "materiales",
  "arriendo",
  "teléfono",
  "otros",
];

const MEDIOS = ["efectivo", "tarjeta", "transferencia", "otros"];

export default function ModalGasto({
  open,
  onClose,
  initialData,
  onSave,
  idEmpresa,
}: Props) {
  const [form, setForm] = useState<GastoForm>(() => ({
    id: initialData?.id,
    id_empresa: idEmpresa,
    fecha: initialData?.fecha || toYMD(new Date()),
    categoria: initialData?.categoria || "",
    descripcion: initialData?.descripcion || "",
    monto: initialData?.monto ?? "",
    medio_pago: initialData?.medio_pago || "",
    recurrente: !!initialData?.recurrente,
    factura_url: initialData?.factura_url || "",
  }));
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Headless UI – foco inicial accesible
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    // hidratar cuando abre (útil si abres en modo edición varias veces)
    setForm({
      id: initialData?.id,
      id_empresa: idEmpresa,
      fecha: initialData?.fecha || toYMD(new Date()),
      categoria: initialData?.categoria || "",
      descripcion: initialData?.descripcion || "",
      monto: initialData?.monto ?? "",
      medio_pago: initialData?.medio_pago || "",
      recurrente: !!initialData?.recurrente,
      factura_url: initialData?.factura_url || "",
    });
    setErrors({});
    setSaving(false);
  }, [open, initialData, idEmpresa]);

  const isEdit = useMemo(() => Boolean(initialData?.id), [initialData?.id]);

  function update<K extends keyof GastoForm>(key: K, value: GastoForm[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!form.fecha) e.fecha = "Requerido";
    if (!form.categoria) e.categoria = "Requerido";
    if (form.monto === "" || isNaN(Number(form.monto))) e.monto = "Monto inválido";
    if (Number(form.monto) <= 0) e.monto = "Debe ser mayor a 0";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (saving) return;
    if (!validate()) return;

    setSaving(true);
    try {
      const payload: GastoForm = {
        ...form,
        id_empresa: idEmpresa,
        monto: Number(form.monto),
        descripcion: form.descripcion?.trim() || undefined,
        medio_pago: form.medio_pago?.trim() || undefined,
        factura_url: form.factura_url?.trim() || undefined,
      };
      await onSave(payload);
      onClose();
    } catch (err) {
      // Puedes usar tu showToast aquí si prefieres
      console.error("Error al guardar gasto:", err);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        initialFocus={cancelRef}
        onClose={() => {
          if (!saving) onClose();
        }}
      >
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="w-full max-w-lg transform overflow-hidden rounded-xl bg-white p-5 text-left align-middle shadow-xl transition-all">
                <DialogTitle className="text-lg font-bold text-primary">
                  {isEdit ? "Editar gasto" : "Nuevo gasto"}
                </DialogTitle>

                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Fecha */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
                      <input
                        type="date"
                        value={form.fecha}
                        onChange={(e) => update("fecha", e.target.value)}
                        className={`w-full border rounded px-3 py-2 text-sm ${errors.fecha ? "border-red-500" : ""}`}
                      />
                      {errors.fecha && <p className="text-xs text-red-600 mt-1">{errors.fecha}</p>}
                    </div>

                    {/* Categoría */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                      <select
                        value={form.categoria}
                        onChange={(e) => update("categoria", e.target.value)}
                        className={`w-full border rounded px-3 py-2 text-sm ${errors.categoria ? "border-red-500" : ""}`}
                      >
                        <option value="">Seleccione…</option>
                        {CATEGORIAS.map((c) => (
                          <option key={c} value={c}>
                            {capitalize(c)}
                          </option>
                        ))}
                      </select>
                      {errors.categoria && <p className="text-xs text-red-600 mt-1">{errors.categoria}</p>}
                    </div>
                  </div>

                  {/* Descripción */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Descripción (opcional)</label>
                    <input
                      type="text"
                      value={form.descripcion || ""}
                      onChange={(e) => update("descripcion", e.target.value)}
                      placeholder="Detalle del gasto…"
                      className="w-full border rounded px-3 py-2 text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* Monto */}
                    <div className="sm:col-span-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Monto</label>
                      <input
                        type="number"
                        min={0}
                        step="0.01"
                        value={form.monto}
                        onChange={(e) => update("monto", e.target.value)}
                        className={`w-full border rounded px-3 py-2 text-sm text-right ${errors.monto ? "border-red-500" : ""}`}
                      />
                      {errors.monto && <p className="text-xs text-red-600 mt-1">{errors.monto}</p>}
                    </div>

                    {/* Medio de pago */}
                    <div className="sm:col-span-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Medio de pago</label>
                      <select
                        value={form.medio_pago || ""}
                        onChange={(e) => update("medio_pago", e.target.value)}
                        className="w-full border rounded px-3 py-2 text-sm"
                      >
                        <option value="">—</option>
                        {MEDIOS.map((m) => (
                          <option key={m} value={m}>
                            {capitalize(m)}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Recurrente */}
                    <div className="sm:col-span-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Recurrente</label>
                      <div className="flex items-center h-[38px] px-3 border rounded">
                        <input
                          id="recurrente"
                          type="checkbox"
                          checked={!!form.recurrente}
                          onChange={(e) => update("recurrente", e.target.checked)}
                          className="mr-2"
                        />
                        <label htmlFor="recurrente" className="text-sm text-gray-700">
                          Sí
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Factura URL */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">URL factura (opcional)</label>
                    <input
                      type="url"
                      value={form.factura_url || ""}
                      onChange={(e) => update("factura_url", e.target.value)}
                      placeholder="https://…"
                      className="w-full border rounded px-3 py-2 text-sm"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      ref={cancelRef}
                      type="button"
                      onClick={onClose}
                      disabled={saving}
                      className="px-3 py-2 text-sm rounded bg-white ring-1 ring-gray-300 hover:bg-gray-50 disabled:opacity-50"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-3 py-2 text-sm rounded bg-primary text-white hover:opacity-90 disabled:opacity-50"
                    >
                      {saving ? "Guardando…" : isEdit ? "Guardar cambios" : "Crear gasto"}
                    </button>
                  </div>
                </form>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

/* Utils */
function toYMD(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

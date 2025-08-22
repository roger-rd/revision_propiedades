import { FotoObs } from "../interface/solicitudesInterface";


type GaleriaImagenesProps = {
  imagenes: FotoObs[];
  /** Si es true, se muestra la “X” para eliminar */
  editable?: boolean;
  /** Callback cuando dan clic a eliminar una foto (por índice) */
  onDelete?: (index: number) => void;
};

export default function GaleriaImagenes({ imagenes, editable = false, onDelete }: GaleriaImagenesProps) {
  if (!imagenes || imagenes.length === 0) {
    return <p className="text-gray-500 text-sm">Sin imágenes registradas.</p>;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
      {imagenes.map((img, i) => (
        <div key={(img.id ?? i).toString()} className="relative group">
          <img
            src={img.url_foto}
            alt={`Foto ${i + 1}`}
            className="w-full h-40 object-cover rounded shadow border"
          />

          {editable && onDelete && (
            <button
              type="button"
              onClick={() => onDelete(i)}
              className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shadow hover:bg-red-700 opacity-90 group-hover:opacity-100"
              title="Eliminar foto"
            >
              ×
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

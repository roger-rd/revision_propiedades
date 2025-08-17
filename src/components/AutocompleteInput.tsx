import { useEffect, useRef, useState } from "react";
import { useFetchAutocomplete } from "../hooks/useFetchAutocomplete";
import { PlacePrediction, ResultadoSeleccionado } from "../interface/clienteInterface";
import api from "../services/api";

interface Props {
  value: string;
  onChange: (direccion: string) => void;
  onSelect: (resultado: ResultadoSeleccionado) => void;
}

export const AutocompleteInput: React.FC<Props> = ({ value, onChange, onSelect }) => {
  const [showOptions, setShowOptions] = useState(false);
  const [highlight, setHighlight] = useState<number>(-1);
  const listRef = useRef<HTMLUListElement | null>(null);
  const { predicciones, sessionToken, endSession } = useFetchAutocomplete(value);

  useEffect(() => {
    if (value.trim().length < 4) setShowOptions(false);
  }, [value]);

  const doSelect = async (p: PlacePrediction) => {
    try {
      const { data } = await api.get(`/place-details/${p.placeId}`, {
        params: { sessionToken }, // importante para el cobro por sesión
      });

      const direccion = data.formattedAddress || "";
      const lat = data.location?.latitude?.toString() || "";
      const lng = data.location?.longitude?.toString() || "";

      if (!direccion || !lat || !lng) {
        console.warn("Datos incompletos desde Place Details:", data);
        return;
      }

      onSelect({ direccion, latitud: lat, longitud: lng, place_id: p.placeId });
      onChange(direccion);
      setShowOptions(false);
      setHighlight(-1);
    } catch (e) {
      console.error("Error al obtener detalles del lugar:", e);
    } finally {
      // cerramos la sesión al confirmar selección -> 1 sesión, 1 cobro
      endSession();
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showOptions || predicciones.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((h) => (h + 1) % predicciones.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => (h - 1 + predicciones.length) % predicciones.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const p = predicciones[highlight >= 0 ? highlight : 0];
      if (p) doSelect(p);
    } else if (e.key === "Escape") {
      setShowOptions(false);
      setHighlight(-1);
      endSession(); // cancelar sesión si el usuario escapa
    }
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onFocus={() => value.trim().length >= 4 && setShowOptions(true)}
        onBlur={() => setTimeout(() => setShowOptions(false), 120)}
        onKeyDown={onKeyDown}
        onChange={(e) => {
          onChange(e.target.value);
          setShowOptions(true);
          setHighlight(-1);
        }}
        placeholder="Ingresa dirección"
        className="w-full border border-gray-300 rounded px-3 py-2"
      />
      {showOptions && predicciones.length > 0 && (
        <ul
          ref={listRef}
          className="absolute bg-white border mt-1 w-full z-10 shadow-md max-h-60 overflow-y-auto rounded"
        >
          {predicciones.map((p, idx) => (
            <li
              key={p.placeId}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => doSelect(p)}
              onMouseEnter={() => setHighlight(idx)}
              className={`p-2 cursor-pointer ${highlight === idx ? "bg-gray-100" : "hover:bg-gray-50"}`}
            >
              <strong>{p.textoPrincipal}</strong>
              <div className="text-sm text-gray-600">{p.textoSecundario}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

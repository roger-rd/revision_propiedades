import { useEffect, useRef, useState } from "react";
import api from "../services/api";
import { PlacePrediction, GooglePlaceSuggestion } from "../interface/clienteInterface";
import { newSessionToken } from "../utils/sessionToken";


export function useFetchAutocomplete(input: string) {
  const [predicciones, setPredicciones] = useState<PlacePrediction[]>([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // token de sesión compartido para toda la búsqueda
  const sessionRef = useRef<string | null>(null);
  // cache simple para ahorrar llamadas
  const cacheRef = useRef<Map<string, PlacePrediction[]>>(new Map());

  useEffect(() => {
    const term = input.trim();
    if (term.length < 4) {
      setPredicciones([]);
      return;
    }

    // crea token si no hay
    if (!sessionRef.current) sessionRef.current = newSessionToken();

    // cache
    const cached = cacheRef.current.get(term);
    if (cached) {
      setPredicciones(cached);
      return;
    }

    let cancel = false;
    const fetchData = async () => {
      setCargando(true);
      try {
        const { data } = await api.get("/autocomplete", {
          params: { input: term, sessionToken: sessionRef.current },
        });

        const preds: PlacePrediction[] = (data?.suggestions || []).map((s: GooglePlaceSuggestion) => ({
          textoPrincipal: s.placePrediction.structuredFormat.mainText.text,
          textoSecundario: s.placePrediction.structuredFormat.secondaryText.text,
          placeId: s.placePrediction.placeId,
        }));

        if (!cancel) {
          setPredicciones(preds);
          cacheRef.current.set(term, preds);
          setError(null);
        }
      } catch (e) {
        if (!cancel) {
          console.error(e);
          setError("Error al obtener sugerencias");
          setPredicciones([]);
        }
      } finally {
        if (!cancel) setCargando(false);
      }
    };

    const t = setTimeout(fetchData, 650); // debounce más alto
    return () => {
      cancel = true;
      clearTimeout(t);
    };
  }, [input]);

  // función para cerrar la sesión desde el componente
  const endSession = () => {
    sessionRef.current = null;
  };

  return { predicciones, cargando, error, sessionToken: sessionRef.current, endSession };
}

// src/services/geocoding.ts
import axios from "axios";

export async function obtenerCoordenadas(direccion: string): Promise<{
  lat: string;
  lng: string;
  place_id: string;
  formatted_address: string;
} | null> {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
    direccion
  )}&key=${apiKey}`;

  try {
    const response = await axios.get(url);
    const result = response.data.results[0];

    if (!result) return null;

    return {
      lat: result.geometry.location.lat.toString(),
      lng: result.geometry.location.lng.toString(),
      place_id: result.place_id,
      formatted_address: result.formatted_address,
    };
  } catch (error) {
    console.error("Error al obtener coordenadas:", error);
    return null;
  }
}

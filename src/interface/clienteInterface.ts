export interface Cliente {
  id: number;
  nombre: string;
  rut: string;
  correo: string;
  telefono: string;
  direccion: string;
  latitud?: string;
  longitud?: string;
  place_id?: string;
  id_empresa: number;
  numero_vivienda:string
}

export interface PlacePrediction {
  formattedAddress: string;
  location: {
    latitude: number;
    longitude: number;
  };
  id: string;
}

export interface GooglePlacesResponse {
  places: PlacePrediction[];
}

export interface PlacePrediction {
  placeId: string;
  textoPrincipal: string;
  textoSecundario: string;
  
}
export interface GooglePlaceSuggestion {
  placePrediction: {
    placeId: string;
    structuredFormat: {
      mainText: {
        text: string;
      };
      secondaryText: {
        text: string;
      };
    };
  };
}

export interface Props {
  value: string;
  onChange: (direccion: string) => void;
  onSelect: (data: {
    direccion: string;
    latitud: number;
    longitud: number;
    place_id: string;
  }) => void;
}

export interface AutocompleteInputProps {
  value: string;
  onChange: (direccion: string) => void;
  onSelect: (data: {
    direccion: string;
    latitud: number;
    longitud: number;
    place_id: string;
  }) => void;
}

export interface ResultadoSeleccionado {
  direccion: string;
  latitud: string;
  longitud: string;
  place_id: string;
}
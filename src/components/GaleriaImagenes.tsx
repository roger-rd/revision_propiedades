import { GaleriaImagenesProps } from "../interface/solicitudesInterface";

export default function GaleriaImagenes( {imagenes}: GaleriaImagenesProps ) {
    if(GaleriaImagenes.length === 0){
        return <p className="text-gray-500 text-sm">Sin imagenes registradas.</p>
    }
    return (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
            {imagenes.map((img, i) => (
                <img
                key={i}
                src={img.url_foto}
                alt={`Foto ${i + 1}`}
                className="w-full h-40 object-cover rounded shadow border"
                />
            ))}
            </div>
        );
}
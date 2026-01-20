import { useState } from "react";
import type { AiMessageCardProps } from "../../types/search";
import { MoveDown } from "lucide-react";

export default function AiMessageCard({
    message, 
    citations,
    loading
}:AiMessageCardProps) {
    const [openTarjeta, setOpenTarjeta] = useState<boolean>(false);
  return (
    <div className={`contenedor-tarjeta-mensaje-ia`}>
        <p className="disclaimer-tarjeta-mensaje-ia">
            Las respuestas de Inteligencia Artificial - IA proporciona respuestas precisas, aunque no infalibles. la información es indicativa, verifica la respuesta y las referencias.
        </p>

        {loading ? (
            <p className="cargando-mensaje-ia">
                Analizando y generando respuesta...
                <div className="rayo-luz-cargando-mensaje-ia"></div>
            </p>
        ) : (
            <>
            {message && (
                <p className={`mensaje-ia ${!openTarjeta &&"mensaje-ia-cerrado"}`}>
                    {message}
                </p>
            )}
            </>
        )}
        <div className={`contenedor-enlaces-referencias ${!openTarjeta && "referencias-cerrado"}`}>
            {citations?.map((citacion, index) => (
                <a className="contenedor-referencia-ia" key={index} href={`https://gestornormativo.creg.gov.co/gestor/entorno/docs/${citacion.title}`} target="_blank">
                    {citacion.title}
                </a>
            ))}
        </div>
        {!openTarjeta && (
            <button className="boton-mostrar-mas-mensaje-ia" onClick={() => setOpenTarjeta(!openTarjeta)}>
                Mostrar mas
                <MoveDown  size={"1em"}/>
            </button>
        )}
    </div>
  )
}
import { useState } from "react";
import type { AiMessageCardProps } from "../../types/search";
import { ChevronDown, ChevronUp, MoveDown } from "lucide-react";
import { toggle } from "../../utils/utils";
import { URL_REFERENCIAS } from "../../services/search.service";

export default function AiMessageCard({
    message, 
    citations,
    loading
}:AiMessageCardProps) {
    const [openTarjeta, setOpenTarjeta] = useState<boolean>(false);
    const [openReferencias, setOpenReferencias] = useState<boolean>(false);
    const [openContenidoReferencias, setOpenContenidoReferencias] = useState<Set<string>>(new Set())
  return (
    <div className={`contenedor-tarjeta-mensaje-ia`}>
        <h2 className="titulo-tarjeta-mensaje-ia">
            Respuesta integrada con JurIA
        </h2>

        <p className="disclaimer-tarjeta-mensaje-ia">
            JurIA proporciona respuestas precisas, aunque no infalibles. La información es indicativa, verifica la respuesta y las referencias.
        </p>

        {loading ? (
            <div className="cargando-mensaje-ia">
                <span>Analizando y generando respuesta...</span>
            </div>
        ) : (
            <>
            {message && (
                <>
                    <p 
                        className={`mensaje-ia ${!openTarjeta &&"mensaje-ia-cerrado"}`} 
                        dangerouslySetInnerHTML={{__html: message}} 
                    />
                    <div className="contenedor-referencias-mensaje-ia">
                        <button className="boton-desplegar-enlaces-referencias" onClick={() => setOpenReferencias(!openReferencias)}>
                            <span className="texto-boton-desplegar-enlaces-referencias">
                                Fuentes consultadas
                            </span>
                            {openReferencias ? <ChevronUp /> : <ChevronDown />}
                        </button>

                        <div className={`contenedor-enlaces-referencias ${!openReferencias && "referencias-cerrado"}`}>
                            {citations?.map((citacion, index) => (
                                <div className="contenedor-referencia-ia" key={index}>
                                    <div className="contenedor-encabezado-referencia-ia">
                                        <span className="contenedor-numero-referencia-ia">
                                            {citacion.number}
                                        </span> 
                                        <h3 className="titulo-referencias-ia">
                                            {citacion.title.replace(".htm","")}
                                        </h3>
                                        <button className="boton-open-contenido-referencias" onClick={() => toggle(setOpenContenidoReferencias, citacion.title)}>
                                            {openContenidoReferencias.has(citacion.title) ? <ChevronUp /> : <ChevronDown />}
                                        </button>
                                    </div>
                                    {openContenidoReferencias.has(citacion.title) && (
                                        <div className="contenedor-contenido-referencia-ia">
                                            <p className="contenido-referencia-ia">
                                                {citacion.content}
                                            </p>
                                            <a className="link-contenido-referencia-ia" href={`${URL_REFERENCIAS}/${citacion.title}`} target="_blank">Ver contenido completo</a>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}
            </>
        )}
        {(!openTarjeta && !loading) && (
            <button className="boton-mostrar-mas-mensaje-ia" onClick={() => setOpenTarjeta(!openTarjeta)}>
                Mostrar más
                <MoveDown  size={"1em"}/>
            </button>
        )}
    </div>
  )
}
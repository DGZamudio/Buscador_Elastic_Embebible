import { useState } from "react";
import type { ResultsWindowModalProps } from "../../types/search";
import AiMessageCard from "../ui/AiMessageCard";
import SearchResultsContent from "./SearchResultsContent";

export default function ResultsWindowModal({ 
    aiResponse,
    results,
    loadingAiResponse,
    handleNextResults,
    disableVerMas
} : ResultsWindowModalProps) {
    const [windowResponseMode, setWindowResponseMode] = useState<"ai" | "results">("ai");
  return (
    <div className="contenedor-ventana-resultados">
        <div className="contenedor-header-ventana-resultados">
            <button className={`ventana-resultados-opcion ${windowResponseMode === "ai" ? "ventana-resultados-opcion-activa" : ""}`} onClick={() => setWindowResponseMode("ai")}>
                JurIA
            </button>
            <button className={`ventana-resultados-opcion ${windowResponseMode === "results" ? "ventana-resultados-opcion-activa" : ""}`} onClick={() => setWindowResponseMode("results")}>
                Resultados de búsqueda
            </button>
        </div>
        <div className="contenedor-contenido-ventana-resultados">
            {windowResponseMode === "ai" ? (
                <>
                    {(aiResponse || loadingAiResponse) && (
                        <>
                            <div className="contenedor-panel-ventana-resultados">
                                <SearchResultsContent 
                                    results={results.slice(0,3)}
                                    visible
                                />
                                <button className="contenedor-ver-mas-resultados" onClick={() => setWindowResponseMode("results")}>
                                    Ver mas resultados de búsqueda...
                                </button>
                            </div>
                            <AiMessageCard
                                message={aiResponse?.message}
                                citations={aiResponse?.citations}
                                loading={loadingAiResponse}
                            />
                        </>
                    )}
                </>
            ) : (
                <div className="contenedor-resultados-busqueda-ventana">
                    <SearchResultsContent 
                        results={results}
                        visible
                    />
                    <button disabled={disableVerMas} onClick={() => handleNextResults()} className="boton-ver-mas-resultados">
                        Ver mas
                    </button>
                </div>

            )}
        </div>
    </div>
  )
}
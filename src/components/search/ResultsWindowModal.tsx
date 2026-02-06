import type { ResultsWindowModalProps } from "../../types/search";
import AiMessageCard from "../ui/AiMessageCard";
import SearchResultsContent from "./SearchResultsContent";

export default function ResultsWindowModal({ 
    aiResponse,
    results,
    loadingAiResponse,
    handleNextResults,
    disableVerMas,
    hideVerMas,
    windowResponseMode,
    setWindowResponseMode
} : ResultsWindowModalProps) {
    
  return (
    <div className="contenedor-ventana-resultados">
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
                                    Ver más documentos...
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
                    {!hideVerMas && (
                        <button disabled={disableVerMas} onClick={() => handleNextResults()} className="boton-ver-mas-resultados">
                            Ver más
                        </button>
                    )}
                </div>

            )}
        </div>
    </div>
  )
}
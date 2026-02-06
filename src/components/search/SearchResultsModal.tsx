"use client"
import "../../styles/Componentes_Modales.css"
import { useEffect } from "react"
import type { ResultsModalProps } from "../../types/search"
import { FileText, Sparkle } from "lucide-react"

export default function ResultsModal({
  open,
  onClose,
  onRender,
  children,
  windowResponseMode,
  setWindowResponseMode
}: ResultsModalProps) {
    useEffect(() => {
        if (!open) return

        const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose()
        }

        document.addEventListener("keydown", handleKeyDown)
        return () => document.removeEventListener("keydown", handleKeyDown)
    }, [open, onClose])

    useEffect(() => {
        if (!open) return
        onRender()
    }, [open])

    if (!open) return null

    return (
        <div className="modal-resultados-contenedor">
            <div className="modal-resultados-panel">
                <div className="modal-resultados-header">
                    <div className="contenedor-header-modal-resultados">
                        <h2 className="modal-resultados-titulo">Esto encontramos:</h2>
                        <div className="contenedor-header-ventana-resultados">
                            <button className={`ventana-resultados-opcion ${windowResponseMode === "ai" ? "ventana-resultados-opcion-activa" : ""}`} onClick={() => setWindowResponseMode("ai")}>
                                <Sparkle />
                                JurIA
                            </button>
                            <button className={`ventana-resultados-opcion ${windowResponseMode === "results" ? "ventana-resultados-opcion-activa" : ""}`} onClick={() => setWindowResponseMode("results")}>
                                <FileText />
                                Listado de documentos
                            </button>
                        </div>
                    </div>
                </div>

                <div className="modal-resultados-contenido">
                    {children}
                </div>

                {/* <div className="modal-resultados-footer">
                    <button onClick={() => setPage(-1)} disabled={page == 0} className="modal-resultados-boton-paginacion">
                        <StepBack 
                            size={"1em"}
                        />
                        Anterior
                    </button>
                    <p className="modal-resultados-indicador-pagina">
                        {(page ?? 0) + 1} - {pages}
                    </p>
                    <button onClick={() => setPage(1)} disabled={page + 1 == pages} className="modal-resultados-boton-paginacion">
                        Siguiente
                        <StepForward 
                            size={"1em"}
                        />
                    </button>
                </div> */}
            </div>
        </div>
    )
}

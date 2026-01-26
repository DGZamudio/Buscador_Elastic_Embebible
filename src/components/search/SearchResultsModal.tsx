"use client"
import "../../styles/Componentes_Modales.css"
import { useEffect } from "react"
import type { ResultsModalProps } from "../../types/search"

export default function ResultsModal({
  open,
  onClose,
  onRender,
  children
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
                    <div>
                        <h2 className="modal-resultados-titulo">Esto encontramos:</h2>
                        <p className="modal-resultados-subtitulo">
                            Resultados mejorados usando búsqueda semántica
                        </p>
                    </div>
                    {/* <button
                        onClick={onClose}
                        className="modal-resultados-boton-cerrar"
                    >
                        <X size="1.2em" />
                    </button> */}
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

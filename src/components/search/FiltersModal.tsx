"use client"
import "../../styles/Componentes_Modales.css"
import { useEffect } from "react"
import { X } from "lucide-react"
import type { ModalProps } from "../../types/search"

export default function FiltersModal({
  open,
  onClose,
  onCancel,
  onSave,
  children,
}: ModalProps) {
  useEffect(() => {
    if (!open) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel()
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [open, onCancel])

  if (!open) return null

  return (
    <div className="filtros-modal-overlay">
        <div
            className="filtros-modal-fondo"
            onClick={onClose}
        />

        <div className="filtros-modal-contenedor">
            <div className="filtros-modal-caja">
                <div className="filtros-modal-encabezado">
                    <h2 className="filtros-modal-titulo">
                        Filtros avanzados
                    </h2>

                    <button
                        onClick={onClose}
                        className="filtros-modal-boton-cerrar"
                    >
                        <X size="1.2em" />
                    </button>
                </div>

                <div className="filtros-modal-contenido">
                    {children}
                </div>

                <div className="filtros-modal-pie">
                    <button
                        onClick={onCancel}
                        className="filtros-modal-boton-cancelar"
                    >
                        Cancelar
                    </button>

                    <button
                        onClick={onSave}
                        className="filtros-modal-boton-aplicar"
                    >
                        Aplicar
                    </button>
                </div>
            </div>
        </div>
    </div>
  )
}

"use client"

import type { SearchBarProps } from "../../types/search";
import { BrushCleaning, Search, SlidersHorizontal, Sparkles } from "lucide-react";

function SearchBar({
    value,
    onChange,
    onSubmit,
    onOpenFilters,
    onCleanFilters,
    filterActive,
    placeholder = "Escribe tu duda jurídica aquí...",
    visibleJurIaButton 
}: SearchBarProps) {
    const handleSubmit = () => {
        if (!value || value == "") return

        onSubmit?.()
    }
  return (
    <form 
        onSubmit={(e) => {
            e.preventDefault();
            handleSubmit()
        }}
        className="buscador-formulario"
    >
        <div
            className="buscador-contenedor"
        >
            <input
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="buscador-input"
            />
            {filterActive && (
                <button
                    className="buscador-boton buscador-boton-limpiar"
                    type="button"
                    onClick={onCleanFilters}
                >
                    <BrushCleaning size="1.2em"/>
                </button>
            )}
            <button
                className={`buscador-boton buscador-boton-filtros ${
                filterActive ? "buscador-boton-activo" : ""
            }`}
                type="button"
                onClick={onOpenFilters}
            >
                <SlidersHorizontal 
                    className="buscador-icono-filtros"
                    size="1.2em"
                />
            </button>
            <button
                className="buscador-boton buscador-boton-buscar"
                onClick={handleSubmit}
            >
                <Search
                    className="buscador-icono-buscar"
                    size="1.2rem"
                />
            </button>
            {visibleJurIaButton && (
                <div className="contenedor-boton-modo-jur-ia">
                    <a className="boton-modo-jur-ia" href="https://www.juria.co" target="_blank">
                        <Sparkles />
                        Modo JurIA
                    </a>
                </div>
            )}
        </div>
    </form>
  )
}

export default SearchBar
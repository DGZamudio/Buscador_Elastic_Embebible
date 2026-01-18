import "../../styles/Componentes_Filtros.css"
import type { FilterTextProps } from "../../types/search"
import { X } from "lucide-react"

function FilterText({
    value,
    onChange,
    clear,
    label,
    placeholder
}:FilterTextProps) {

    return (
        <div className="grupo-campo-filtro">
            <label className="etiqueta-campo-filtro">
                {label}
            </label>
            <div className="contenedor-input-casilla-numero-filtro">
                <input 
                    value={value ?? ""}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className="campo-input-filtro"
                    type="text"
                />
                {(value ?? "") !== "" && (
                    <button className="boton-limpiar-filtro" onClick={clear}>
                        <X className="cursor-pointer" />
                    </button>
                )}
            </div>
        </div>
    )
}

export default FilterText
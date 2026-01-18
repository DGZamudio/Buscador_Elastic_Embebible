import "../../styles/Componentes_Filtros.css"
import type { FilterSelectProps } from "../../types/search"
import { X } from "lucide-react"

function FilterText({
    value,
    options,
    onChange,
    clear,
    label,
    placeholder
}:FilterSelectProps) {

    return (
        <div className="grupo-campo-filtro">
            <label className="etiqueta-campo-filtro">
                {label}
            </label>
            <div className="contenedor-input-casilla-numero-filtro">
                <select className="campo-select-filtro">
                    {options.map((opcion) => (
                        <option key={opcion.key} value={opcion.key}>{opcion.key}</option>
                    ))}
                </select>
                <input 
                    value={value ?? ""}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className="campo-input-filtro"
                    type="text"
                />
                {(value ?? "") !== "" && (
                    <button onClick={clear}>
                        <X className="boton-limpiar-filtro" />
                    </button>
                )}
            </div>
        </div>
    )
}

export default FilterText
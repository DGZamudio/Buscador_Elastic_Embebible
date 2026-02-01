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
            <div className="contenedor-input-casilla-select-filtro">
                <select onChange={(e) => onChange(e.target.value)} className="campo-select-filtro">
                    {options.map((opcion) => (
                        <option key={opcion.key} value={opcion.key}>{opcion.key}</option>
                    ))}
                </select>
                <input 
                    value={value ?? ""}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder ?? ""}
                    className="campo-input-filtro"
                    type="text"
                />
                {(value ?? "") !== "" && (
                    <button className="boton-limpiar-filtro" onClick={clear}>
                        <X />
                    </button>
                )}
            </div>
        </div>
    )
}

export default FilterText
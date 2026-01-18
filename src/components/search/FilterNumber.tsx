import "../../styles/Componentes_Filtros.css"
import type { FilterNumberProps } from "../../types/search"

function FilterNumber({
    value,
    onChange,
    label,
    placeholder
}:FilterNumberProps) {

    return (
        <div className="grupo-campo-filtro">
            <label className="etiqueta-campo-filtro">
                {label}
            </label>
            <div className="contenedor-input-casilla-numero-filtro">
                <input 
                    value={value ?? ""}
                    onChange={(e) => onChange(e.target.value === "" ? undefined : Number(e.target.value))}
                    placeholder={placeholder}
                    className="campo-input-filtro"
                    type="number"
                />
            </div>
        </div>
    )
}

export default FilterNumber
import "../../styles/Componentes_Filtros.css"
import type { FilterYearsProps } from "../../types/search"

function FilterYears({
    yearFrom,
    yearTo,
    onChangeyearFrom,
    onChangeyearTo
}:FilterYearsProps) {
    return (
        <div className="rango-anios-filtro">
            <label className="etiqueta-campo-filtro">
                Rango de años:
            </label>
            <input 
                value={yearFrom ?? ""}
                onChange={(e) => onChangeyearFrom(e.target.value === "" ? undefined : e.target.value)}
                placeholder="Año inicial"
                className="campo-input-filtro campo-input-rango"
                type="number"
            />

            <span className="separador-rango-anios">-</span>

            <input 
                value={yearTo ?? ""}
                onChange={(e) => onChangeyearTo(e.target.value === "" ? undefined : e.target.value)}
                placeholder="Año final"
                className="campo-input-filtro campo-input-rango"
                type="number"
            />
        </div>
    )
}

export default FilterYears
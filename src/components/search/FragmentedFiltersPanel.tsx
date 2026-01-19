import "../../styles/Faceta.css"
import type { FragmentedFiltersProps } from "../../types/search";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import Loader from "../ui/Loader";

export default function FragmentedFilters({
  fragments,
  visible,
  onFilter,
  loading
}: FragmentedFiltersProps) {
  const [openTipos, setOpenTipos] = useState<Set<string>>(new Set());
  const [openEntidades, setOpenEntidades] = useState<Set<string>>(new Set());

  function toggle(setter: typeof setOpenTipos | typeof setOpenEntidades, key: string) {
    setter((prev: Set<string>) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }

  if (!visible) return null;

  return (
    <div className="filtros-facetados">
        {loading ? (
            <Loader variant="filters" visible/>
        ) : (
            <>
                {fragments?.tipo.buckets.map((tipo, index) => {
                    const tipoOpen = openTipos.has(tipo.key);

                    return (
                    <div key={tipo.key} className="filtros-facetados-tipo" style={index == fragments?.tipo.buckets.length -1 ? {border:"none"} : undefined}>
                        <button
                            onClick={() => {
                                toggle(setOpenTipos, tipo.key)
                                onFilter({
                                    document_type: tipo.key
                                })
                            }}
                            className="filtros-facetados-tipo-boton"
                        >
                            {tipoOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                            <span className="filtros-facetados-tipo-nombre">
                                {tipo.key}
                            </span>
                            <span className="filtros-facetados-contador">
                                {tipo.doc_count}
                            </span>
                        </button>

                        {tipoOpen && (
                            <div className="filtros-facetados-entidades">
                                {tipo.entidad.buckets.map(entidad => {
                                    const entidadKey = `${tipo.key}-${entidad.key}`;
                                    const entidadOpen = openEntidades.has(entidadKey);

                                    return (
                                        <div key={entidadKey} className="filtros-facetados-entidad">
                                            <button
                                                onClick={() => {
                                                    toggle(setOpenEntidades, entidadKey)
                                                    onFilter({
                                                        entity: entidad.key,
                                                        document_type: tipo.key
                                                    })
                                                }}
                                                className="filtros-facetados-entidad-boton"
                                            >
                                                {entidadOpen ? (
                                                    <ChevronDown size={14} />
                                                ) : (
                                                    <ChevronRight size={14} />
                                                )}
                                                <span className="filtros-facetados-entidad-nombre">
                                                    {entidad.key}
                                                </span>
                                                <span className="filtros-facetados-contador-secundario">
                                                    {entidad.doc_count}
                                                </span>
                                            </button>

                                            {entidadOpen && (
                                                <div className="filtros-facetados-anios">
                                                    {entidad.year.buckets.map(year => (
                                                        <button
                                                            key={year.key}
                                                            className="filtros-facetados-anio"
                                                            onClick={() => onFilter({
                                                                entity: entidad.key,
                                                                document_type: tipo.key,
                                                                years: {
                                                                    year_to: year.key_as_string,
                                                                    year_from: year.key_as_string
                                                                }
                                                            })}
                                                        >
                                                            {year.key_as_string} ({year.doc_count})
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                        </div>
                        )}
                    </div>
                    );
                })}
            </>
        )}
    </div>
  );
}

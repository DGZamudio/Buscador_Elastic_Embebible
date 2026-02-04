import "../../styles/Faceta.css"
import type { FragmentedFiltersProps } from "../../types/search";
import { ChevronDown, ChevronRight, Funnel } from "lucide-react";
import { useEffect, useState } from "react";
import Loader from "../ui/Loader";

export default function FragmentedFilters({
  fragments,
  visible,
  onFilter,
  loading
}: FragmentedFiltersProps) {
  const [openFiltrosFacetados, setOpenFiltrosFacetados] = useState<boolean>(true)
  const [openClasificacion, setOpenClasificacion] = useState<Set<string>>(new Set());
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

  useEffect(() => { //Cierra el panel en pantallas pequeñas
    const mediaQuery = window.matchMedia("(max-width: 768px)");

    const handleChange = () => {
        setOpenFiltrosFacetados(!mediaQuery.matches);
    };

    handleChange(); // estado inicial

    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  if (!visible) return null;
  return (
    <div className="filtros-facetados">
        {loading ? (
            <Loader variant="filters" visible/>
        ) : (
            <>
                <div 
                    className="filtros-facetados-header"
                >
                    <button
                        className="filtros-facetados-toggle"
                        onClick={() => setOpenFiltrosFacetados(o => !o)}
                    >
                        <Funnel 
                            size={"1.2rem"}
                        />
                        <span className="titulo-boton-filtros-facetados-toggle">Filtros Avanzados</span>
                    </button>
                </div>
                <div className={`filtros-facetados-body-wrapper ${openFiltrosFacetados ? "open" : ""}`}>
                    <div className="filtros-facetados-body">
                        {openFiltrosFacetados && (
                            <div className="filtros-facetados-body">
                                {(fragments?.tipo.normativa.length ?? 0) > 0 && (
                                    <div className="separador-filtros-facetados">
                                        <div className="titulo-separador-filtros-facetados" onClick={() => toggle(setOpenClasificacion, "normativa")}>
                                            Normativa
                                            {openClasificacion.has("normativa") ? <ChevronDown /> : <ChevronRight />}
                                        </div>
                                        {openClasificacion.has("normativa") && (
                                            <div className="contenedor-contenido-tipos-filtros-facetados">
                                                {fragments?.tipo.normativa.map((tipo, index) => {
                                                    const tipoOpen = openTipos.has(tipo.key);

                                                    return (
                                                        <div key={tipo.key} className="filtros-facetados-tipo" style={index == fragments?.tipo.normativa.length -1 ? {border:"none"} : undefined}>
                                                            <button
                                                                onClick={() => {
                                                                    toggle(setOpenTipos, tipo.key)
                                                                    onFilter({
                                                                        document_type: tipo.key
                                                                    })
                                                                }}
                                                                className={`filtros-facetados-tipo-boton ${tipoOpen && "faceta-open"}`}
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
                                                                                    className={`filtros-facetados-entidad-boton `}
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
                                            </div>
                                        )}
                                    </div>
                                )}
                                {(fragments?.tipo.jurisprudencia.length ?? 0) > 0 && (
                                    <div className="separador-filtros-facetados">
                                        <div className="titulo-separador-filtros-facetados" onClick={() => toggle(setOpenClasificacion, "jurisprudencia")}>
                                            Jurisprudencia
                                            {openClasificacion.has("jurisprudencia") ? <ChevronDown /> : <ChevronRight />}
                                        </div>
                                        {openClasificacion.has("jurisprudencia") && (
                                            <div className="contenedor-contenido-tipos-filtros-facetados">
                                                {fragments?.tipo.jurisprudencia.map((tipo, index) => {
                                                    const tipoOpen = openTipos.has(tipo.key);

                                                    return (
                                                        <div key={tipo.key} className="filtros-facetados-tipo" style={index == fragments?.tipo.jurisprudencia.length -1 ? {border:"none"} : undefined}>
                                                            <button
                                                                onClick={() => {
                                                                    toggle(setOpenTipos, tipo.key)
                                                                    onFilter({
                                                                        document_type: tipo.key
                                                                    })
                                                                }}
                                                                className={`filtros-facetados-tipo-boton ${tipoOpen && "faceta-open"}`}
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
                                                                                    className={`filtros-facetados-entidad-boton `}
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
                                            </div>
                                        )}
                                    </div>
                                )}
                                {(fragments?.tipo.other.length ?? 0) > 0 && (
                                    <div className="separador-filtros-facetados">
                                        <div className="titulo-separador-filtros-facetados" onClick={() => toggle(setOpenClasificacion, "other")}>
                                            Demás documentos
                                            {openClasificacion.has("other") ? <ChevronDown /> : <ChevronRight />}
                                        </div>
                                        {openClasificacion.has("other") && (
                                            <div className="contenedor-contenido-tipos-filtros-facetados" style={{border:"none"}}>
                                                {fragments?.tipo.other.map((tipo, index) => {
                                                    const tipoOpen = openTipos.has(tipo.key);

                                                    return (
                                                        <div key={tipo.key} className="filtros-facetados-tipo" style={index == fragments?.tipo.other.length -1 ? {border:"none"} : undefined}>
                                                            <button
                                                                onClick={() => {
                                                                    toggle(setOpenTipos, tipo.key)
                                                                    onFilter({
                                                                        document_type: tipo.key
                                                                    })
                                                                }}
                                                                className={`filtros-facetados-tipo-boton ${tipoOpen && "faceta-open"}`}
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
                                                                                    className={`filtros-facetados-entidad-boton`}
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
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </>
        )}
    </div>
  );
}

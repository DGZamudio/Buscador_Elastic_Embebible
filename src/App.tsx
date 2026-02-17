"use client"
import "./styles/Buscador.css"
import FilterText from "./components/search/FilterText";
import FiltersModal from "./components/search/FiltersModal";
import FilterYears from "./components/search/FilterYears";
import SearchBar from "./components/search/SearchBar";
import SearchResultsPanel from "./components/search/SearchResultsPanel";
import { useSearch } from "./hooks/useSearch";
import { useEffect, useRef, useState } from "react";
import ResultsModal from "./components/search/SearchResultsModal";
import Loader from "./components/ui/Loader";
import Typing from "./components/ui/isTyping"
import NoResults from "./components/ui/NoResults";
import FilterNumber from "./components/search/FilterNumber";
import FragmentedFilters from "./components/search/FragmentedFiltersPanel";
import ResultsWindowModal from "./components/search/ResultsWindowModal";
import FilterSelect from "./components/search/FilterSelect";
import { Sparkles } from "lucide-react";

export default function Buscador() {
  const {
    query,
    setQuery,
    filters,
    setFilters,
    results,
    loading,
    hasActiveFilters,
    fragmentedFilters,
    loadingFragments,
    setSearchType,
    setSelectedFacetaFilters,
    isTyping,
    aiResponse,
    loadingAiResponse,
    limit,
    setLimit,
    maxPages,
    searchFiltersOptions
  } = useSearch();

  const [filtersOpen, setFiltersOpen] = useState<boolean>(false)
  const [resultsOpen, setResultsOpen] = useState<boolean>(false)
  const [windowResponseMode, setWindowResponseMode] = useState<"ai" | "results">("ai");
  const availableAutoScroll = useRef(true);
  
  // Scroll when results open AND content has loaded
  useEffect(() => {
    if (!resultsOpen) {
        availableAutoScroll.current = true;
        return;
    }

    // Use a longer timeout to ensure the modal and all async content is rendered
    const timer = setTimeout(() => {
      const modalElement = document.querySelector('.modal-resultados-contenedor');
      if (modalElement && availableAutoScroll.current) {
        modalElement.scrollIntoView({ 
          behavior: "smooth", 
          block: "start" 
        });
      }
      availableAutoScroll.current = false;
    }, 300);

    return () => clearTimeout(timer);
  }, [resultsOpen, results]);

  return (
    <div className="contenedor-body">
        <main className="contenedor-main">
            <div className="contenedor-texto-buscador">
                <h1 className="titulo-buscador">
                    Búsqueda
                </h1>
                <p className='descripcion-buscador'>
                    Busca registros por palabras clave o datos del documento
                </p>
            </div>

            <div className="contenedor-buscador">
                <SearchBar
                    value={query}
                    onChange={(value) => {
                        setQuery(value)
                        setResultsOpen(false)
                        setSearchType("title")
                        setSelectedFacetaFilters({})
                    }}
                    onOpenFilters={() => setFiltersOpen(true)}
                    onSubmit={() => setResultsOpen(true)}
                    onCleanFilters={() => {
                        setFilters({})
                        setSelectedFacetaFilters({})
                    }}
                    filterActive={hasActiveFilters}
                    visibleJurIaButton={!resultsOpen}
                />

                <div className="contenedor-boton-modo-jur-ia contenedor-boton-modo-jur-ia-mobile">
                    <a className="boton-modo-jur-ia" href="https://www.juria.co" target="_blank">
                        <Sparkles />
                        Modo JurIA
                    </a>
                </div>

                <Typing visible={isTyping && !resultsOpen} />

                <Loader visible={!isTyping && loading}/>

                <NoResults variant="sugerencia" visible={!isTyping && !loading && query.length > 0 && results.length == 0} />

                {(!resultsOpen && !isTyping && !loading && query.length == 0) && (
                    <div className="contenedor-consejos-busqueda">
                        <div className="contenedor-contenido-consejos-busqueda">
                            <div className="titulo-consejos-busqueda">
                                <div className="titulo-consejos-busqueda-imagen">
                                    <img src="lightbulb.svg" alt="" />
                                </div>
                                <h2>
                                    Consejos de búsqueda
                                </h2>
                            </div>
                            <ul className="lista-consejos-busqueda">
                                <li>Usa palabras clave específicas para mejores resultados.</li>
                                <li>Combina múltiples términos para afinar su búsqueda.</li>
                                <li>Active el Modo JurIA para búsquedas jurídicas especializadas.</li>
                            </ul>
                        </div>
                    </div>
                )}
                
                {!resultsOpen && results.length > 0 && query.length > 0 && (
                    <div className="panel-resultados-flotante">
                        <SearchResultsPanel 
                            results={results}
                            visible={!resultsOpen && results.length > 0 && query.length > 0}
                        />
                    </div>
                )}

                <ResultsModal
                    open={resultsOpen}
                    onRender={() => setSearchType("semantic")}
                    onClose={() => {
                        setSelectedFacetaFilters({})
                        setSearchType("title")
                        setResultsOpen(false)
                    }}
                    windowResponseMode={windowResponseMode}
                    setWindowResponseMode={setWindowResponseMode}
                >
                    <div className="contenedor-resultados-modal">
                        <div className="layout-resultados">
                            <aside className='panel-filtros-lateral'>
                                <FragmentedFilters 
                                    fragments={fragmentedFilters}
                                    onFilter={(facetaSelectedFilters) => {
                                        availableAutoScroll.current=true
                                        setSearchType("regular")
                                        setSelectedFacetaFilters({
                                            ...facetaSelectedFilters
                                        })
                                    }}
                                    visible={
                                        (
                                            (fragmentedFilters?.tipo?.normativa?.length ?? 0) || 
                                            (fragmentedFilters?.tipo?.jurisprudencia?.length ?? 0) ||
                                            (fragmentedFilters?.tipo?.other?.length ?? 0)
                                        ) > 0 && resultsOpen && query.length > 0}
                                    loading={loadingFragments}
                                />
                            </aside>
                            
                            <section className="contenido-resultados">
                                <ResultsWindowModal 
                                    aiResponse={aiResponse ?? null}
                                    results={results}
                                    hideVerMas={limit >= maxPages}
                                    loadingAiResponse={loadingAiResponse}
                                    handleNextResults={() => setLimit(prev => prev + 10)}
                                    disableVerMas={loading}
                                    windowResponseMode={windowResponseMode}
                                    setWindowResponseMode={setWindowResponseMode}
                                />
                            </section>
                        </div>

                        <div className="contenedor-loader">
                            <Loader visible={loading}/>
                        </div>
                    </div>
                </ResultsModal>

                <FiltersModal
                    open={filtersOpen}
                    onSave={() => {
                        setFiltersOpen(false)
                    }}
                    onClose={() => {
                        setFiltersOpen(false)
                    }}
                    onCancel={() => {
                        setFiltersOpen(false);
                        setFilters({})
                    }}
                >
                    <FilterText
                        value={filters.title}
                        onChange={(frase) => setFilters(prev => ({
                            ...prev,
                            title: frase.trim()
                        }))}
                        clear={() => setFilters(prev => ({
                            ...prev,
                            title: undefined
                        }))}
                        label="Debe contener esto en el título:"
                        placeholder="Ej: Resolución del 2008"
                    />
                    <FilterText
                        value={filters.phrase}
                        onChange={(frase) => setFilters(prev => ({
                            ...prev,
                            phrase: frase.trim()
                        }))}
                        clear={() => setFilters(prev => ({
                            ...prev,
                            phrase: undefined
                        }))}
                        label="Debe contener esta frase:"
                        placeholder="Ingrese la frase..."
                    />
                    <FilterText
                        value={filters.not_include?.join(" ") ?? ""}
                        onChange={(palabras) => setFilters(prev => ({
                            ...prev,
                            not_include: palabras.split(" ")
                        }))}
                        clear={() => setFilters(prev => ({
                            ...prev,
                            not_include: undefined
                        }))}
                        label="NO Debe contener estas palabras:"
                        placeholder="Separa las palabras con espacios"
                    />
                    <FilterText
                        value={filters.must?.join(" ") ?? ""}
                        onChange={(palabras) => setFilters(prev => ({
                            ...prev,
                            must: palabras.split(" ")
                        }))}
                        clear={() => setFilters(prev => ({
                            ...prev,
                            must: undefined
                        }))}
                        label="Debe contener estas palabras:"
                        placeholder="Separa las palabras con espacios"
                    />
                    <FilterText
                        value={filters.should?.join(" ") ?? ""}
                        onChange={(palabras) => setFilters(prev => ({
                            ...prev,
                            should: palabras.split(" ")
                        }))}
                        clear={() => setFilters(prev => ({
                            ...prev,
                            should: undefined
                        }))}
                        label="Puede contener estas palabras:"
                        placeholder="Separa las palabras con espacios"
                    />
                    <div className='fila-filtros'>
                        <FilterSelect 
                            value={filters?.document_type}
                            options={(searchFiltersOptions?.tipos.buckets ?? [])}
                            onChange={(tipo_doc) => setFilters(prev => ({
                                ...prev,
                                document_type: tipo_doc
                            }))}
                            clear={() => setFilters(prev => ({
                                ...prev,
                                document_type: undefined
                            }))}
                            label="Define el tipo de documento"
                        />
                        <FilterSelect 
                            value={filters?.entity}
                            options={(searchFiltersOptions?.entidades.buckets ?? [])}
                            onChange={(entidad) => setFilters(prev => ({
                                ...prev,
                                entity: entidad
                            }))}
                            clear={() => setFilters(prev => ({
                                ...prev,
                                entity: undefined
                            }))}
                            label="Entidad que remite el documento"
                        />
                    </div>
                    <div className="fila-filtros">
                        <FilterText 
                            value={filters.proximity?.query}
                            onChange={(frase) => setFilters(prev => ({
                                ...prev,
                                proximity: {
                                    ...prev.proximity,
                                    query: frase
                                }
                            }))}
                            clear={() => setFilters(prev => ({
                                ...prev,
                                proximity: {
                                    ...prev.proximity,
                                    query: undefined
                                }
                            }))}
                            label="Estas palabras deben estan cerca"
                        />
                        <FilterNumber 
                            value={filters.proximity?.distance}
                            onChange={(numero) => setFilters(prev => ({
                                ...prev,
                                proximity: {
                                    ...prev.proximity,
                                    distance: numero
                                }
                            }))}
                            label="Distancia entre las palabras"
                        />
                    </div>
                    <FilterYears
                        yearFrom={filters.years?.year_from}
                        yearTo={filters.years?.year_to}
                        onChangeyearFrom={(year) =>
                            setFilters(prev => ({
                                ...prev,
                                years: {
                                    ...prev.years,
                                    year_from: year
                                }
                            }))
                        }
                        onChangeyearTo={(year) =>
                            setFilters(prev => ({
                                ...prev,
                                years: {
                                    ...prev.years,
                                    year_to: year
                                }
                            }))
                        }
                    />
                </FiltersModal>
            </div>
        </main>
    </div>
  );
}

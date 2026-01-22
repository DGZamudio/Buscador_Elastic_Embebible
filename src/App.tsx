"use client"
import "./styles/Buscador.css"
import FilterText from "./components/search/FilterText";
import FiltersModal from "./components/search/FiltersModal";
import FilterYears from "./components/search/FilterYears";
import SearchBar from "./components/search/SearchBar";
import SearchResultsPanel from "./components/search/SearchResultsPanel";
import { useSearch } from "./hooks/useSearch";
import { useState } from "react";
import ResultsModal from "./components/search/SearchResultsModal";
import SearchResultsContent from "./components/search/SearchResultsContent";
import Loader from "./components/ui/Loader";
import Typing from "./components/ui/isTyping"
import NoResults from "./components/ui/NoResults";
import FilterNumber from "./components/search/FilterNumber";
import FragmentedFilters from "./components/search/FragmentedFiltersPanel";
import AiMessageCard from "./components/ui/AiMessageCard";

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
    page,
    pages,
    setPage,
    setSearchType,
    setSelectedFacetaFilters,
    isTyping,
    aiResponse,
    loadingAiResponse
  } = useSearch();

  const [filtersOpen, setFiltersOpen] = useState<boolean>(false)
  const [resultsOpen, setResultsOpen] = useState<boolean>(false)

  return (
    <div className="contenedor-body">
        <main className="contenedor-main">
            <div className="contenedor-texto-buscador">
                <h1 className="titulo-buscador">
                    Búsqueda
                </h1>
                <p className='descripcion-buscador'>
                    Puede buscar por palabras dentro del documento, por frases, por palabras clave y por los datos que identifican un documento, puede prefijar los resultados para un tipo de documento antes de realizar la búsqueda, o puede filtrar los resultados por diferentes opciones.
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

                <Typing visible={isTyping} />

                <Loader visible={!isTyping && loading}/>

                <NoResults variant="sugerencia" visible={!isTyping && !loading && query.length > 0 && results.length == 0} />

                <div className="panel-resultados-flotante">
                    <SearchResultsPanel 
                        results={results}
                        visible={!resultsOpen && results.length > 0 && query.length > 0}
                    />
                </div>

                <ResultsModal
                    open={resultsOpen}
                    onRender={() => setSearchType("semantic")}
                    onClose={() => {
                        setSelectedFacetaFilters({})
                        setSearchType("title")
                        setResultsOpen(false)
                    }}
                    page={page}
                    pages={pages}
                    setPage={(delta) => 
                        setPage(prev => {
                            const next = (prev ?? 0) + delta;
                            if (next < 0) return 0;
                            if (next >= (pages ?? 0)) return (pages ?? 0) - 1;
                            return next;
                        })
                    }
                >
                    <div className="contenedor-resultados-modal">
                        <div className="layout-resultados">
                            <aside className='panel-filtros-lateral'>
                                <FragmentedFilters 
                                    fragments={fragmentedFilters}
                                    onFilter={(facetaSelectedFilters) => {
                                        setSearchType("regular")
                                        setSelectedFacetaFilters({
                                            ...facetaSelectedFilters
                                        })
                                    }}
                                    visible={(fragmentedFilters?.tipo?.buckets?.length ?? 0) > 0 && resultsOpen && query.length > 0}
                                    loading={loadingFragments}
                                />
                            </aside>
                            
                            <section className="contenido-resultados">
                                {(aiResponse || loadingAiResponse) && (
                                    <AiMessageCard
                                        message={aiResponse?.message}
                                        citations={aiResponse?.citations}
                                        loading={loadingAiResponse}
                                    />
                                )}
                                <SearchResultsContent 
                                    results={results}
                                    visible
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
                        label="Debe contener esto en el titulo:"
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
                        placeholder="Ingrese la frase"
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
                        label="NO debe contener estas palabras:"
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
                        <FilterText 
                            value={filters.document_type}
                            onChange={(tipo_doc) => setFilters(prev => ({
                                ...prev,
                                document_type: tipo_doc
                            }))}
                            clear={() => setFilters(prev => ({
                                ...prev,
                                document_type: undefined
                            }))}
                            label="Define el tipo de documento:"
                            placeholder="Ej: Leyes"
                        />
                        <FilterText 
                            value={filters.entity}
                            onChange={(entidad) => setFilters(prev => ({
                                ...prev,
                                entity: entidad
                            }))}
                            clear={() => setFilters(prev => ({
                                ...prev,
                                entity: undefined
                            }))}
                            label="Escribe la entidad que remite el documento:"
                            placeholder="Ej: Procuraduría General de la Nación"
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
                            label="Estas palabras deben estan cerca:"
                            placeholder="Ej: Ley resolución consejo"
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
                            label="Distancia entre las palabras cercanas:"
                            placeholder="Por defecto 8"
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

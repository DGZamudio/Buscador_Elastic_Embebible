import { useCallback, useEffect, useMemo, useState } from "react";
import { fragmentFilters, getAiMessage, regularSearch, semanticSearch } from "../services/search.service";
import type { aiResponseType, citationType, FragmentedFilters, SearchFilters, SearchHit, searchType } from "../types/search";

export function useSearch() {
    const [query, setQuery] = useState<string>("");
    const [results, setResults] = useState<SearchHit[]>([]);
    const [aiResponse, setAiResponse] = useState<aiResponseType | undefined>(undefined);
    const [searchType, setSearchType] = useState<searchType>("title");
    const [page, setPage] = useState<number>(0);
    const [pages, setPages] = useState<number>(0);
    const [filters, setFilters] = useState<SearchFilters>({});
    const [selectedFacetaFilters, setSelectedFacetaFilters] = useState<SearchFilters>({});
    const [fragmentedFilters, setFragmentedFilters] = useState<FragmentedFilters | null>();
    const [loading, setLoading] = useState<boolean>(false)
    const [loadingFragments, setLoadingFragments] = useState<boolean>(false);
    const [loadingAiResponse, setLoadingAiResponse] = useState<boolean>(false);
    const [isTyping, setIsTyping] = useState<boolean>(false);

    const normalizedFilters = useMemo(
        () => normalizeFilters({
            ...filters,
            ...selectedFacetaFilters
        }),
        [filters, selectedFacetaFilters]
    )

    const hasActiveFilters = useMemo(
        () => Object.keys(normalizedFilters).length > 0,
        [normalizedFilters]
    )

    function normalizeFilters(filters: SearchFilters): SearchFilters {
        const normalized = { ...filters }

        if (
            !filters.proximity?.query &&
            !filters.proximity?.distance
        ) {
            delete normalized.proximity
        }

        if (
            !filters.years?.year_from &&
            !filters.years?.year_to
        ) {
            delete normalized.years
        }

        return normalized
    }

    const memoizedUseGetFragmentedFilters = useCallback(() => {
        if (!query) {
            setFragmentedFilters(undefined);
            return;
        }

        setLoadingFragments(true)
        fragmentFilters(query, normalizedFilters, hasActiveFilters)
        .then((data) => setFragmentedFilters(data))
        .catch(console.error)
        .finally(() => setLoadingFragments(false))

    }, [query, normalizedFilters, hasActiveFilters])

    useEffect(() => {
        setPage(0);
    }, [query, normalizedFilters]);

    // Busqueda Regular
    useEffect(() => {
        setIsTyping(true)
        if (!query) {
            setResults([]);
            setIsTyping(false)
            return;
        }

        if (searchType === "semantic") return

        let localFilters:SearchFilters
        let localHasActiveFilters:boolean

        if (searchType === "title") {
            localFilters = {...normalizedFilters, title:normalizedFilters.title ?? query}
            localHasActiveFilters = true
        } else {
            localFilters = normalizedFilters
            localHasActiveFilters = hasActiveFilters
        }

        const delay = setTimeout(async () => {
            setIsTyping(false)
            setLoading(true);
            try {
                const data = await regularSearch(query, localFilters, localHasActiveFilters, page);
                setResults(data?.hits ?? []);
                setPages(data.max_pages);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }, 300); // debounce

        return () => clearTimeout(delay);
    }, [query, page, normalizedFilters, hasActiveFilters]);

    // Busqueda semantica
    useEffect(() => {
        if (!query) {
            setResults([]);
            return;
        }

        if (searchType !== "semantic") return

        setLoading(true)
        if (page === 0) {
            memoizedUseGetFragmentedFilters()
            setLoadingAiResponse(true)
            getAiMessage(query)
            .then((data) => {
                formatAiResponse(data)
                .then((aiResponse) => {
                    setAiResponse(aiResponse) 
                })
                .finally(() => setLoadingAiResponse(false))
            })
        }
        semanticSearch(query, normalizedFilters, hasActiveFilters, page)
        .then((data) => {
            setResults(data?.hits ?? [])
            setPages(data?.max_pages)
        })
        .catch(console.error)
        .finally(() => setLoading(false))
    }, [page, normalizedFilters, hasActiveFilters, searchType])

    return {
        query,
        setQuery,
        filters,
        setFilters,
        setSelectedFacetaFilters,
        results,
        loading,
        hasActiveFilters,
        fragmentedFilters,
        loadingFragments,
        pages,
        page,
        setPage,
        searchType,
        setSearchType,
        isTyping,
        aiResponse,
        loadingAiResponse
    };
}

// Funciones utiles - Utils
async function formatAiResponse(response:Response) {
    const docRegex = /\[doc(\d*)\]/g

    if (!response.body) return

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let resultText = '';

    while (true) {
        const { done, value } = await reader.read();

        if (done) break

        resultText += decoder.decode(value, { stream: true });
    } // Lee el stream de mensajes hasta que dejen de llegar

    resultText += decoder.decode();

    const parts = resultText.split("\n")
    let citacionesRaw: citationType[] = []
    let message = ''

    for (let i=0; i < parts.length; i++) {
        try {
            if (parts[i] == "") continue

            const iteration = JSON.parse(parts[i])
            let contenido = iteration.choices[0].messages[0].content

            if (contenido !== "") {
                if (contenido.includes("{")) {
                    contenido = JSON.parse(contenido)

                    if (contenido.citations) {
                        citacionesRaw = contenido.citations
                    }
                }
                else {
                    message += contenido
                }
            }
        }
        catch (err) {console.error("Ocurrio un error: ",err)}
    } // Separar y formatear datos, citaciones de mensaje

    const indicesCitaciones = [...message.matchAll(docRegex)] // Trasformamos los numeros de los documentos a un array

    const indicesCitacionesDicionario = countRelevanceCitations(indicesCitaciones) // Transformamos los números de los indices en un diccionario con la cantidad de veces que aparece
    const citacionesFiltradas = citacionesRaw?.filter((citacion, index) => Object.keys(indicesCitacionesDicionario).includes(index.toString()));
    return {"message":message, "citations":citacionesFiltradas}
}

function countRelevanceCitations(citationsIterator: RegExpExecArray[]) {
    const count: Record<string, number> = {}
    
    citationsIterator.forEach(match => {
        const index = (Number(match[1])-1).toString()
        if (count[index]) {
            count[index] += 1;
        } else {
            count[index] = 1;
        }
    });

    return count;
}

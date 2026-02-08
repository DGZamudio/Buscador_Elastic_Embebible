import { useCallback, useEffect, useMemo, useState } from "react";
import { fragmentFilters, getAiMessage, regularSearch, semanticSearch, getSearchFilters } from "../services/search.service";
import type { aiResponseType, citationType, FragmentedFilters, SearchFilters, SearchHit, searchType, initialFilters } from "../types/search";

export function useSearch() {
    const [query, setQuery] = useState<string>("");
    const [results, setResults] = useState<SearchHit[]>([]);
    const [aiResponse, setAiResponse] = useState<aiResponseType | undefined>(undefined);
    const [searchType, setSearchType] = useState<searchType>("title");
    const [page, setPage] = useState<number>(0);
    const [maxPages, setMaxPages] = useState<number>(0);
    const [limit, setLimit] = useState<number>(10);
    const [filters, setFilters] = useState<SearchFilters>({});
    const [searchFiltersOptions, setSearchFiltersOptions] = useState<initialFilters | null>()
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
        setLimit(10);
        setPage(0)
        setMaxPages(0)
    }, [query, filters]);

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
                const data = await regularSearch(query, localFilters, localHasActiveFilters, page, limit);
                setResults(data?.hits ?? []);
                setMaxPages(data.max_pages);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }, 300); // debounce

        return () => clearTimeout(delay);
    }, [page, query, limit, normalizedFilters, hasActiveFilters]);

    // Busqueda semantica
    useEffect(() => {
        if (!query) {
            setResults([]);
            return;
        }

        if (searchType !== "semantic") return


        setLoading(true)
        if (limit === 10) {
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
        semanticSearch(query, normalizedFilters, hasActiveFilters, page, limit)
        .then((data) => {
            setResults(data?.hits ?? [])
            setMaxPages(data.max_pages);
        })
        .catch(console.error)
        .finally(() => {
            setLoading(false)
        })
    }, [page, limit, normalizedFilters, hasActiveFilters, searchType])

    useEffect(() => {
        getSearchFilters()
        .then((data) => {
            setSearchFiltersOptions(data)
        })
        .catch(console.error)
    }, []) // Solo se ejecuta una vez, trae las entidades y tipos para seleccionar asi mejorando la busqueda mediante estos filtros

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
        page,
        setPage,
        maxPages,
        limit,
        setLimit,
        searchType,
        setSearchType,
        isTyping,
        aiResponse,
        searchFiltersOptions,
        loadingAiResponse
    };
}

// Funciones utiles - Utils
async function formatAiResponse(response: Response) {
    if (!response.body) return

    const reader = response.body.getReader()
    const decoder = new TextDecoder('utf-8')
    let resultText = ''

    while (true) {
        const { done, value } = await reader.read()
        if (done) break
        resultText += decoder.decode(value, { stream: true })
    }

    resultText += decoder.decode()

    const parts = resultText.split("\n")
    let citacionesRaw: citationType[] = []
    let message = ''

    for (const part of parts) {
        try {
            if (!part) continue
            const iteration = JSON.parse(part)
            const contenido = iteration.choices[0].messages[0].content

            if (!contenido) continue

            if (contenido.includes("{")) {
                const parsed = JSON.parse(contenido)
                if (parsed.citations) citacionesRaw = parsed.citations
            } else {
                message += contenido
            }
        } catch (err) {
            console.error("Ocurrió un error:", err)
        }
    }

    const { normalizedText, docMap } = normalizeDocReferences(message)

    const citationIndexMap: Record<number, number> = {}
    Object.entries(docMap).forEach(([docId, newIndex]) => {
        citationIndexMap[newIndex] = Number(docId.replace("doc", "")) - 1
    })

    const citacionesFiltradas = Object.keys(citationIndexMap)
        .sort((a, b) => Number(a) - Number(b))
        .map(key => {
            const visibleNumber = Number(key)
            const originalIndex = citationIndexMap[visibleNumber]

            return {
                number: visibleNumber,
                ...citacionesRaw[originalIndex]
            }
    })

    return {
        message: normalizedText,
        citations: citacionesFiltradas
    }
}


function normalizeDocReferences(text: string) {
    const docRegex = /\[(doc\d+)\]/g
    const docMap: Record<string, number> = {}
    let counter = 1

    const normalizedText = text.replace(docRegex, (_, docId) => {
        if (!docMap[docId]) {
            docMap[docId] = counter
            counter++
        }
        return `<button class="doc-reference">${docMap[docId]}</button>`
    })

    return { normalizedText, docMap }
}
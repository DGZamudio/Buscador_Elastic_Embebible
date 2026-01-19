import { useCallback, useEffect, useMemo, useState } from "react";
import { fragmentFilters, regularSearch, semanticSearch } from "../services/search.service";
import type { FragmentedFilters, SearchFilters, SearchHit, searchType } from "../types/search";

export function useSearch() {
    const [query, setQuery] = useState<string>("");
    const [results, setResults] = useState<SearchHit[]>([]);
    const [searchType, setSearchType] = useState<searchType>("title");
    const [page, setPage] = useState<number>(0);
    const [pages, setPages] = useState<number>(0);
    const [filters, setFilters] = useState<SearchFilters>({});
    const [selectedFacetaFilters, setSelectedFacetaFilters] = useState<SearchFilters>({});
    const [fragmentedFilters, setFragmentedFilters] = useState<FragmentedFilters | null>();
    const [loading, setLoading] = useState<boolean>(false)
    const [loadingFragments, setLoadingFragments] = useState<boolean>(false);
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
        }
        semanticSearch(query, normalizedFilters, hasActiveFilters, page)
        .then((data) => {
            setResults(data?.hits ?? [])
            setPages(data?.max_pages)
        })
        .catch(console.error)
        .finally(() => setLoading(false))
    }, [query, page, normalizedFilters, hasActiveFilters, searchType])

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
        isTyping
    };
}

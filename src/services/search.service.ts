import type { FragmentedFilters, SearchFilters, SearchResultsResponse } from "../types/search";

export async function regularSearch(
  query: string,
  filters: SearchFilters,
  hasActiveFilters: boolean,
  page: number = 0,
  limit: number = 10
): Promise<SearchResultsResponse> {
  if (!query) return {hits:[], max_pages:0};

  const params = new URLSearchParams();
  params.append("search_query", query);

  const response = await fetch(
    `http://127.0.0.1:8000/api/v1/regular_search?${params.toString()}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        filters: hasActiveFilters ? filters : null,
        skip: page ?? undefined,
        limit: limit ?? undefined
      })
    }
  );

  if (!response.ok) {
    throw new Error("Error HTTP");
  }

  const data = await response.json();
  return {hits:data?.hits, max_pages:data.max_pages};
}

export async function semanticSearch(
  query: string,
  filters: SearchFilters,
  hasActiveFilters: boolean,
  page: number = 0,
  limit: number = 10
): Promise<SearchResultsResponse> {
  if (!query) return {hits:[], max_pages:0};

  const params = new URLSearchParams();
  params.append("search_query", query);

  const response = await fetch(
    `http://127.0.0.1:8000/api/v1/semantic_search?${params.toString()}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        filters: hasActiveFilters ? filters : null,
        skip: page ?? undefined,
        limit: limit ?? undefined
      })
    }
  );

  if (!response.ok) {
    throw new Error("Error HTTP");
  }

  const data = await response.json();
  return {hits:data?.hits, max_pages:data.max_pages};
}

export async function fragmentFilters(
  query: string,
  filters: SearchFilters,
  hasActiveFilters: boolean
): Promise<FragmentedFilters | null> {

  if (!query) return null;

  const params = new URLSearchParams();
  params.append("search_query", query);

  const response = await fetch(
    `http://127.0.0.1:8000/api/v1/filter_fragments?${params.toString()}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        filters: hasActiveFilters ? filters : null
      })
    }
  );

  if (!response.ok) {
    throw new Error("Error HTTP");
  }

  const data = await response.json();

  return data?.filters ?? null;
}
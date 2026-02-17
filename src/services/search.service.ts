import type { FragmentedFilters, SearchFilters, SearchResultsResponse } from "../types/search";

const API_BASE_URL = "http://localhost:8000"
const API_MENSAJE_IA = "https://gacetas-constitucion.normograma.com/pgn4/conversation"
const ENTIDAD = "pgn"
export const URL_DOCS = "https://normograma.com/documentospdf/pgn/v3_iconos/compilacion/docs"
export const URL_REFERENCIAS = "https://normograma.com/LinksIA/pgn2"

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
    `${API_BASE_URL}/api/v1/${ENTIDAD}/search/regular?${params.toString()}`,
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
    `${API_BASE_URL}/api/v1/${ENTIDAD}/search/semantic?${params.toString()}`,
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
    `${API_BASE_URL}/api/v1/${ENTIDAD}/filter_fragments?${params.toString()}`,
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

export async function getSearchFilters(

) {
    const response = await fetch(
        `${API_BASE_URL}/api/v1/${ENTIDAD}/search/filters`
    )

    if (!response.ok) {
        throw new Error("Error HTTP");
    }

    const data = await response.json();

    return data?.filters ?? null;
}

export async function getAiMessage(
    query:string,
    role:string = "user"
) {
    const id = crypto.randomUUID();
    const date = new Date().toISOString()

    const response = await fetch(
        API_MENSAJE_IA,
        {
            method:"POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "messages":[
                    {
                        "id":id,
                        "role":role,
                        "content":query,
                        "date":date
                    }
                ]
            })
        }
    )

    return response
}
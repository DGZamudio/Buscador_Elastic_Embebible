export interface SearchHit {
    _score  : number;
    _source : {
        title           : string;
        body            : string;
        Epigrafe        : string;
        Year            : string;
        Numero          : string,
        Tipo            : string;
        Entidad         : string;
        "Sigla-Entidad" : string;
        Nombre          : string;
        NombreEpigrafe  : string;
    };

}

export type searchType = "title" | "semantic" | "regular";

export interface SearchBarProps {
    value          : string;
    onChange       : (value: string) => void;
    onSubmit?      : () => void;
    onOpenFilters  : () => void;
    onCleanFilters : () => void;
    placeholder?   : string;
    filterActive?  : boolean;
}

export interface SearchResultsProps {
  results : SearchHit[];
  visible : boolean;
};

export interface SearchResultsResponse {
    hits      : SearchHit[],
    max_pages : number;
}

type ProximityFilter = {
    distance? : number
    query?    : string
}
type YearFilter = {
    year_from? : string
    year_to?   : string
}

export interface SearchFilters {
    title?         : string
    proximity?     : ProximityFilter
    not_include?   : string[]
    phrase?        : string
    document_type? : string
    must?          : string[]
    should?        : string[]
    years?         : YearFilter
    entity?         : string
}

export interface ModalProps {
  open     : boolean;
  onSave   : () => void;
  onClose  : () => void;
  onCancel : () => void;
  children : React.ReactNode;
}

export interface FilterYearsProps {
  yearFrom?        : string;
  yearTo?          : string;
  onChangeyearFrom : (value?: string) => void;
  onChangeyearTo   : (value?: string) => void;
}

export interface FilterTextProps {
  value?      : string;
  onChange    : (value: string) => void;
  clear       : () => void;
  label       : string;
  placeholder : string;
}

type SelectOption = {
    key   : string;
    value : string;
}

export interface FilterSelectProps {
  value       : string;
  options     : SelectOption[];
  onChange    : (value: string) => void;
  clear       : () => void;
  label       : string;
  placeholder : string;
}

// Filtros fragmentados jerarquicamente 
type AggBucket = {
  key       : string
  doc_count : number
}

type FragmentedYear = {
  key           : number
  key_as_string : string
  doc_count     : number
}

type FragmentedEntidad = AggBucket & {
  year : {
    buckets : FragmentedYear[]
  }
}

type FragmentedTipo = AggBucket & {
  entidad : {
    doc_count_error_upper_bound : number
    sum_other_doc_count         : number
    buckets                     : FragmentedEntidad[]
  }
}

export interface FragmentedFilters {
  tipo : {
    doc_count_error_upper_bound : number
    sum_other_doc_count         : number
    buckets                     : FragmentedTipo[]
  }
}
// -> Filtros fragmentados jerarquicamente 

export interface FragmentedFiltersProps {
    fragments? : FragmentedFilters | null;
    visible    : boolean;
    onFilter   : (selectedFilters: SearchFilters) => void;
    loading    : boolean;
}

export interface FilterNumberProps {
  value?      : number;
  onChange    : (value?: number) => void;
  label       : string;
  placeholder : string;
}

export interface ResultsModalProps {
  open     : boolean;
  onClose  : () => void;
  onRender : () => void;
  children   : React.ReactNode;
  page       : number;
  pages      : number;
  setPage    : (numero: number) => void;
}

export interface LoaderProps {
    visible : boolean;
    bottom? : boolean;
}

export type initialFilters = {
    entidades: {
        buckets: AggBucket[]
    },
    tipos: {
        buckets: AggBucket[]
    }
}
import type { SearchResultsProps } from "../../types/search";

export default function SearchResultsPanel({
  results,
  visible,
}: SearchResultsProps) {
  return (
    <div
        className={`panel-sugerencias-busqueda ${
            visible
                ? "panel-sugerencias-visible"
                : "panel-sugerencias-oculto"
        }`}
    >
        {results.slice(0,5).map((hit, index) => (
            <a
                key={index}
                className="panel-sugerencias-item"
                href={`https://www.medellin.gov.co/normograma/docs/astrea/docs/${hit._source.Numero}.htm`}
            >
                <p className="panel-sugerencias-titulo">
                    {hit._source.title}
                </p>
                <div className="panel-sugerencias-resumen-contenedor">
                    <p className="panel-sugerencias-resumen">
                        {hit._source.Epigrafe}
                    </p>
                </div>
                <p className="panel-sugerencias-meta">
                    {hit._source.Entidad} · {hit._source.Year}
                </p>
            </a>
        ))}
    </div>
  );
}

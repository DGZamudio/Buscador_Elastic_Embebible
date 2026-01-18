import type { SearchResultsProps } from "../../types/search";
import NoResults from "../ui/NoResults";

export default function SearchResultsContent({
  results,
  visible,
}: SearchResultsProps) {
  return (
    <>
        {visible && (
            <div
                className={`panel-resultados ${
                    visible
                        ? "panel-resultados-visible"
                        : "panel-resultados-oculto"
                }`}
            >
                {results.length > 0 ? (
                    <div className="panel-resultados-lista">
                        {results.map((hit, index) => (
                            <a
                                key={index}
                                className="panel-resultados-item"
                                href={`https://www.medellin.gov.co/normograma/docs/astrea/docs/${hit._source.Numero}.htm`}
                            >
                                <p className="panel-resultados-titulo">
                                    {hit._source.title}
                                </p>
                                <p className="panel-resultados-epigrafe">
                                    {hit._source.Epigrafe}
                                </p>
                                <p className="panel-resultados-meta">
                                    {hit._source.Entidad} · {hit._source.Year}
                                </p>
                            </a>
                        ))}
                    </div>
                ) : (
                    <>
                        <NoResults bottom={false} visible/>
                    </>
                )}

            </div>
        )}
    </>
  );
}

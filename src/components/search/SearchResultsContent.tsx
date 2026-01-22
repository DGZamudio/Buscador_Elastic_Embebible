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
                {results.map((hit, index) => {
                    const epigrafeHtml =
                        hit.highlight?.Epigrafe?.[0] ??
                        hit.highlight?.body?.[0] ??
                        hit._source.Epigrafe;

                    return (
                        <a
                            key={index}
                            className="panel-resultados-item"
                            href={`https://www.medellin.gov.co/normograma/docs/astrea/docs/${hit._source.Numero}.htm`}
                            target="_blank"
                        >
                            <p className="panel-resultados-titulo">
                                {hit._source.title}
                            </p>

                            <p
                                className="panel-resultados-epigrafe"
                                dangerouslySetInnerHTML={{
                                    __html: epigrafeHtml
                                }}
                            />

                            <p className="panel-resultados-meta">
                                {hit._source.Entidad} · {hit._source.Year}
                            </p>
                        </a>
                    );
                })}
                {results.length === 0 && <NoResults bottom={false} visible />}
            </div>
        )}
    </>
  );
}

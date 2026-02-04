import { Building, CalendarDays } from "lucide-react";
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
                            href={`https://gestornormativo.creg.gov.co/gestor/entorno/docs/${hit._source["doc-name"]}`}
                            target="_blank"
                        >
                            <span className="contenedor-etiqueta-tipo">
                                <p className="texto-etiqueta-tipo">
                                    {hit._source.Tipo}
                                </p>
                            </span>

                            <p className="panel-resultados-titulo">
                                {hit._source.title}
                            </p>

                            <p
                                className="panel-resultados-epigrafe"
                                dangerouslySetInnerHTML={{
                                    __html: epigrafeHtml
                                }}
                            />

                            <div className="panel-resultados-meta">
                                <div className="contenedor-resultados-meta-entidad">
                                    <Building 
                                        size={"1rem"}
                                    />
                                    <p className="texto-resultado-meta-entidad">
                                        {hit._source.Entidad}
                                    </p>
                                </div>
                                <div className="contenedor-resultados-meta-anio">
                                    <CalendarDays 
                                        size={"1rem"}
                                    />
                                    <p className="texto-resultado-meta-anio">
                                        {hit._source.Year}
                                    </p>
                                </div>
                            </div>
                        </a>
                    );
                })}
                {results.length === 0 && <NoResults bottom={false} visible />}
            </div>
        )}
    </>
  );
}

import styles from "./ui.module.css"
import type { LoaderProps } from "../../types/search";
import { Search } from "lucide-react";

export default function Loader({
    visible,
    variant = "search"
}:LoaderProps) {
  return (
    <>
        {visible && (
            <div className={styles.contenedorModal}>
                {variant === "search" && (
                    <>
                        <p>
                            Buscando
                        </p>
                        <Search size={"1em"}/>
                    </>
                )}
                {variant === "filters" && (
                    <p>
                        Cargando faceta...
                    </p>
                )}
            </div>
        )}
    </>
  )
}
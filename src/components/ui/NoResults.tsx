import styles from "./ui.module.css"
import type { LoaderProps } from "../../types/search";

export default function NoResults({
    visible,
    bottom = true,
    variant = "search"
}:LoaderProps) {
  return (
    <>
        {visible && (
            <div className={styles.contenedorModal} style={!bottom ? { padding: "15px", position:"static", top:undefined } : undefined}>
                <p>
                    {variant == "sugerencia" ? (
                        "Sin sugerencias :/"
                    ) : (
                        "Sin resultados :("
                    )}
                    
                </p>
            </div>
        )}
    </>
  )
}
import styles from "./ui.module.css"
import type { LoaderProps } from "../../types/search";
import { Search } from "lucide-react";

export default function Loader({
    visible
}:LoaderProps) {
  return (
    <>
        {visible && (
            <div className={styles.contenedorModal}>
                <p>
                    Buscando
                </p>
                <Search size={"1em"}/>
            </div>
        )}
    </>
  )
}
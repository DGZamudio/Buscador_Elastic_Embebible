import styles from "./ui.module.css"
import type { LoaderProps } from "../../types/search";
import { Pencil } from "lucide-react";

export default function Typing({
    visible
}:LoaderProps) {
  return (
    <>
        {visible && (
            <div className={styles.contenedorModal}>
                <p>
                    Escribiendo... 
                </p>
                <Pencil size={"1em"}/>
            </div>
        )}
    </>
  )
}
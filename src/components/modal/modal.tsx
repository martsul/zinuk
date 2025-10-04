import type { FC } from "react"
import { createPortal } from "react-dom"
import styles from "./modal.module.css"

interface Props {
  children: React.ReactNode
}

export const Modal: FC<Props> = ({ children }) => {
  return createPortal(
    <div className={styles.modal}>
      <div className={styles.modalWrapper}>
        {children}
      </div>
    </div>,
    document.body
  )
}
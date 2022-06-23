import React, { ReactNode, useEffect } from "react";
import styles from "styles/Modal.module.css";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

type Props = {
  children: ReactNode;
  title: string;
  handleClose: Function;
  isOpen: boolean;
};

const Modal = ({ children, title, isOpen = true, handleClose }: Props) => {
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("hidden");
    } else {
      document.body.classList.remove("hidden");
    }
  }, [isOpen]);

  return isOpen ? (
    <div
      className={styles["md-container"]}
      onClick={(e: React.MouseEvent<HTMLElement>) =>
        (e.target as Element)?.classList?.[0]?.includes("md-container")
          ? handleClose()
          : null
      }
    >
      <div className={styles["md-content"]}>
        <div className={styles["md-header"]}>
          <h2>{title}</h2>
          <span className={styles.close} onClick={() => handleClose()}>
            <CloseRoundedIcon />
          </span>
        </div>
        {children}
      </div>
    </div>
  ) : null;
};

export default Modal;

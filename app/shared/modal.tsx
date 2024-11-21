import { PropsWithChildren, SyntheticEvent, useEffect, useRef } from "react";

export interface ModalProps {
  /**
   * Boolean describing if the modal should be shown or not.
   */
  isOpen: boolean;

  title?: string;

  onClose?: (e?: SyntheticEvent<HTMLDialogElement>) => void;
}

let body: HTMLElement;
let html: HTMLHtmlElement | null;

export const Modal = ({
  children,
  isOpen = false,
  title,
  onClose,
  ...props
}: PropsWithChildren<ModalProps>) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    body = document?.body;
    html = document.querySelector("html"); //IOS Fix

    if (isOpen) {
      handleOpen();
    } else {
      if (html) {
        html.style.overscrollBehavior = "auto"; //IOS Fix
        body.style.touchAction = "auto";
        body.style.overflow = "unset";
      }
    }
    return () => {
      if (html) {
        html.style.overscrollBehavior = "auto"; //IOS Fix
        body.style.touchAction = "auto";
      }
      body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleOpen = () => {
    if (dialogRef.current) {
      dialogRef.current?.showModal();
    }

    if (html) {
      html.style.overscrollBehavior = "none";
    }

    body.style.overflow = "hidden";
    body.style.touchAction = "none";
  };

  const handleClose = () => {
    dialogRef.current?.close();

    if (onClose) {
      onClose();
    }
  };

  return (
    isOpen && (
      <dialog {...props} ref={dialogRef}>
        <div className="d-flex align-items-center justify-content-between mb-4">
          <span>{title}</span>
          <button onClick={handleClose} className="dialog-close">
            X
          </button>
        </div>
        <div>{children}</div>
      </dialog>
    )
  );
};

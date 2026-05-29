"use client";

import { X } from "lucide-react";
import { useEffect, useRef, type ReactNode } from "react";

/**
 * Modal genérico para fichas técnicas de los complementos (Water tank,
 * Alpicool, EcoFlow). Usa el elemento nativo <dialog> que ya provee:
 *
 * - Focus trap dentro del modal
 * - Cierre con tecla ESC
 * - ::backdrop estilizable
 * - aria-modal y bloqueo del scroll en background
 *
 * Además: clic en el backdrop también cierra, y bloquea el scroll de body
 * mientras está abierto.
 */
export function FichaTecnicaModal({
  open,
  onClose,
  ariaLabel,
  children,
}: {
  open: boolean;
  onClose: () => void;
  ariaLabel: string;
  children: ReactNode;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      document.body.style.overflow = "hidden";
    } else if (!open && dialog.open) {
      dialog.close();
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const handleClose = () => onClose();
    dialog.addEventListener("close", handleClose);
    return () => dialog.removeEventListener("close", handleClose);
  }, [onClose]);

  return (
    <dialog
      ref={dialogRef}
      aria-label={ariaLabel}
      onClick={(e) => {
        if (e.target === dialogRef.current) onClose();
      }}
      className="m-0 h-full max-h-full w-full max-w-full bg-transparent p-0 backdrop:bg-green-deep/70 open:flex open:items-stretch open:justify-center sm:p-6"
    >
      <div
        className="relative flex h-full w-full max-w-6xl flex-col bg-cream-pure sm:my-auto sm:h-auto sm:max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar ficha técnica"
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-sm bg-green-deep text-cream transition-colors hover:bg-green-medium"
        >
          <X width={16} height={16} strokeWidth={1.5} aria-hidden />
        </button>
        <div className="overflow-y-auto">{children}</div>
      </div>
    </dialog>
  );
}

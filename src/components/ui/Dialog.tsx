import * as React from "react"
import { X } from "lucide-react"

export interface DialogProps extends React.DialogHTMLAttributes<HTMLDialogElement> {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

export function Dialog({ open, onOpenChange, children, ...props }: DialogProps) {
  const dialogRef = React.useRef<HTMLDialogElement>(null);

  React.useEffect(() => {
    const dialogNode = dialogRef.current;
    if (open && dialogNode) {
      dialogNode.showModal();
    } else if (dialogNode) {
      dialogNode.close();
    }
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      onClose={() => onOpenChange?.(false)}
      className="backdrop:bg-black/50 p-0 rounded-2xl shadow-xl border border-border bg-background w-[90vw] max-w-md my-auto mx-auto backdrop-blur-sm"
      {...props}
    >
      <div className="p-6">
        {children}
      </div>
    </dialog>
  )
}

export function DialogContent({ children, className = "", hideCloseButton = false, ...props }: React.HTMLAttributes<HTMLDivElement> & { hideCloseButton?: boolean }) {
  return (
    <div className={`relative ${className}`} {...props}>
      {!hideCloseButton && (
        <button
          className="absolute right-0 top-0 rounded-full p-2 hover:bg-muted transition-colors"
          onClick={(e) => {
            const dialog = e.currentTarget.closest('dialog');
            dialog?.close();
          }}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
      )}
      {children}
    </div>
  )
}

export function DialogHeader({ children, className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`flex flex-col space-y-1.5 text-center sm:text-left mb-4 ${className}`} {...props}>
      {children}
    </div>
  )
}

export function DialogTitle({ children, className = "", ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={`text-lg font-semibold leading-none tracking-tight ${className}`} {...props}>
      {children}
    </h3>
  )
}

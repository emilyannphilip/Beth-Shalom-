"use client";

import {
  createContext,
  useContext,
  useState,
  type ComponentProps,
} from "react";

const PreviewContext = createContext(false);
export const previewNotice = "Preview only. Details are not sent or saved.";

export function PreviewForm({
  children,
  resetAfterValidation,
  hideAfterValidation,
  ...props
}: Omit<ComponentProps<"form">, "onSubmit" | "onReset"> & {
  resetAfterValidation?: boolean;
  hideAfterValidation?: boolean;
}) {
  const [validated, setValidated] = useState(false);

  return (
    <PreviewContext.Provider value={validated}>
      <form
        {...props}
        method="dialog"
        onReset={() => setValidated(false)}
        onSubmit={(event) => {
          event.preventDefault();
          const form = event.currentTarget;
          if (!form.reportValidity()) return;

          if (resetAfterValidation) form.reset();
          setValidated(true);
          requestAnimationFrame(() => {
            const message = form.querySelector<HTMLElement>(
              "[data-preview-feedback]",
            );
            message?.focus({ preventScroll: true });
            message?.scrollIntoView({ block: "nearest", behavior: "auto" });
          });
        }}
      >
        {hideAfterValidation && validated ? (
          <PreviewFeedback
            id="enquiry-confirmation"
            className="sm:col-span-2 rounded-xl border border-secondary/20 bg-secondary-container/70 p-4 font-body-sm text-on-secondary-container shadow-sm"
          >
            Preview complete. No message was sent or saved. For immediate
            assistance, please call +91 8289838745.
          </PreviewFeedback>
        ) : (
          <>
            <p className="sm:col-span-2 text-body-sm text-on-surface-variant">
              {previewNotice}
            </p>
            {children}
          </>
        )}
      </form>
    </PreviewContext.Provider>
  );
}

export function PreviewFeedback({ children, ...props }: ComponentProps<"div">) {
  const validated = useContext(PreviewContext);
  if (!validated) return null;

  return (
    <div {...props} tabIndex={-1} role="status" data-preview-feedback>
      {children ?? "Preview complete. Your details were not sent or saved."}
    </div>
  );
}

export function PreviewAction({
  message,
  children,
  ...props
}: Omit<ComponentProps<"button">, "onClick"> & { message: string }) {
  return (
    <button {...props} type="button" onClick={() => window.alert(message)}>
      {children}
    </button>
  );
}

export function PreviewLink({
  message,
  children,
  ...props
}: Omit<ComponentProps<"a">, "onClick"> & { message: string }) {
  return (
    <a
      {...props}
      onClick={(event) => {
        event.preventDefault();
        window.alert(message);
      }}
    >
      {children}
    </a>
  );
}

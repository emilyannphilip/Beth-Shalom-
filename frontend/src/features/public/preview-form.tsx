"use client";

import {
  createContext,
  useContext,
  useRef,
  useState,
  type ComponentProps,
} from "react";
import { errorMessage } from "@/lib/api";
import { submitEnquiry, type Receipt, type Source } from "./enquiry-api";

const ResultContext = createContext<Receipt | null>(null);

export function PreviewForm({
  children,
  resetAfterValidation,
  hideAfterValidation,
  source,
  ...props
}: Omit<ComponentProps<"form">, "onSubmit" | "onReset"> & {
  resetAfterValidation?: boolean;
  hideAfterValidation?: boolean;
  source: Source;
}) {
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const busy = useRef(false);
  return (
    <ResultContext.Provider value={receipt}>
      <form
        {...props}
        method="dialog"
        aria-busy={pending}
        onReset={() => {
          setReceipt(null);
          setError("");
        }}
        onSubmit={async (event) => {
          event.preventDefault();
          const form = event.currentTarget;
          if (busy.current || !form.reportValidity()) return;
          busy.current = true;
          setPending(true);
          setError("");
          setReceipt(null);
          try {
            const result = await submitEnquiry(form, source);
            if (resetAfterValidation) form.reset();
            setReceipt(result);
          } catch (failure) {
            setError(errorMessage(failure));
          } finally {
            busy.current = false;
            setPending(false);
            requestAnimationFrame(() =>
              form
                .querySelector<HTMLElement>("[data-enquiry-feedback]")
                ?.focus(),
            );
          }
        }}
      >
        {pending && (
          <p role="status" className="sm:col-span-2">
            Sending your enquiry…
          </p>
        )}
        {error && (
          <p
            role="alert"
            tabIndex={-1}
            data-enquiry-feedback
            className="sm:col-span-2 text-error"
          >
            {error}
          </p>
        )}
        {hideAfterValidation && receipt ? (
          <PreviewFeedback
            id="enquiry-confirmation"
            className="sm:col-span-2 rounded-xl border border-secondary/20 bg-secondary-container/70 p-4 text-on-secondary-container"
          />
        ) : (
          children
        )}
      </form>
    </ResultContext.Provider>
  );
}

export function PreviewFeedback(props: ComponentProps<"div">) {
  const receipt = useContext(ResultContext);
  if (!receipt) return null;
  return (
    <div {...props} tabIndex={-1} role="status" data-enquiry-feedback>
      Enquiry received. Reference {receipt.enquiry_number}.
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

"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ComponentProps,
} from "react";
import { Modal } from "./modal";

const DismissWelcome = createContext<() => void>(() => {});
const sessionKey = "beth-shalom-enquiry-shown";

export function WelcomeModal({ children, ...props }: ComponentProps<"div">) {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      try {
        if (sessionStorage.getItem(sessionKey)) return;
        sessionStorage.setItem(sessionKey, "1");
      } catch {
        // The welcome still works when this browser blocks session storage.
      }
      setOpen(true);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(
    () => () => {
      if (closeTimer.current !== null) clearTimeout(closeTimer.current);
    },
    [],
  );

  function dismiss() {
    if (closeTimer.current !== null) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setOpen(false);
      return;
    }

    setClosing(true);
    closeTimer.current = setTimeout(() => {
      setOpen(false);
      closeTimer.current = null;
    }, 250);
  }

  return (
    <DismissWelcome.Provider value={dismiss}>
      <Modal
        open={open}
        active={open && !closing}
        onDismiss={dismiss}
        titleId="enquiry-title"
        descriptionId="enquiry-intro"
        backdropId="enquiry-welcome-modal"
        focusSelector='input[name="name"]'
      >
        <div {...props}>{children}</div>
      </Modal>
    </DismissWelcome.Provider>
  );
}

export function CloseWelcomeButton(props: ComponentProps<"button">) {
  const dismiss = useContext(DismissWelcome);
  return <button {...props} type="button" onClick={dismiss} />;
}

"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ComponentProps,
  type ReactNode,
} from "react";
import { SiteImage } from "./site-image";

const suites = {
  nest: {
    title: "Nest Suite",
    description:
      "Cozy and thoughtfully designed for peaceful, independent living.",
  },
  heaven: {
    title: "Heaven Residence",
    description:
      "A bright, airy retreat balancing modern comforts with serene surroundings.",
  },
  aura: {
    title: "Aura Sanctuary",
    description: "Dedicated room separations create a truly homely atmosphere.",
  },
  vista: {
    title: "Vista Living",
    description:
      "A complete and highly functional layout with beautiful open views.",
  },
  harmony: {
    title: "Harmony Living Suite",
    description:
      "Expansive suite living with generous proportions and dual outdoor access.",
  },
  grande: {
    title: "Grande Crown Suite",
    description:
      "Our crown jewel — the most spacious and refined offering in the home.",
  },
} as const;

type Suite = keyof typeof suites;
type Mode = "mode-3d" | "mode-blueprint" | "mode-clearance";
type Tool = "zoom-in" | "zoom-out" | "rotate" | "contrast-mode" | "reset";
type Hotspot = "1" | "2" | "3" | "4" | "5";

type Control =
  | { kind: "suite"; control: Suite }
  | { kind: "mode"; control: Mode }
  | { kind: "tool"; control: Tool }
  | { kind: "pin" | "hotspot"; control: Hotspot };

interface VisualizerState {
  suite: Suite;
  mode: Mode | null;
  transform: { zoom: number; rotation: number } | null;
  contrast: boolean;
  hotspot: Hotspot | null;
  activate: (selection: Control) => void;
}

const VisualizerContext = createContext<VisualizerState>({
  suite: "harmony",
  mode: null,
  transform: null,
  contrast: false,
  hotspot: null,
  activate: () => {},
});

export function VisualizerProvider({ children }: { children: ReactNode }) {
  const [suite, setSuite] = useState<Suite>("harmony");
  const [mode, setMode] = useState<Mode | null>(null);
  const [transform, setTransform] =
    useState<VisualizerState["transform"]>(null);
  const [contrast, setContrast] = useState(false);
  const [hotspot, setHotspot] = useState<Hotspot | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current !== null) clearTimeout(timer.current);
    },
    [],
  );

  function activate(selection: Control) {
    if (selection.kind === "suite") {
      setSuite(selection.control);
      return;
    }

    if (selection.kind === "mode") {
      setMode(selection.control);
      return;
    }

    if (selection.kind === "pin" || selection.kind === "hotspot") {
      if (timer.current !== null) clearTimeout(timer.current);
      setHotspot(selection.control);
      timer.current = setTimeout(() => setHotspot(null), 1800);
      return;
    }

    if (selection.control === "contrast-mode") {
      setContrast((active) => !active);
      return;
    }

    const tool = selection.control;
    setTransform((current) => {
      const { zoom, rotation } = current ?? { zoom: 1, rotation: 0 };
      switch (tool) {
        case "zoom-in":
          return { zoom: Math.min(1.6, zoom + 0.15), rotation };
        case "zoom-out":
          return { zoom: Math.max(0.8, zoom - 0.15), rotation };
        case "rotate":
          return { zoom, rotation: (rotation + 90) % 360 };
        default:
          return { zoom: 1, rotation: 0 };
      }
    });
  }

  return (
    <VisualizerContext.Provider
      value={{ suite, mode, transform, contrast, hotspot, activate }}
    >
      {children}
    </VisualizerContext.Provider>
  );
}

const modeColors = new Set([
  "bg-surface-container-lowest",
  "text-primary",
  "text-on-surface-variant",
  "hover:text-primary",
  "shadow-xs",
  "shadow-sm",
]);
const suiteColors = new Set([
  "active",
  "bg-primary-container",
  "text-on-primary",
  "shadow-sm",
  "bg-surface-container",
  "hover:bg-surface-container-high",
  "text-on-surface",
]);

function swapClasses(className: string, remove: Set<string>, add: string) {
  return className
    .split(/\s+/)
    .filter((token) => !remove.has(token))
    .concat(add)
    .join(" ");
}

export function VisualizerButton({
  kind,
  control,
  className = "",
  ...props
}: ComponentProps<"button"> & Control) {
  const state = useContext(VisualizerContext);
  let classes = className;
  let pressed: boolean | undefined;

  if (kind === "suite") {
    pressed = state.suite === control;
    classes = swapClasses(
      className,
      suiteColors,
      pressed
        ? "active bg-primary-container text-on-primary shadow-sm"
        : "bg-surface-container hover:bg-surface-container-high text-on-surface",
    );
  } else if (kind === "mode") {
    pressed = (state.mode ?? "mode-3d") === control;
    classes = swapClasses(
      className,
      modeColors,
      pressed
        ? "bg-surface-container-lowest text-primary shadow-xs"
        : "text-on-surface-variant hover:text-primary",
    );
  } else if (kind === "pin" || kind === "hotspot") {
    pressed = state.hotspot === control;
    if (kind === "pin" && pressed) classes += " ring-4 ring-tertiary-fixed";
  } else if (control === "contrast-mode") {
    pressed = state.contrast;
    if (pressed) classes += " bg-primary text-on-primary";
  }

  return (
    <button
      {...props}
      type="button"
      aria-label={props["aria-label"] ?? props.title}
      aria-pressed={pressed}
      className={classes}
      onClick={() => state.activate({ kind, control } as Control)}
    />
  );
}

export function VisualizerPlan({ style, ...props }: ComponentProps<"div">) {
  const { transform } = useContext(VisualizerContext);
  return (
    <div
      {...props}
      style={
        transform
          ? {
              ...style,
              transform: `scale(${transform.zoom}) rotate(${transform.rotation}deg)`,
            }
          : style
      }
    />
  );
}

const opacityForMode: Record<Mode, number> = {
  "mode-3d": 0.3,
  "mode-blueprint": 0.1,
  "mode-clearance": 1,
};

export function VisualizerClearance({
  style,
  ...props
}: ComponentProps<"svg">) {
  const { mode } = useContext(VisualizerContext);
  return (
    <svg
      {...props}
      style={mode ? { ...style, opacity: opacityForMode[mode] } : style}
    />
  );
}

export function VisualizerImage({
  className = "",
  ...props
}: ComponentProps<typeof SiteImage>) {
  const { contrast } = useContext(VisualizerContext);
  return (
    <SiteImage
      {...props}
      className={
        contrast ? `${className} contrast-150 brightness-90` : className
      }
    />
  );
}

export function SuiteText({ field }: { field: "title" | "description" }) {
  const { suite } = useContext(VisualizerContext);
  return suites[suite][field];
}

"use client";
import { useEffect, useRef, useState } from "react";
import { Accessibility, Contrast, Minus, MousePointer2, Plus, Sparkles } from "lucide-react";
type Preferences = {
  contrast: boolean;
  scale: number;
  reducedMotion: boolean;
  largeTargets: boolean;
  simplifiedAnimation: boolean;
};
const defaults: Preferences = {
  contrast: false,
  scale: 100,
  reducedMotion: false,
  largeTargets: false,
  simplifiedAnimation: false,
};
export function AccessibilityControls() {
  const [open, setOpen] = useState(false);
  const [preferences, setPreferences] = useState(defaults);
  const dialogRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    try {
      const saved = localStorage.getItem("impact-horizon-accessibility");
      if (saved) setPreferences(JSON.parse(saved));
    } catch {
      /* use defaults */
    }
  }, []);
  useEffect(() => {
    document.documentElement.classList.toggle("high-contrast", preferences.contrast);
    document.documentElement.classList.toggle("reduce-motion", preferences.reducedMotion);
    document.documentElement.classList.toggle("large-targets", preferences.largeTargets);
    document.documentElement.classList.toggle(
      "simplified-animation",
      preferences.simplifiedAnimation,
    );
    document.documentElement.style.fontSize = `${preferences.scale}%`;
    localStorage.setItem("impact-horizon-accessibility", JSON.stringify(preferences));
  }, [preferences]);
  useEffect(() => {
    if (!open) return;
    dialogRef.current?.querySelector<HTMLElement>("button, input")?.focus();
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
      if (event.key === "Tab" && dialogRef.current) {
        const focusable = [...dialogRef.current.querySelectorAll<HTMLElement>("button, input")];
        const first = focusable[0];
        const last = focusable.at(-1);
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [open]);
  return (
    <div className="fixed bottom-4 left-4 z-50 print:hidden">
      <button
        ref={triggerRef}
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-controls="accessibility-menu"
        className="focus-ring grid size-11 place-items-center rounded-full border bg-panel shadow-xl"
        aria-label="Accessibility preferences"
      >
        <Accessibility className="size-5 text-cyan" />
      </button>
      {open && (
        <div
          ref={dialogRef}
          id="accessibility-menu"
          role="dialog"
          aria-label="Accessibility preferences"
          className="absolute bottom-14 left-0 w-72 rounded-2xl border bg-panel p-5 shadow-2xl shadow-black/30"
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-cyan">Accessibility</p>
          <label className="mt-4 flex items-center justify-between text-sm">
            <span className="flex items-center gap-2">
              <Contrast className="size-4" /> High contrast
            </span>
            <input
              type="checkbox"
              checked={preferences.contrast}
              onChange={(event) =>
                setPreferences({ ...preferences, contrast: event.target.checked })
              }
              className="accent-cyan"
            />
          </label>
          <div className="mt-5">
            <p className="text-sm">Text size</p>
            <div className="mt-2 flex items-center gap-2">
              <button
                onClick={() =>
                  setPreferences({ ...preferences, scale: Math.max(90, preferences.scale - 10) })
                }
                aria-label="Decrease text size"
                className="focus-ring rounded border p-2"
              >
                <Minus className="size-4" />
              </button>
              <span className="flex-1 text-center text-sm">{preferences.scale}%</span>
              <button
                onClick={() =>
                  setPreferences({ ...preferences, scale: Math.min(130, preferences.scale + 10) })
                }
                aria-label="Increase text size"
                className="focus-ring rounded border p-2"
              >
                <Plus className="size-4" />
              </button>
            </div>
          </div>
          <Toggle
            icon={<Sparkles className="size-4" />}
            label="Reduce motion"
            checked={preferences.reducedMotion}
            onChange={(checked) => setPreferences({ ...preferences, reducedMotion: checked })}
          />
          <Toggle
            icon={<MousePointer2 className="size-4" />}
            label="Larger click targets"
            checked={preferences.largeTargets}
            onChange={(checked) => setPreferences({ ...preferences, largeTargets: checked })}
          />
          <Toggle
            icon={<Sparkles className="size-4" />}
            label="Simplified animation"
            checked={preferences.simplifiedAnimation}
            onChange={(checked) => setPreferences({ ...preferences, simplifiedAnimation: checked })}
          />
          <button
            onClick={() => setPreferences(defaults)}
            className="mt-4 text-xs text-zinc-500 hover:text-white"
          >
            Reset preferences
          </button>
        </div>
      )}
    </div>
  );
}

function Toggle({
  icon,
  label,
  checked,
  onChange,
}: {
  icon: React.ReactNode;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="mt-4 flex min-h-11 items-center justify-between gap-3 text-sm">
      <span className="flex items-center gap-2">
        {icon} {label}
      </span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="size-5 accent-cyan"
      />
    </label>
  );
}

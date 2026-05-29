/**
 * ui.tsx — small, reusable, accessible controls used across the panel.
 * Every control has a tappable ⓘ (spec §7) and ≥44px tap targets.
 */
import { Info } from "lucide-react";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// InfoTag — a tappable ⓘ that reveals "what it means + what it assumes".
// ─────────────────────────────────────────────────────────────────────────────
export function InfoTag({ children, label }: { children: ReactNode; label: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const id = useId();

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <span className="relative inline-flex" ref={ref}>
      <button
        type="button"
        aria-label={`About: ${label}`}
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((o) => !o)}
        className="focusable relative inline-grid h-6 w-6 place-items-center rounded-full text-paper-muted hover:text-paper-accent dark:text-night-muted dark:hover:text-night-accent"
      >
        {/* Transparent overlay expands the touch target to ~44px without changing
            the visual size or shifting layout (spec §7 ≥44px tap targets). */}
        <span className="absolute -inset-[10px]" aria-hidden="true" />
        <Info size={15} strokeWidth={2} />
      </button>
      {open && (
        <span
          id={id}
          role="tooltip"
          className="absolute left-0 top-7 z-30 w-64 max-w-[calc(100vw-2rem)] rounded-lg border border-paper-border bg-paper-panel p-3 text-[13px] leading-snug text-paper-muted shadow-lg dark:border-night-border dark:bg-night-panel dark:text-night-muted"
        >
          {children}
        </span>
      )}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FieldLabel — label + optional inline ⓘ
// ─────────────────────────────────────────────────────────────────────────────
export function FieldLabel({
  label,
  info,
  infoTitle,
  htmlFor,
  trailing,
}: {
  label: string;
  info?: ReactNode;
  infoTitle?: string;
  htmlFor?: string;
  trailing?: ReactNode;
}) {
  return (
    <div className="mb-2 flex items-center justify-between gap-2">
      <span className="flex items-center gap-1">
        <label
          htmlFor={htmlFor}
          className="text-[13px] font-medium uppercase tracking-wide text-paper-muted dark:text-night-muted"
        >
          {label}
        </label>
        {info && <InfoTag label={infoTitle ?? label}>{info}</InfoTag>}
      </span>
      {trailing}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Segmented — a row of mutually-exclusive options
// ─────────────────────────────────────────────────────────────────────────────
export interface Option<T extends string | number> {
  value: T;
  label: string;
}

export function Segmented<T extends string | number>({
  label,
  options,
  value,
  onChange,
  info,
  infoTitle,
}: {
  label: string;
  options: Option<T>[];
  value: T;
  onChange: (v: T) => void;
  info?: ReactNode;
  infoTitle?: string;
}) {
  return (
    <div>
      <FieldLabel label={label} info={info} infoTitle={infoTitle} />
      <div
        role="group"
        aria-label={label}
        className="flex flex-wrap gap-1.5"
      >
        {options.map((o) => {
          const active = o.value === value;
          return (
            <button
              key={String(o.value)}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(o.value)}
              className={[
                "focusable min-h-[44px] flex-1 whitespace-nowrap rounded-lg border px-3 text-sm transition-colors",
                active
                  ? "border-paper-accent bg-paper-accent text-white dark:border-night-accent dark:bg-night-accent dark:text-night-bg"
                  : "border-paper-border bg-paper-panel text-paper-ink hover:border-paper-accent dark:border-night-border dark:bg-night-panel dark:text-night-ink dark:hover:border-night-accent",
              ].join(" ")}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// LabeledSlider — range with a live, formatted readout
// ─────────────────────────────────────────────────────────────────────────────
export function LabeledSlider({
  label,
  min,
  max,
  step,
  value,
  onChange,
  format,
  info,
  infoTitle,
}: {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (v: number) => void;
  format: (v: number) => ReactNode;
  info?: ReactNode;
  infoTitle?: string;
}) {
  const id = useId();
  return (
    <div>
      <FieldLabel
        label={label}
        info={info}
        infoTitle={infoTitle}
        htmlFor={id}
        trailing={
          <span className="nums font-display text-base font-semibold text-paper-ink dark:text-night-ink">
            {format(value)}
          </span>
        }
      />
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        // 44px tall hit area (spec §7); padding + bg-clip-content keeps the
        // visible track thin while the clickable/grabbable region fills 44px.
        className="focusable h-11 w-full cursor-pointer appearance-none rounded-full bg-paper-border bg-clip-content py-[18px] accent-paper-accent dark:bg-night-border dark:accent-night-accent"
      />
    </div>
  );
}

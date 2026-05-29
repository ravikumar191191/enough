/**
 * Header.tsx — title, Day/Night toggle, Share (copies the stateful URL), Reset.
 */
import { Check, Moon, RotateCcw, Share2, Sun } from "lucide-react";
import { useState } from "react";
import type { Theme } from "../hooks/useTheme";

function IconButton({
  onClick,
  label,
  children,
}: {
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className="focusable inline-grid h-11 w-11 place-items-center rounded-lg border border-paper-border bg-paper-panel text-paper-ink hover:border-paper-accent dark:border-night-border dark:bg-night-panel dark:text-night-ink dark:hover:border-night-accent"
    >
      {children}
    </button>
  );
}

export function Header({
  theme,
  onToggleTheme,
  onReset,
}: {
  theme: Theme;
  onToggleTheme: () => void;
  onReset: () => void;
}) {
  const [copied, setCopied] = useState(false);

  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: "Enough — my number", url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // user cancelled share sheet, or clipboard blocked — no-op
    }
  };

  return (
    <header className="flex items-start justify-between gap-3 px-4 pt-5 sm:px-6">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
          Enough <span className="text-paper-accent dark:text-night-accent">≈</span>
        </h1>
        <p className="mt-0.5 max-w-md text-[13px] text-paper-muted dark:text-night-muted">
          Your cross-border "enough" number — India and the US, ranked in one list.
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          onClick={share}
          className="focusable inline-flex h-11 items-center gap-1.5 rounded-lg bg-paper-accent px-3.5 text-sm font-medium text-white hover:opacity-90 dark:bg-night-accent dark:text-night-bg"
        >
          {copied ? <Check size={16} /> : <Share2 size={16} />}
          <span className="hidden sm:inline">{copied ? "Copied" : "Share"}</span>
        </button>
        <IconButton onClick={onReset} label="Reset to defaults">
          <RotateCcw size={18} />
        </IconButton>
        <IconButton
          onClick={onToggleTheme}
          label={theme === "dark" ? "Switch to light" : "Switch to dark"}
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </IconButton>
      </div>
    </header>
  );
}

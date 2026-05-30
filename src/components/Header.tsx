/**
 * Header.tsx — title, Day/Night toggle, Share (copies the stateful URL), Reset.
 */
import { track } from "@vercel/analytics";
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
  scenario,
}: {
  theme: Theme;
  onToggleTheme: () => void;
  onReset: () => void;
  scenario: { city: string; amount: string; line: string };
}) {
  const [copied, setCopied] = useState(false);

  const share = async () => {
    // Build a /share link carrying display strings (for the preview card) + the
    // current inputs (`to`), so the recipient sees a rich card and lands on the
    // exact scenario.
    const params = new URLSearchParams({
      city: scenario.city,
      amount: scenario.amount,
      line: scenario.line,
      to: window.location.search,
    });
    const url = `${window.location.origin}/share?${params.toString()}`;
    try {
      track("share");
    } catch {
      // analytics not available (e.g. local dev) — ignore
    }
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
      <div className="min-w-0">
        <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
          <span className="text-paper-accent dark:text-night-accent">FIRE</span>nough
        </h1>
        <p className="mt-1 max-w-lg font-body text-[15px] leading-snug sm:text-base">
          How much do you need so money's <strong>never the reason you work</strong> — in
          every city you'd actually live in?
        </p>
        <p className="mt-1 max-w-lg text-[12.5px] text-paper-muted dark:text-night-muted">
          Find your <strong>freedom number</strong>: we rank India &amp; US cities by what
          it'd take — and show how close you are today.
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

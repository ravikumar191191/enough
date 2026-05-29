import { useCallback, useEffect, useState } from "react";

export type Theme = "light" | "dark";

/**
 * Day/Night theme that auto-detects OS appearance (spec §7). No browser storage
 * (spec §8): the toggle is session-only and follows the OS until the user flips
 * it. Applies/removes `.dark` on <html> for Tailwind's class dark mode.
 */
export function useTheme(): [Theme, () => void] {
  const getOS = (): Theme =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";

  const [theme, setTheme] = useState<Theme>(getOS);
  const [userPinned, setUserPinned] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  // Follow the OS until the user explicitly toggles.
  useEffect(() => {
    if (userPinned) return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => setTheme(mq.matches ? "dark" : "light");
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [userPinned]);

  const toggle = useCallback(() => {
    setUserPinned(true);
    setTheme((t) => (t === "dark" ? "light" : "dark"));
  }, []);

  return [theme, toggle];
}

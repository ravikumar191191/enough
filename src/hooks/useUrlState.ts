import { useCallback, useEffect, useState } from "react";
import { DEFAULT_INPUTS, type Inputs } from "../lib/model";
import { decodeInputs, encodeInputs } from "../lib/urlState";

/**
 * Single source of UI state, mirrored to the URL query string (spec §8).
 * - Initial state is read from the URL, so shared links reproduce inputs.
 * - Changes are written with replaceState (no history spam on every slider tick).
 * - Back/forward (popstate) re-reads the URL.
 */
export function useUrlState(): [Inputs, (patch: Partial<Inputs>) => void, () => void] {
  const [inputs, setInputs] = useState<Inputs>(() =>
    decodeInputs(typeof window === "undefined" ? "" : window.location.search)
  );

  useEffect(() => {
    const qs = encodeInputs(inputs);
    const url = `${window.location.pathname}${qs}${window.location.hash}`;
    window.history.replaceState(null, "", url);
  }, [inputs]);

  useEffect(() => {
    const onPop = () => setInputs(decodeInputs(window.location.search));
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const patch = useCallback(
    (p: Partial<Inputs>) => setInputs((prev) => ({ ...prev, ...p })),
    []
  );
  const reset = useCallback(() => setInputs(DEFAULT_INPUTS), []);

  return [inputs, patch, reset];
}

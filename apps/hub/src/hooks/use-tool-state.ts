"use client";

import { useCallback, useRef, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

type StringRecord = Record<string, string>;

/**
 * Syncs tool state to URL search params so users can bookmark/share specific tool states.
 *
 * Usage:
 *   const [state, setState] = useToolState({ text: "", case: "upper" });
 *   setState({ text: "hello" }); // merges with existing, updates URL
 */
export function useToolState<T extends StringRecord>(defaults: T): [T, (patch: Partial<T>) => void] {
  const searchParams = useSearchParams();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Build initial state from URL params, falling back to defaults
  const [state, setStateRaw] = useState<T>(() => {
    const initial = { ...defaults };
    for (const key of Object.keys(defaults)) {
      const param = searchParams?.get(key) ?? null;
      if (param !== null) {
        (initial as StringRecord)[key] = decodeURIComponent(param);
      }
    }
    return initial;
  });

  // Debounced URL sync
  const syncToUrl = useCallback((nextState: T) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      const params = new URLSearchParams();
      for (const [key, value] of Object.entries(nextState)) {
        if (value !== "") {
          params.set(key, encodeURIComponent(value));
        }
      }
      const qs = params.toString();
      const url = window.location.pathname + (qs ? `?${qs}` : "");
      window.history.replaceState(null, "", url);
    }, 300);
  }, []);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const setState = useCallback(
    (patch: Partial<T>) => {
      setStateRaw((prev) => {
        const next = { ...prev, ...patch } as T;
        syncToUrl(next);
        return next;
      });
    },
    [syncToUrl],
  );

  return [state, setState];
}

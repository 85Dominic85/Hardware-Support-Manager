"use client";

import { useState, useEffect, useRef } from "react";
import { useQueryState, parseAsString } from "nuqs";

/**
 * Hook that manages a search input with debounce, persisted in URL via nuqs.
 *
 * - `inputValue` / `setInputValue`: raw input value for the text field (instant)
 * - `debouncedValue`: debounced value used for queries (after `delay` ms)
 *
 * The debounced value is synced to the URL as `?search=...` so it survives
 * full-page navigations triggered by other nuqs params (e.g. pagination with
 * shallow: false). On mount, the input is initialized from the URL param.
 */
export function useDebouncedSearch(delay = 300) {
  const [urlSearch, setUrlSearch] = useQueryState(
    "search",
    parseAsString.withDefault("").withOptions({ shallow: true })
  );

  // Local input state — initialized from URL so it survives navigations
  const [inputValue, setInputValue] = useState(urlSearch);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounce: inputValue → urlSearch (which is the debouncedValue)
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setUrlSearch(inputValue || null); // null removes param from URL
    }, delay);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [inputValue, delay, setUrlSearch]);

  return {
    inputValue,
    setInputValue,
    debouncedValue: urlSearch,
  };
}

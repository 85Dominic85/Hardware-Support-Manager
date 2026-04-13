"use client";

import { useState, useEffect, useRef } from "react";

/**
 * Pure debounce hook for search input. No URL state — just timing.
 * Returns raw inputValue (for the input field) and debouncedValue (for queries).
 */
export function useDebouncedSearch(delay = 300) {
  const [inputValue, setInputValue] = useState("");
  const [debouncedValue, setDebouncedValue] = useState("");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setDebouncedValue(inputValue);
    }, delay);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [inputValue, delay]);

  return { inputValue, setInputValue, debouncedValue };
}

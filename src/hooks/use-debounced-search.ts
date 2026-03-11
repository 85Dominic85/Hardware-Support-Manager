"use client";

import { useState, useEffect, useRef } from "react";

/**
 * Hook that manages a search input with debounce.
 * Returns the raw input value (for the input field) and the debounced value (for queries).
 */
export function useDebouncedSearch(delay = 300) {
  const [inputValue, setInputValue] = useState("");
  const [debouncedValue, setDebouncedValue] = useState("");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      setDebouncedValue(inputValue);
    }, delay);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [inputValue, delay]);

  return {
    inputValue,
    setInputValue,
    debouncedValue,
  };
}

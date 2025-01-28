import { useState, useEffect } from "react";

const useDebounce = <T>(value: T, delayMillis = 300): T => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedValue(value);
    }, delayMillis);

    return () => {
      clearTimeout(timeout);
    };
    // As long as the value changes before the delay is up, the debounced value will stay the same.
    // Not expected delayMillis to change.
  }, [delayMillis, value]);

  return debouncedValue;
};

export default useDebounce;

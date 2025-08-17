// hooks/useIdleTimer.ts
import { useEffect } from "react";

export function useIdleTimer(timeout = 300000, onTimeout?: () => void) {
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    const resetTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        if (onTimeout) onTimeout();
      }, timeout);
    };

    const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];
    events.forEach((event) => window.addEventListener(event, resetTimer));

    resetTimer();

    return () => {
      clearTimeout(timer);
      events.forEach((event) => window.removeEventListener(event, resetTimer));
    };
  }, [timeout, onTimeout]);
}

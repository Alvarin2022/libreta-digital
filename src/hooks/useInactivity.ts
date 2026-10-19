import { useEffect, useRef, useState } from "react";

export default function useInactivity(timeout = 120000) {
  const [inactive, setInactive] = useState(false);
  const resetTimerRef = useRef<() => void>(() => undefined);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    const resetTimer = () => {
      clearTimeout(timer);
      setInactive(false);

      timer = setTimeout(() => {
        setInactive(true);
      }, timeout);
    };

    resetTimerRef.current = resetTimer;

    const handleActivity = (event: Event) => {
      if (
        event.target instanceof Element &&
        event.target.closest("[data-promotional-carousel]")
      ) {
        return;
      }

      resetTimer();
    };

    resetTimer();

    const events = [
      "mousemove",
      "mousedown",
      "keydown",
      "touchstart",
      "scroll",
    ];

    events.forEach((event) => window.addEventListener(event, handleActivity));

    return () => {
      clearTimeout(timer);
      resetTimerRef.current = () => undefined;

      events.forEach((event) =>
        window.removeEventListener(event, handleActivity)
      );
    };
  }, [timeout]);

  return {
    inactive,
    returnToApp: () => resetTimerRef.current(),
  };
}

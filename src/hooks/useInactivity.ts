import { useEffect, useState } from "react";

export default function useInactivity(timeout = 120000) {
  const [inactive, setInactive] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    const resetTimer = () => {
      clearTimeout(timer);
      setInactive(false);

      timer = setTimeout(() => {
        setInactive(true);
      }, timeout);
    };

    resetTimer();

    const events = [
      "mousemove",
      "mousedown",
      "keydown",
      "touchstart",
      "scroll",
    ];

    events.forEach((event) =>
      window.addEventListener(event, resetTimer)
    );

    return () => {
      clearTimeout(timer);

      events.forEach((event) =>
        window.removeEventListener(event, resetTimer)
      );
    };
  }, [timeout]);

  return inactive;
}
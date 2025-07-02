import { useEffect, useRef } from "react";

export function useAutoScroll(messages) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  return containerRef;
}

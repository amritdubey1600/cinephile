// hooks/useIntersectionObserver.ts
import { useEffect, useRef, useState } from "react";

export function useIntersectionObserver<T extends HTMLElement>(
  options?: IntersectionObserverInit
) {
  const ref = useRef<T | null>(null);
  const [isIntersecting, setIntersecting] = useState(false);

  useEffect(() => {
    const node = ref.current; // ✅ capture once

    if (!node) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIntersecting(true);
        observer.unobserve(entry.target); // animate once
      }
    }, options);

    observer.observe(node);

    return () => {
      if (node) observer.unobserve(node); // ✅ use captured node
    };
  }, [options]);

  return { ref, isIntersecting };
}
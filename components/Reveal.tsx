"use client";

import { ReactNode } from "react";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";

interface RevealProps {
    direction: string;
    children: ReactNode;
}

function getStyles(direction: string){
    switch(direction){
        case 'left':
            return "opacity-0 -translate-x-10";
        case 'right':
            return "opacity-0 translate-x-10";
        case 'up':
            return "opacity-0 -translate-y-10";
        case 'down':
            return "opacity-0 translate-y-10";
        default:
            return "opactiy-100 translate-0";
    }
}

export default function Reveal({ direction, children }: RevealProps) {
  const { ref, isIntersecting } = useIntersectionObserver<HTMLDivElement>({
    threshold: 0.2, // 20% visible
  });

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out transform 
        ${isIntersecting ? "opacity-100 translate-0" : getStyles(direction)}
      `}
    >
      {children}
    </div>
  );
}

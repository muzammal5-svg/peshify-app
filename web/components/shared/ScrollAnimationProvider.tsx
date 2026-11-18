"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function ScrollAnimationProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    let observer: IntersectionObserver;

    const setupObserver = () => {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-revealed");
              // Once revealed, unobserve to free resources
              observer.unobserve(entry.target);
            }
          });
        },
        {
          root: null,
          rootMargin: "0px 0px -40px 0px", // triggers slightly before full view for smooth flow
          threshold: 0.08,
        }
      );

      // Select elements marked with .reveal-on-scroll or data-animate
      const targets = document.querySelectorAll(
        ".reveal-on-scroll:not(.is-revealed), [data-animate]:not(.is-revealed)"
      );

      targets.forEach((el) => observer.observe(el));
    };

    // Slight delay to allow DOM reconciliation on route change
    const timer = setTimeout(setupObserver, 80);

    return () => {
      clearTimeout(timer);
      if (observer) observer.disconnect();
    };
  }, [pathname]);

  return <>{children}</>;
}

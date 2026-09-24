"use client";
import { useEffect, useRef, useState } from "react";

interface UseSlideUpInViewOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
  delay?: number;
}

export const useSlideUpInView = <T extends HTMLElement = HTMLElement>(
  options: UseSlideUpInViewOptions = {}
) => {
  const {
    threshold = 0.1,
    rootMargin = "0px",
    triggerOnce = true,
    delay = 0,
  } = options;

  const ref = useRef<T>(null);
  const [isInView, setIsInView] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (delay > 0) {
            setTimeout(() => {
              setIsInView(true);
              setHasTriggered(true);
            }, delay);
          } else {
            setIsInView(true);
            setHasTriggered(true);
          }

          if (triggerOnce) {
            observer.unobserve(element);
          }
        } else if (!triggerOnce && !hasTriggered) {
          setIsInView(false);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [threshold, rootMargin, triggerOnce, delay, hasTriggered]);

  const slideUpClasses = isInView
    ? "opacity-100 transform translate-y-0 transition-all duration-700 ease-out"
    : "opacity-0 transform translate-y-8 transition-all duration-700 ease-out";

  return { ref, isInView, slideUpClasses };
};

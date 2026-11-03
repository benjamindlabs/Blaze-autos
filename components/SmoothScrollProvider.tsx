"use client";

import React, { useEffect, useRef } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Respect user preference for reduced motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    // Detect touchscreens / mobile devices
    const isTouchDevice =
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia("(pointer: coarse)").matches;

    // On touchscreens / mobile, let the OS handle native 120Hz/60Hz compositor scrolling
    // without JavaScript touch interception (eliminates touch lag & rubber-banding)
    if (isTouchDevice) {
      gsap.registerPlugin(ScrollTrigger);
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 0, // Never hijack touch
    });

    lenisRef.current = lenis;
    if (typeof window !== "undefined") {
      (window as any).__lenis = lenis;
    }

    // Update ScrollTrigger on every Lenis scroll
    lenis.on("scroll", ScrollTrigger.update);

    // Sync GSAP's ticker to drive Lenis raf loop
    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tickerCallback);
      lenis.destroy();
      lenisRef.current = null;
      if (typeof window !== "undefined") {
        (window as any).__lenis = null;
      }
    };
  }, []);

  return <>{children}</>;
}

/**
 * Smoothly scroll to any target element ID on the page, leveraging Lenis on desktop
 * and native smooth scrolling on mobile.
 */
export const scrollToSection = (targetId: string) => {
  if (typeof window === "undefined") return;

  if (targetId === "top" || targetId === "#") {
    if ((window as any).__lenis) {
      (window as any).__lenis.scrollTo(0, { duration: 1.2 });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    return;
  }

  const cleanId = targetId.replace(/^#/, "");
  const el = document.getElementById(cleanId);
  if (!el) return;

  if ((window as any).__lenis) {
    (window as any).__lenis.scrollTo(el, { offset: 0, duration: 1.2 });
  } else {
    el.scrollIntoView({ behavior: "smooth" });
  }
};


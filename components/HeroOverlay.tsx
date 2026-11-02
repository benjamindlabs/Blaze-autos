"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export interface HeroOverlayProps {
  /** Reference to the trigger element (the pinned hero container) */
  triggerRef: React.RefObject<HTMLDivElement | null>;
  /** Total scroll scrub distance in pixels */
  scrollDistance: number;
  /** Whether user has prefers-reduced-motion enabled */
  isReducedMotion?: boolean;
}

export default function HeroOverlay({
  triggerRef,
  scrollDistance,
  isReducedMotion = false,
}: HeroOverlayProps) {
  const beat1Ref = useRef<HTMLDivElement>(null);
  const beat2Ref = useRef<HTMLDivElement>(null);
  const beat3Ref = useRef<HTMLDivElement>(null);
  const beat4Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    // If reduced motion is requested, render Beat 1 statically
    if (isReducedMotion) {
      if (beat1Ref.current) gsap.set(beat1Ref.current, { opacity: 1, x: 0, y: 0 });
      if (beat2Ref.current) gsap.set(beat2Ref.current, { opacity: 0 });
      if (beat3Ref.current) gsap.set(beat3Ref.current, { opacity: 0 });
      if (beat4Ref.current) gsap.set(beat4Ref.current, { opacity: 0 });
      return;
    }

    if (
      !triggerRef.current ||
      !beat1Ref.current ||
      !beat2Ref.current ||
      !beat3Ref.current ||
      !beat4Ref.current
    ) {
      return;
    }

    const ctx = gsap.context(() => {
      // Set initial states
      gsap.set(beat1Ref.current, { opacity: 1, x: 0, y: 0 });
      gsap.set(beat2Ref.current, { opacity: 0, x: 50, y: 0 });
      gsap.set(beat3Ref.current, { opacity: 0, x: 50, y: 0 });
      gsap.set(beat4Ref.current, { opacity: 0, x: -50, y: 0 });

      // GSAP Timeline synchronized across 0 to 100 units (representing 0% to 100% scroll progress)
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: triggerRef.current,
          start: "top top",
          end: `+=${scrollDistance}`,
          scrub: true,
        },
      });

      // Pin total timeline duration to 100
      tl.set({}, {}, 100);

      // --- Beat 1 (0% - 20%): THE REVEAL ---
      // Resting on load from 0% to 13%, then slides upward and fades out by 20%
      tl.to(
        beat1Ref.current,
        {
          opacity: 0,
          y: -50,
          ease: "power2.out",
          duration: 7,
        },
        13
      );

      // --- Beat 2 (25% - 50%): THE SCULPT ---
      // Slides in from the right (x: 50 -> 0) at 24% - 31%
      tl.fromTo(
        beat2Ref.current,
        { opacity: 0, x: 50, y: 0 },
        {
          opacity: 1,
          x: 0,
          y: 0,
          ease: "power2.out",
          duration: 7,
        },
        24
      );
      // Rests visible until 43%, then slides upward and fades out by 50%
      tl.to(
        beat2Ref.current,
        {
          opacity: 0,
          y: -50,
          ease: "power2.out",
          duration: 7,
        },
        43
      );

      // --- Beat 3 (55% - 75%): THE COCKPIT ---
      // Slides in from the right (x: 50 -> 0) at 54% - 61%
      tl.fromTo(
        beat3Ref.current,
        { opacity: 0, x: 50, y: 0 },
        {
          opacity: 1,
          x: 0,
          y: 0,
          ease: "power2.out",
          duration: 7,
        },
        54
      );
      // Rests visible until 68%, then slides upward and fades out by 75%
      tl.to(
        beat3Ref.current,
        {
          opacity: 0,
          y: -50,
          ease: "power2.out",
          duration: 7,
        },
        68
      );

      // --- Beat 4 (80% - 100%): THE MACHINE ---
      // Slides in from the left (x: -50 -> 0) at 79% - 87% and remains resting
      tl.fromTo(
        beat4Ref.current,
        { opacity: 0, x: -50, y: 0 },
        {
          opacity: 1,
          x: 0,
          y: 0,
          ease: "power2.out",
          duration: 8,
        },
        79
      );
    }, triggerRef);

    return () => {
      ctx.revert();
    };
  }, [triggerRef, scrollDistance, isReducedMotion]);

  return (
    <div className="hero-overlay" aria-live="polite">
      {/* =========================================================================
          Beat 1 (0% - 20%) - "THE REVEAL"
          Layout: Bottom-Left
         ========================================================================= */}
      <div ref={beat1Ref} className="beat-container-1">
        <span className="headline-condensed">ARRIVE</span>
        <span className="accent-serif-italic">DIFFERENT.</span>
      </div>

      {/* =========================================================================
          Beat 2 (25% - 50%) - "THE SCULPT"
          Layout: Top-Right
         ========================================================================= */}
      <div ref={beat2Ref} className="beat-container-2">
        <span className="headline-condensed">SCULPTED</span>
        <span className="white-serif-italic">BY OBSESSION.</span>

        {/* Subtext: thin accent vertical line next to tracking-widest text */}
        <div className="subtext-group">
          <span className="subtext-track-widest">
            EVERY LINE, A STATEMENT.
          </span>
          <span className="accent-line-vertical" aria-hidden="true" />
        </div>
      </div>

      {/* =========================================================================
          Beat 3 (55% - 75%) - "THE COCKPIT"
          Layout: Bottom-Right
         ========================================================================= */}
      <div ref={beat3Ref} className="beat-container-3">
        <span className="headline-condensed">COMMAND</span>
        <span className="white-serif-italic">THE COCKPIT.</span>
      </div>

      {/* =========================================================================
          Beat 4 (80% - 100%) - "THE MACHINE"
          Layout: Center-Left with Clickable CTA
         ========================================================================= */}
      <div ref={beat4Ref} className="beat-container-4">
        <span className="headline-condensed">THE COMPLETE</span>
        <span className="white-serif-italic">MACHINE.</span>

        {/* Sharp square CTA button with pointer-events: auto */}
        <div>
          <a href="#inventory" className="cta-square-btn">
            EXPLORE INVENTORY
          </a>
        </div>
      </div>
    </div>
  );
}

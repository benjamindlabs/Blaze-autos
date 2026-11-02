"use client";

import React, { useEffect, useRef, useCallback, useSyncExternalStore } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HeroOverlay from "./HeroOverlay";

/**
 * 196 extracted walk-in frame filenames in chronological sequence
 * Source: /frames-walkin/
 */
const WALKIN_FRAMES: string[] = [
  "img_00003.jpg", "img_00005.jpg", "img_00009.jpg", "img_00013.jpg", "img_00017.jpg",
  "img_00021.jpg", "img_00027.jpg", "img_00031.jpg", "img_00033.jpg", "img_00037.jpg",
  "img_00043.jpg", "img_00045.jpg", "img_00051.jpg", "img_00053.jpg", "img_00057.jpg",
  "img_00063.jpg", "img_00067.jpg", "img_00071.jpg", "img_00073.jpg", "img_00077.jpg",
  "img_00083.jpg", "img_00087.jpg", "img_00091.jpg", "img_00093.jpg", "img_00097.jpg",
  "img_00103.jpg", "img_00107.jpg", "img_00111.jpg", "img_00113.jpg", "img_00117.jpg",
  "img_00123.jpg", "img_00127.jpg", "img_00131.jpg", "img_00133.jpg", "img_00137.jpg",
  "img_00143.jpg", "img_00147.jpg", "img_00151.jpg", "img_00153.jpg", "img_00157.jpg",
  "img_00161.jpg", "img_00167.jpg", "img_00171.jpg", "img_00173.jpg", "img_00177.jpg",
  "img_00183.jpg", "img_00187.jpg", "img_00191.jpg", "img_00193.jpg", "img_00197.jpg",
  "img_00203.jpg", "img_00207.jpg", "img_00211.jpg", "img_00213.jpg", "img_00217.jpg",
  "img_00223.jpg", "img_00225.jpg", "img_00231.jpg", "img_00233.jpg", "img_00237.jpg",
  "img_00243.jpg", "img_00247.jpg", "img_00251.jpg", "img_00253.jpg", "img_00257.jpg",
  "img_00263.jpg", "img_00267.jpg", "img_00271.jpg", "img_00273.jpg", "img_00277.jpg",
  "img_00283.jpg", "img_00287.jpg", "img_00291.jpg", "img_00293.jpg", "img_00297.jpg",
  "img_00303.jpg", "img_00307.jpg", "img_00311.jpg", "img_00313.jpg", "img_00317.jpg",
  "img_00323.jpg", "img_00327.jpg", "img_00331.jpg", "img_00333.jpg", "img_00337.jpg",
  "img_00343.jpg", "img_00347.jpg", "img_00351.jpg", "img_00353.jpg", "img_00357.jpg",
  "img_00363.jpg", "img_00367.jpg", "img_00371.jpg", "img_00373.jpg", "img_00377.jpg",
  "img_00383.jpg", "img_00387.jpg", "img_00391.jpg", "img_00393.jpg", "img_00397.jpg",
  "img_00403.jpg", "img_00407.jpg", "img_00411.jpg", "img_00413.jpg", "img_00417.jpg",
  "img_00423.jpg", "img_00427.jpg", "img_00431.jpg", "img_00433.jpg", "img_00437.jpg",
  "img_00443.jpg", "img_00447.jpg", "img_00451.jpg", "img_00453.jpg", "img_00457.jpg",
  "img_00463.jpg", "img_00465.jpg", "img_00471.jpg", "img_00475.jpg", "img_00477.jpg",
  "img_00481.jpg", "img_00487.jpg", "img_00491.jpg", "img_00495.jpg", "img_00497.jpg",
  "img_00501.jpg", "img_00507.jpg", "img_00511.jpg", "img_00515.jpg", "img_00517.jpg",
  "img_00521.jpg", "img_00527.jpg", "img_00531.jpg", "img_00535.jpg", "img_00537.jpg",
  "img_00541.jpg", "img_00545.jpg", "img_00551.jpg", "img_00555.jpg", "img_00557.jpg",
  "img_00561.jpg", "img_00567.jpg", "img_00571.jpg", "img_00575.jpg", "img_00577.jpg",
  "img_00581.jpg", "img_00587.jpg", "img_00591.jpg", "img_00595.jpg", "img_00597.jpg",
  "img_00601.jpg", "img_00605.jpg", "img_00610.jpg", "img_00614.jpg", "img_00617.jpg",
  "img_00621.jpg", "img_00626.jpg", "img_00629.jpg", "img_00634.jpg", "img_00637.jpg",
  "img_00641.jpg", "img_00646.jpg", "img_00649.jpg", "img_00654.jpg", "img_00657.jpg",
  "img_00661.jpg", "img_00665.jpg", "img_00670.jpg", "img_00674.jpg", "img_00677.jpg",
  "img_00681.jpg", "img_00686.jpg", "img_00690.jpg", "img_00694.jpg", "img_00697.jpg",
  "img_00701.jpg", "img_00706.jpg", "img_00710.jpg", "img_00714.jpg", "img_00717.jpg",
  "img_00721.jpg", "img_00726.jpg", "img_00730.jpg", "img_00734.jpg", "img_00737.jpg",
  "img_00741.jpg", "img_00746.jpg", "img_00750.jpg", "img_00754.jpg", "img_00757.jpg",
  "img_00761.jpg", "img_00766.jpg", "img_00770.jpg", "img_00774.jpg", "img_00777.jpg",
  "img_00781.jpg"
];

const TOTAL_FRAMES = WALKIN_FRAMES.length; // 196 frames
const DEFAULT_SCROLL_DISTANCE = 3000;
const CONCURRENT_DOWNLOAD_LIMIT = 6;

// React 19 subscription for reduced motion preference
const subscribeReducedMotion = (callback: () => void) => {
  if (typeof window === "undefined") return () => { };
  const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  mediaQuery.addEventListener("change", callback);
  return () => mediaQuery.removeEventListener("change", callback);
};

const getReducedMotionSnapshot = () => {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

const getReducedMotionServerSnapshot = () => false;

export interface ShowroomScrollSequenceProps {
  scrollDistance?: number;
  className?: string;
}

export default function ShowroomScrollSequence({
  scrollDistance = DEFAULT_SCROLL_DISTANCE,
  className = "",
}: ShowroomScrollSequenceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const isReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  );

  // High-frequency animation state stored in mutable refs
  const currentFrameRef = useRef<number>(0);
  const lastDrawnIndexRef = useRef<number>(-1);
  const rafIdRef = useRef<number | null>(null);

  // Image cache and loading state
  const imagesRef = useRef<(HTMLImageElement | null)[]>(
    new Array(TOTAL_FRAMES).fill(null)
  );
  const loadedMapRef = useRef<boolean[]>(new Array(TOTAL_FRAMES).fill(false));
  const isCancelledRef = useRef<boolean>(false);

  const getFrameUrl = useCallback((index: number) => {
    const filename = WALKIN_FRAMES[index] || WALKIN_FRAMES[0];
    return `/frames-walkin/${filename}`;
  }, []);

  // Draw current frame with sharp DPR awareness and object-fit: cover
  const renderFrame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const targetIdx = currentFrameRef.current;
    let imgToDraw: HTMLImageElement | null = null;
    let drawnIdx = targetIdx;

    const images = imagesRef.current;
    const loadedMap = loadedMapRef.current;

    // Direct hit check
    if (images[targetIdx] && loadedMap[targetIdx]) {
      imgToDraw = images[targetIdx];
    } else {
      // Find nearest loaded frame to eliminate any blank flashes or flickering
      for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
        const prev = targetIdx - offset;
        const next = targetIdx + offset;

        if (prev >= 0 && loadedMap[prev] && images[prev]) {
          imgToDraw = images[prev];
          drawnIdx = prev;
          break;
        }
        if (next < TOTAL_FRAMES && loadedMap[next] && images[next]) {
          imgToDraw = images[next];
          drawnIdx = next;
          break;
        }
      }
    }

    if (!imgToDraw || !imgToDraw.naturalWidth || !imgToDraw.naturalHeight) {
      return;
    }

    const imgW = imgToDraw.naturalWidth;
    const imgH = imgToDraw.naturalHeight;
    const canvasW = canvas.width;
    const canvasH = canvas.height;

    const imgAspect = imgW / imgH;
    const canvasAspect = canvasW / canvasH;

    let sWidth: number;
    let sHeight: number;
    let sx: number;
    let sy: number;

    // object-fit: cover centered crop
    if (canvasAspect > imgAspect) {
      sWidth = imgW;
      sHeight = imgW / canvasAspect;
      sx = 0;
      sy = (imgH - sHeight) / 2;
    } else {
      sHeight = imgH;
      sWidth = imgH * canvasAspect;
      sx = (imgW - sWidth) / 2;
      sy = 0;
    }

    ctx.drawImage(imgToDraw, sx, sy, sWidth, sHeight, 0, 0, canvasW, canvasH);
    lastDrawnIndexRef.current = drawnIdx;
  }, []);

  const requestRender = useCallback(() => {
    if (rafIdRef.current !== null) return;
    rafIdRef.current = requestAnimationFrame(() => {
      rafIdRef.current = null;
      renderFrame();
    });
  }, [renderFrame]);

  // Canvas DPR resizing with mobile GPU optimization
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const viewport = viewportRef.current;
    if (!canvas || !viewport) return;

    const rect = viewport.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    // Mobile screens don't need 3x over-rendering (cuts GPU fill-rate by 75%)
    const isMobile =
      typeof window !== "undefined" &&
      (window.innerWidth < 768 || window.matchMedia("(pointer: coarse)").matches);
    const maxDpr = isMobile ? 1.0 : 1.5;
    const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
    const targetW = Math.round(rect.width * dpr);
    const targetH = Math.round(rect.height * dpr);

    if (canvas.width !== targetW || canvas.height !== targetH) {
      canvas.width = targetW;
      canvas.height = targetH;
    }

    requestRender();
  }, [requestRender]);

  // Dedicated single image loader
  const loadSingleImage = useCallback(
    (index: number): Promise<void> => {
      return new Promise((resolve) => {
        if (isCancelledRef.current) return resolve();
        if (index < 0 || index >= TOTAL_FRAMES) return resolve();
        if (loadedMapRef.current[index] && imagesRef.current[index]) {
          return resolve();
        }

        const img = new Image();
        const url = getFrameUrl(index);
        img.src = url;

        img.onload = () => {
          if (isCancelledRef.current) return resolve();
          imagesRef.current[index] = img;
          loadedMapRef.current[index] = true;

          // If this is the current active frame or initial paint, draw immediately
          if (index === currentFrameRef.current || lastDrawnIndexRef.current === -1) {
            requestRender();
          }
          resolve();
        };

        img.onerror = () => {
          resolve();
        };
      });
    },
    [getFrameUrl, requestRender]
  );

  // Active download pool state
  const activeWorkersRef = useRef<number>(0);
  const downloadQueueRef = useRef<number[]>([]);

  const pumpQueue = useCallback(() => {
    if (isCancelledRef.current) return;
    const CONCURRENT_DOWNLOAD_LIMIT = 3;

    while (
      activeWorkersRef.current < CONCURRENT_DOWNLOAD_LIMIT &&
      downloadQueueRef.current.length > 0
    ) {
      const frameIdx = downloadQueueRef.current.shift()!;
      if (loadedMapRef.current[frameIdx]) continue;

      activeWorkersRef.current++;
      loadSingleImage(frameIdx).finally(() => {
        activeWorkersRef.current--;
        pumpQueue();
      });
    }
  }, [loadSingleImage]);

  const queueFrames = useCallback(
    (frameIndices: number[], priority = false) => {
      const needed = frameIndices.filter(
        (idx) => idx >= 0 && idx < TOTAL_FRAMES && !loadedMapRef.current[idx]
      );
      if (needed.length === 0) return;

      if (priority) {
        // High priority: insert directly at front of download queue
        downloadQueueRef.current = Array.from(
          new Set([...needed, ...downloadQueueRef.current])
        );
      } else {
        downloadQueueRef.current = Array.from(
          new Set([...downloadQueueRef.current, ...needed])
        );
      }
      pumpQueue();
    },
    [pumpQueue]
  );

  // 1. Initial Page Load: Instant Frame 0 paint + immediate window [1..16] + sparse keyframes
  useEffect(() => {
    isCancelledRef.current = false;

    // Load Frame 0 with highest priority
    loadSingleImage(0).then(() => {
      requestRender();
    });

    // Window 1: Immediate first 16 frames so initial scrub is 100% fluid
    const initialWindow: number[] = [];
    for (let i = 1; i <= Math.min(16, TOTAL_FRAMES - 1); i++) {
      initialWindow.push(i);
    }
    queueFrames(initialWindow, true);

    // Window 2: Keyframe spine (every 8th frame) across whole sequence
    const keyframes: number[] = [];
    for (let k = 24; k < TOTAL_FRAMES; k += 8) {
      keyframes.push(k);
    }
    queueFrames(keyframes, false);

    // Window 3: Background stream remaining frames during idle time
    const remaining: number[] = [];
    for (let r = 1; r < TOTAL_FRAMES; r++) {
      if (r > 16 && r % 8 !== 0) {
        remaining.push(r);
      }
    }

    const idleTimer = setTimeout(() => {
      queueFrames(remaining, false);
    }, 400);

    return () => {
      isCancelledRef.current = true;
      clearTimeout(idleTimer);
    };
  }, [loadSingleImage, queueFrames, requestRender]);

  // 2. Resize and Canvas DPR handling
  useEffect(() => {
    resizeCanvas();

    const handleWindowResize = () => {
      resizeCanvas();
      ScrollTrigger.refresh();
    };

    window.addEventListener("resize", handleWindowResize);

    const resizeObserver = new ResizeObserver(() => {
      resizeCanvas();
      ScrollTrigger.refresh();
    });

    if (viewportRef.current) {
      resizeObserver.observe(viewportRef.current);
    }

    return () => {
      window.removeEventListener("resize", handleWindowResize);
      resizeObserver.disconnect();
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };
  }, [resizeCanvas]);

  // 3. Mount GSAP ScrollTrigger with Streaming Window Prioritization
  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    if (isReducedMotion) {
      currentFrameRef.current = 0;
      requestRender();
      return;
    }

    if (!containerRef.current || !viewportRef.current) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: `+=${scrollDistance}`,
        pin: viewportRef.current,
        pinSpacing: true,
        scrub: 0.5,
        anticipatePin: 1,
        onUpdate: (self) => {
          const progress = Math.min(1, Math.max(0, self.progress));
          const targetIndex = Math.min(
            TOTAL_FRAMES - 1,
            Math.max(0, Math.round(progress * (TOTAL_FRAMES - 1)))
          );

          if (targetIndex !== currentFrameRef.current) {
            currentFrameRef.current = targetIndex;
            requestRender();

            // Stream 14 frames ahead in the direction of scroll immediately
            const ahead: number[] = [];
            for (let offset = -2; offset <= 14; offset++) {
              const f = targetIndex + offset;
              if (f >= 0 && f < TOTAL_FRAMES) {
                ahead.push(f);
              }
            }
            queueFrames(ahead, true);
          }
        },
      });
    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, [isReducedMotion, scrollDistance, requestRender, queueFrames]);

  return (
    <section
      ref={containerRef}
      id="hero-walkin"
      className={`relative w-full bg-black select-none ${className}`}
      style={{
        position: "relative",
        width: "100%",
        height: isReducedMotion ? "100vh" : undefined,
        backgroundColor: "#000000",
      }}
      aria-label="Garage Walk-in Hero Experience"
    >
      <div
        ref={viewportRef}
        style={{
          position: "relative",
          width: "100vw",
          maxWidth: "100%",
          height: "100vh",
          overflow: "hidden",
          backgroundColor: "#000000",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <canvas
          ref={canvasRef}
          style={{
            display: "block",
            width: "100%",
            height: "100%",
            backgroundColor: "#000000",
          }}
        />
        <HeroOverlay
          triggerRef={containerRef}
          scrollDistance={scrollDistance}
          isReducedMotion={isReducedMotion}
        />
      </div>
    </section>
  );
}

"use client";

import React, { useEffect, useRef, useCallback, useState, useSyncExternalStore } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TelemetryOverlay from "./TelemetryOverlay";

export interface InteriorHeroProps {
  /** Total number of frames in the sequence (default: 401) */
  totalFrames?: number;
  /** Scroll distance in pixels across which to scrub the sequence (default: 4000) */
  scrollDistance?: number;
  /** Frame URL resolver function (0-based index) */
  getFrameUrl?: (index: number) => string;
  /** GSAP scrub smoothing factor: true for direct 1:1, or a number for micro-smoothing (default: true) */
  scrub?: boolean | number;
  /** Custom container class */
  className?: string;
}

const DEFAULT_TOTAL_FRAMES = 401;
const DEFAULT_SCROLL_DISTANCE = 4000;
const CONCURRENT_DOWNLOAD_LIMIT = 3;

/** Default resolver for zero-padded frame paths: WebP with mobile / desktop routing */
export const defaultGetFrameUrl = (index: number): string => {
  const frameNumber = index + 1;
  const padded = String(frameNumber).padStart(5, "0");
  const isMobile =
    typeof window !== "undefined" &&
    (window.innerWidth < 768 || window.matchMedia("(pointer: coarse)").matches);
  const folder = isMobile ? "interior-mobile" : "interior-webp";
  return `/frames/${folder}/img_${padded}.webp`;
};

// React 19 compliant subscription to prefers-reduced-motion
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

export default function InteriorHero({
  totalFrames = DEFAULT_TOTAL_FRAMES,
  scrollDistance = DEFAULT_SCROLL_DISTANCE,
  getFrameUrl = defaultGetFrameUrl,
  scrub = true,
  className = "",
}: InteriorHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Lazy loading state: triggered when scrolling within 800px of section
  const [isLazyTriggered, setIsLazyTriggered] = useState<boolean>(false);

  const isReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  );

  // High-frequency animation state stored in mutable refs to avoid React re-render overhead
  const currentFrameRef = useRef<number>(0);
  const lastDrawnIndexRef = useRef<number>(-1);
  const rafIdRef = useRef<number | null>(null);

  // Frame cache and loading tracking
  const imagesRef = useRef<(HTMLImageElement | null)[]>([]);
  const loadedMapRef = useRef<boolean[]>([]);
  const isCancelledRef = useRef<boolean>(false);

  // Draw the target frame to canvas with sharp DPR awareness and cinematic cover fit
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

    // Check if target frame is loaded
    if (images[targetIdx] && loadedMap[targetIdx]) {
      imgToDraw = images[targetIdx];
    } else {
      // Find nearest available loaded frame to prevent blank flashes or flickering
      for (let offset = 1; offset < totalFrames; offset++) {
        const prev = targetIdx - offset;
        const next = targetIdx + offset;

        if (prev >= 0 && loadedMap[prev] && images[prev]) {
          imgToDraw = images[prev];
          drawnIdx = prev;
          break;
        }
        if (next < totalFrames && loadedMap[next] && images[next]) {
          imgToDraw = images[next];
          drawnIdx = next;
          break;
        }
      }

      // Fallback to the last successfully drawn frame or first frame
      if (!imgToDraw && lastDrawnIndexRef.current >= 0 && loadedMap[lastDrawnIndexRef.current]) {
        imgToDraw = images[lastDrawnIndexRef.current];
        drawnIdx = lastDrawnIndexRef.current;
      }
    }

    if (!imgToDraw) return;
    lastDrawnIndexRef.current = drawnIdx;

    const cw = canvas.width;
    const ch = canvas.height;
    if (cw === 0 || ch === 0) return;

    const iw = imgToDraw.naturalWidth || imgToDraw.width;
    const ih = imgToDraw.naturalHeight || imgToDraw.height;
    if (iw === 0 || ih === 0) return;

    // Calculate cover fit: centers image without distortion or aspect ratio deformation
    const scale = Math.max(cw / iw, ch / ih);
    const dw = iw * scale;
    const dh = ih * scale;
    const dx = (cw - dw) / 2;
    const dy = (ch - dh) / 2;

    ctx.drawImage(imgToDraw, dx, dy, dw, dh);
  }, [totalFrames]);

  // Request a render on next animation frame
  const requestRender = useCallback(() => {
    if (rafIdRef.current !== null) return;
    rafIdRef.current = requestAnimationFrame(() => {
      rafIdRef.current = null;
      renderFrame();
    });
  }, [renderFrame]);

  // Adjust canvas pixel buffer to match display rect * DPR (capped for mobile 60/120fps performance)
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const viewport = viewportRef.current;
    if (!canvas || !viewport) return;

    const rect = viewport.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    // Mobile screens don't need 3x over-rendering (cuts mobile GPU fill-rate by 75%)
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
      lastDrawnIndexRef.current = -1;
    }

    requestRender();
  }, [requestRender]);

  // Dedicated single image loader with asynchronous GPU decoding
  const loadSingleImage = useCallback(
    (index: number): Promise<void> => {
      return new Promise((resolve) => {
        if (isCancelledRef.current) return resolve();
        if (index < 0 || index >= totalFrames) return resolve();
        if (loadedMapRef.current[index] && imagesRef.current[index]) {
          return resolve();
        }

        const img = new Image();
        const url = getFrameUrl(index);

        const onDecoded = () => {
          if (isCancelledRef.current) return resolve();
          imagesRef.current[index] = img;
          loadedMapRef.current[index] = true;

          // If this is the current active frame or initial paint, draw immediately
          if (index === currentFrameRef.current || lastDrawnIndexRef.current === -1) {
            requestRender();
          }
          resolve();
        };

        img.onload = () => {
          if ("decode" in img) {
            img
              .decode()
              .then(onDecoded)
              .catch(() => {
                onDecoded();
              });
          } else {
            onDecoded();
          }
        };

        img.onerror = () => {
          resolve();
        };

        img.src = url;
      });
    },
    [totalFrames, getFrameUrl, requestRender]
  );

  // Active download pool state with proximity sorting
  const activeWorkersRef = useRef<number>(0);
  const downloadQueueRef = useRef<number[]>([]);

  const pumpQueue = useCallback(() => {
    if (isCancelledRef.current) return;
    const CONCURRENT_DOWNLOAD_LIMIT = 5;

    // Dynamically prioritize frames closest to the user's current playhead
    const current = currentFrameRef.current;
    downloadQueueRef.current.sort((a, b) => Math.abs(a - current) - Math.abs(b - current));

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
        (idx) => idx >= 0 && idx < totalFrames && !loadedMapRef.current[idx]
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
    [totalFrames, pumpQueue]
  );

  // 1. Initial Page Load: Instant Frame 0 paint
  useEffect(() => {
    isCancelledRef.current = false;

    if (imagesRef.current.length !== totalFrames) {
      imagesRef.current = new Array(totalFrames).fill(null);
      loadedMapRef.current = new Array(totalFrames).fill(false);
    }

    loadSingleImage(0).then(() => {
      requestRender();
    });

    return () => {
      isCancelledRef.current = true;
    };
  }, [totalFrames, loadSingleImage, requestRender]);

  // 2. IntersectionObserver: Trigger windowed streaming when approaching within 600px
  useEffect(() => {
    if (typeof window === "undefined" || !containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry && entry.isIntersecting) {
          setIsLazyTriggered(true);
          observer.disconnect();
        }
      },
      {
        root: null,
        rootMargin: "600px 0px 600px 0px",
        threshold: 0,
      }
    );

    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  // 3. Progressive Frame Streaming (Activated only after lazy trigger)
  useEffect(() => {
    if (!isLazyTriggered) return;

    // Window A: Immediate entry window [1..16]
    const entryWindow: number[] = [];
    for (let i = 1; i <= Math.min(16, totalFrames - 1); i++) {
      entryWindow.push(i);
    }
    queueFrames(entryWindow, true);

    // Window B: Keyframe spine (every 10th frame: 10, 20, 30...)
    // Preloads ~40 keyframes total across all 401 frames so any rapid scrub has immediate visual fallback
    const keyframes: number[] = [];
    for (let i = 20; i < totalFrames; i += 10) {
      keyframes.push(i);
    }
    if (!keyframes.includes(totalFrames - 1)) {
      keyframes.push(totalFrames - 1);
    }
    queueFrames(keyframes, false);
  }, [isLazyTriggered, totalFrames, queueFrames]);

  // Handle Resize and DPR changes
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

  // GSAP ScrollTrigger setup with predictive streaming ahead of scroll
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
        scrub: scrub,
        anticipatePin: 1,
        onUpdate: (self) => {
          const progress = Math.min(1, Math.max(0, self.progress));
          const targetIndex = Math.min(
            totalFrames - 1,
            Math.max(0, Math.round(progress * (totalFrames - 1)))
          );

          if (targetIndex !== currentFrameRef.current) {
            // Predictive streaming: stream 16 frames ahead in the direction of scroll + 2 behind
            const dir = targetIndex >= currentFrameRef.current ? 1 : -1;
            const streamAhead: number[] = [];
            for (let i = -2; i <= 16; i++) {
              const idx = targetIndex + i * dir;
              if (idx >= 0 && idx < totalFrames) {
                streamAhead.push(idx);
              }
            }
            queueFrames(streamAhead, true);

            currentFrameRef.current = targetIndex;
            requestRender();
          }
        },
      });
    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, [isReducedMotion, scrollDistance, scrub, totalFrames, requestRender, queueFrames]);

  return (
    <section
      ref={containerRef}
      id="heritage"
      className={`relative w-full bg-black select-none ${className}`}
      style={{
        position: "relative",
        width: "100%",
        height: isReducedMotion ? "100vh" : undefined,
        backgroundColor: "#000000",
      }}
      aria-label="Cinematic Automotive Interior Presentation"
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
        <TelemetryOverlay
          triggerRef={containerRef}
          scrollDistance={scrollDistance}
          isReducedMotion={isReducedMotion}
        />
      </div>
    </section>
  );
}

// Named alias export for HeroSequence
export { InteriorHero, InteriorHero as HeroSequence };

"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getV8AudioEngine } from "@/lib/v8AudioEngine";

export interface TelemetryOverlayProps {
  /** Reference to the trigger element (the pinned InteriorHero container) */
  triggerRef: React.RefObject<HTMLDivElement | null>;
  /** Total scroll scrub distance in pixels */
  scrollDistance: number;
  /** Whether user has prefers-reduced-motion enabled */
  isReducedMotion?: boolean;
}

export default function TelemetryOverlay({
  triggerRef,
  scrollDistance,
  isReducedMotion = false,
}: TelemetryOverlayProps) {
  // Section refs for GSAP animation
  const hudFrameRef = useRef<HTMLDivElement>(null);
  const stage1Ref = useRef<HTMLDivElement>(null);
  const stage2Ref = useRef<HTMLDivElement>(null);
  const stage3Ref = useRef<HTMLDivElement>(null);
  const progressTextRef = useRef<HTMLSpanElement>(null);

  // Modal state for private allocation viewing
  const [isViewingModalOpen, setIsViewingModalOpen] = useState(false);
  const [isSpecModalOpen, setIsSpecModalOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  useEffect(() => {
    const engine = getV8AudioEngine();
    const unsubscribe = engine.onEnded(() => {
      setIsPlayingAudio(false);
    });

    return () => {
      unsubscribe();
      engine.stop();
    };
  }, []);

  const toggleV8Audio = () => {
    const engine = getV8AudioEngine();
    if (isPlayingAudio) {
      engine.stop();
      setIsPlayingAudio(false);
    } else {
      const ok = engine.start();
      if (ok) setIsPlayingAudio(true);
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    // If reduced motion is requested, render statically
    if (isReducedMotion) {
      if (hudFrameRef.current) gsap.set(hudFrameRef.current, { opacity: 1 });
      if (stage1Ref.current) gsap.set(stage1Ref.current, { opacity: 1, x: 0, yPercent: -50, y: 0 });
      if (stage2Ref.current) gsap.set(stage2Ref.current, { opacity: 0 });
      if (stage3Ref.current) gsap.set(stage3Ref.current, { opacity: 0 });
      return;
    }

    if (
      !triggerRef.current ||
      !hudFrameRef.current ||
      !stage1Ref.current ||
      !stage2Ref.current ||
      !stage3Ref.current
    ) {
      return;
    }

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // Desktop layout (min-width: 769px)
      mm.add("(min-width: 769px)", () => {
        // Initial states: vertically centered with yPercent: -50
        gsap.set(hudFrameRef.current, { opacity: 0 });
        gsap.set(stage1Ref.current, { opacity: 0, x: -40, yPercent: -50, y: 0 });
        gsap.set(stage2Ref.current, { opacity: 0, x: 40, yPercent: -50, y: 0 });
        gsap.set(stage3Ref.current, { opacity: 0, yPercent: -50, y: 30 });

        // GSAP Timeline synchronized across 0 to 100 units
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: triggerRef.current,
            start: "top top",
            end: `+=${scrollDistance}`,
            scrub: 0.5,
            onUpdate: (self) => {
              if (progressTextRef.current) {
                const pct = Math.round(self.progress * 100);
                progressTextRef.current.innerText = `${pct.toString().padStart(2, "0")}%`;
              }
            },
          },
        });

        tl.set({}, {}, 100);

        // --- Global HUD Frame: fades in at 2%, stays visible throughout ---
        tl.to(
          hudFrameRef.current,
          {
            opacity: 1,
            duration: 4,
            ease: "power2.out",
          },
          2
        );

        // --- Stage 01 (3% - 30%): AERO & POWERTRAIN (Exterior Focus) ---
        tl.to(
          stage1Ref.current,
          {
            opacity: 1,
            x: 0,
            yPercent: -50,
            y: 0,
            duration: 5,
            ease: "power2.out",
          },
          3
        );
        tl.to(
          stage1Ref.current,
          {
            opacity: 0,
            yPercent: -50,
            y: -30,
            duration: 6,
            ease: "power2.in",
          },
          24
        );

        // --- Stage 02 (33% - 68%): COCKPIT & ACOUSTICS (Windshield & Orbit) ---
        tl.to(
          stage2Ref.current,
          {
            opacity: 1,
            x: 0,
            yPercent: -50,
            y: 0,
            duration: 6,
            ease: "power2.out",
          },
          33
        );
        tl.to(
          stage2Ref.current,
          {
            opacity: 0,
            yPercent: -50,
            y: -30,
            duration: 6,
            ease: "power2.in",
          },
          62
        );

        // --- Stage 03 (72% - 100%): BESPOKE ALLOCATION & VIEWING ---
        tl.to(
          stage3Ref.current,
          {
            opacity: 1,
            yPercent: -50,
            y: 0,
            duration: 8,
            ease: "power2.out",
          },
          72
        );
      });

      // Mobile layout (max-width: 768px): Cards docked at bottom, centered horizontally
      mm.add("(max-width: 768px)", () => {
        gsap.set(hudFrameRef.current, { opacity: 0 });
        gsap.set(stage1Ref.current, { opacity: 0, xPercent: -50, y: 20 });
        gsap.set(stage2Ref.current, { opacity: 0, xPercent: -50, y: 20 });
        gsap.set(stage3Ref.current, { opacity: 0, xPercent: -50, y: 20 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: triggerRef.current,
            start: "top top",
            end: `+=${scrollDistance}`,
            scrub: 0.5,
          },
        });

        tl.set({}, {}, 100);

        // Stage 1 (3% - 30%)
        tl.to(
          stage1Ref.current,
          {
            opacity: 1,
            xPercent: -50,
            y: 0,
            duration: 5,
            ease: "power2.out",
          },
          3
        );
        tl.to(
          stage1Ref.current,
          {
            opacity: 0,
            xPercent: -50,
            y: -15,
            duration: 6,
            ease: "power2.in",
          },
          24
        );

        // Stage 2 (33% - 68%)
        tl.to(
          stage2Ref.current,
          {
            opacity: 1,
            xPercent: -50,
            y: 0,
            duration: 6,
            ease: "power2.out",
          },
          33
        );
        tl.to(
          stage2Ref.current,
          {
            opacity: 0,
            xPercent: -50,
            y: -15,
            duration: 6,
            ease: "power2.in",
          },
          62
        );

        // Stage 3 (72% - 100%)
        tl.to(
          stage3Ref.current,
          {
            opacity: 1,
            xPercent: -50,
            y: 0,
            duration: 8,
            ease: "power2.out",
          },
          72
        );
      });
    }, triggerRef);

    return () => {
      ctx.revert();
    };
  }, [triggerRef, scrollDistance, isReducedMotion]);

  const handleSubmitInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setIsViewingModalOpen(false);
    }, 2200);
  };

  return (
    <div className="telemetry-overlay-root" aria-live="polite">
      {/* =========================================================================
          PERSISTENT ARCHITECTURAL HUD FRAME
         ========================================================================= */}
      <div ref={hudFrameRef} className="telemetry-hud-frame">
        {/* Top-Left: System Diagnostic Header */}
        <div className="hud-corner hud-top-left">
          <div className="hud-status-badge">
            <span className="hud-status-pulse" />
            <span className="hud-mono-label">AMG TELEMETRY // W167 COUPE</span>
          </div>
          <div className="hud-mono-sub">
            LAT 48.7758° N &middot; LON 9.1829° E [AFFALTERBACH DE]
          </div>
        </div>

        {/* Top-Right: Scrub Telemetry Gauge & V8 Cold Start Audio Trigger */}
        <div className="hud-corner hud-top-right">
          <button
            type="button"
            className={`hud-audio-trigger ${isPlayingAudio ? "is-active" : ""}`}
            onClick={toggleV8Audio}
            aria-label="Toggle AMG 4.0L V8 Cold Start Audio"
          >
            <span className="audio-icon-box">
              {isPlayingAudio ? (
                <span className="audio-equalizer">
                  <span className="eq-bar" />
                  <span className="eq-bar" />
                  <span className="eq-bar" />
                  <span className="eq-bar" />
                </span>
              ) : (
                <span className="play-triangle">&#9658;</span>
              )}
            </span>
            <span className="audio-label">
              {isPlayingAudio ? "4.0L V8 ACTIVE // MUTE" : "LISTEN: V8 COLD START"}
            </span>
          </button>

          <div className="hud-metric-row">
            <span className="hud-mono-dim">FRAME BUFFER:</span>
            <span ref={progressTextRef} className="hud-mono-val">
              00%
            </span>
          </div>
          <div className="hud-mono-sub">SYS.STAT: 60FPS // DPR 2.0 SYNC</div>
        </div>

        {/* Reticles & Corner Brackets */}
        <div className="hud-bracket hud-bracket-tl" />
        <div className="hud-bracket hud-bracket-tr" />
        <div className="hud-bracket hud-bracket-bl" />
        <div className="hud-bracket hud-bracket-br" />

        {/* Bottom-Left subtle branding */}
        <div className="hud-corner hud-bottom-left">
          <span className="hud-mono-dim">SPECIFICATION:</span>
          <span className="hud-mono-val">MERCEDES-AMG GLE 63 S</span>
        </div>

        {/* Bottom-Right verification stamp */}
        <div className="hud-corner hud-bottom-right">
          <span className="hud-mono-sub">BLAZE AUTOS SPECIAL VEHICLE OPERATIONS</span>
        </div>
      </div>

      {/* =========================================================================
          STAGE 01 (0% - 30%): AERO & POWERTRAIN
          Focus: Panamericana Grille, V8 Biturbo Thermodynamics
         ========================================================================= */}
      <div ref={stage1Ref} className="telemetry-stage telemetry-stage-1">
        <div className="telemetry-card">
          <div className="stage-tag">
            <span className="stage-index">STAGE 01</span>
            <span className="stage-divider">/</span>
            <span className="stage-name">THERMODYNAMICS & POWERTRAIN</span>
          </div>

          <h2 className="telemetry-headline">
            HANDCRAFTED <span className="accent-text">4.0L V8</span> BITURBO
          </h2>

          <p className="telemetry-desc">
            Affalterbach-assembled twin-scroll biturbo powerplant paired with 48V EQ Boost
            integrated starter-generator.
          </p>

          {/* High-Impact Interactive V8 Ignition Button */}
          <button
            type="button"
            className={`stage-audio-btn ${isPlayingAudio ? "is-active" : ""}`}
            onClick={toggleV8Audio}
            aria-label="Ignite 4.0L V8 Cold Start Audio"
          >
            <span className="stage-audio-pulse" />
            <span className="stage-audio-icon">
              {isPlayingAudio ? "■" : "▶"}
            </span>
            <span className="stage-audio-label">
              {isPlayingAudio ? "4.0L V8 ACTIVE // CLICK TO MUTE" : "IGNITE 4.0L V8 COLD START"}
            </span>
            {isPlayingAudio && (
              <span className="stage-audio-eq">
                <span className="eq-bar" />
                <span className="eq-bar" />
                <span className="eq-bar" />
                <span className="eq-bar" />
              </span>
            )}
          </button>

          <div className="telemetry-metrics-grid">
            <div className="metric-box">
              <div className="metric-val">
                603 <span className="metric-unit">HP</span>
              </div>
              <div className="metric-lbl">OUTPUT @ 6,500 RPM</div>
            </div>

            <div className="metric-box">
              <div className="metric-val">
                850 <span className="metric-unit">NM</span>
              </div>
              <div className="metric-lbl">PEAK TORQUE @ 2,500 RPM</div>
            </div>

            <div className="metric-box">
              <div className="metric-val">
                3.7 <span className="metric-unit">S</span>
              </div>
              <div className="metric-lbl">0–100 KM/H LAUNCH</div>
            </div>

            <div className="metric-box">
              <div className="metric-val">
                280 <span className="metric-unit">KM/H</span>
              </div>
              <div className="metric-lbl">MAX VELOCITY (GOVERNED)</div>
            </div>
          </div>

          <div className="telemetry-footer-bar">
            <span className="hud-mono-code">AERO COEFFICIENT: 0.32 CD</span>
            <span className="hud-mono-code">VARIABLE 4MATIC+ ALL-WHEEL DRIVE</span>
          </div>
        </div>
      </div>

      {/* =========================================================================
          STAGE 02 (33% - 68%): COCKPIT & ACOUSTIC ARCHITECTURE
          Focus: MBUX Dual Retinas, Burmester 3D, Nappa & Carbon Craft
         ========================================================================= */}
      <div ref={stage2Ref} className="telemetry-stage telemetry-stage-2">
        <div className="telemetry-card">
          <div className="stage-tag">
            <span className="stage-index">STAGE 02</span>
            <span className="stage-divider">/</span>
            <span className="stage-name">CABIN & ACOUSTIC ARCHITECTURE</span>
          </div>

          <h2 className="telemetry-headline">
            INTELLIGENT <span className="accent-text">COCKPIT</span> MATRIX
          </h2>

          <p className="telemetry-desc">
            Twin 12.3-inch floating digital retinas with custom AMG performance telemetry,
            wrapped in hand-stitched Exclusive Nappa leather and open-pore carbon fibre.
          </p>

          <div className="telemetry-spec-list">
            <div className="spec-item">
              <div className="spec-indicator" />
              <div className="spec-text">
                <span className="spec-strong">BURMESTER® HIGH-END 3D:</span>
                <span className="spec-sub">1,450W output, 25 amplified speakers with 3D ceiling tweeters</span>
              </div>
            </div>

            <div className="spec-item">
              <div className="spec-indicator" />
              <div className="spec-text">
                <span className="spec-strong">AMG RIDE CONTROL+:</span>
                <span className="spec-sub">Multi-chamber air suspension with continuous 100Hz adaptive damping</span>
              </div>
            </div>

            <div className="spec-item">
              <div className="spec-indicator" />
              <div className="spec-text">
                <span className="spec-strong">AMG PERFORMANCE STEERING:</span>
                <span className="spec-sub">DINAMICA microfiber with integrated color LCD drive-unit dials</span>
              </div>
            </div>
          </div>

          <div className="telemetry-footer-bar">
            <span className="hud-mono-code">ENCRYPTED TELEMATICS ONLINE</span>
            <span className="hud-mono-code">INTERIOR NOISE: 64 DBA @ 120 KM/H</span>
          </div>
        </div>
      </div>

      {/* =========================================================================
          STAGE 03 (72% - 100%): BESPOKE ALLOCATION & VIEWING CTA
          Focus: Final Machine Pose, Private Commissioning Call to Action
         ========================================================================= */}
      <div ref={stage3Ref} className="telemetry-stage telemetry-stage-3">
        <div className="telemetry-card telemetry-card-cta">
          <div className="stage-tag">
            <span className="stage-index">STAGE 03</span>
            <span className="stage-divider">/</span>
            <span className="stage-name">BESPOKE ALLOCATION VERIFIED</span>
          </div>

          <h2 className="telemetry-headline cta-headline">
            ONE OF ONE <span className="accent-text">SPECIFICATION</span>
          </h2>

          <p className="telemetry-desc">
            Chassis W167-AMG-63S verified by Blaze Autos Private Collection. Complete digital
            service registry, factory delivery packaging, and unlisted provenance.
          </p>

          {/* Action Button Row */}
          <div className="cta-button-group">
            <button
              type="button"
              className="hud-btn-primary"
              onClick={() => setIsViewingModalOpen(true)}
            >
              REQUEST PRIVATE VIEWING
            </button>

            <button
              type="button"
              className="hud-btn-secondary"
              onClick={() => setIsSpecModalOpen(true)}
            >
              VIEW BUILD SHEET
            </button>
          </div>

          <div className="telemetry-footer-bar">
            <span className="hud-mono-code">ALLOCATION STATUS: AVAILABLE</span>
            <span className="hud-mono-code">WHITE-GLOVE LOGISTICS WORLDWIDE</span>
          </div>
        </div>
      </div>

      {/* =========================================================================
          MODAL 1: PRIVATE VIEWING APPOINTMENT
         ========================================================================= */}
      {isViewingModalOpen && (
        <div className="hud-modal-backdrop" onClick={() => setIsViewingModalOpen(false)}>
          <div
            className="hud-modal-dialog"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="modal-header">
              <div className="stage-tag">
                <span className="stage-index">VIP ALLOCATION</span>
                <span className="stage-divider">/</span>
                <span className="stage-name">BLAZE AUTOS CONCIERGE</span>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setIsViewingModalOpen(false)}
                aria-label="Close modal"
              >
                &times;
              </button>
            </div>

            <h3 className="modal-title">
              REQUEST PRIVATE <span className="accent-text">VIEWING</span>
            </h3>
            <p className="modal-subtitle">
              Mercedes-AMG GLE 63 S Coupe &middot; Private Collection Viewing Room or Direct Airfield Delivery
            </p>

            {isSubmitted ? (
              <div className="modal-success-box">
                <div className="success-icon">&#10003;</div>
                <div className="success-title">INQUIRY ENCRYPTED & TRANSMITTED</div>
                <p className="success-desc">
                  A Blaze Autos Senior Client Director will contact you via private channel within 2 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitInquiry} className="modal-form">
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">FULL NAME</label>
                    <input
                      required
                      type="text"
                      className="form-input"
                      placeholder="e.g. Marcus Vance"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">TELEPHONE / SIGNAL</label>
                    <input
                      required
                      type="tel"
                      className="form-input"
                      placeholder="+1 (555) 019-2834"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">CLIENT EMAIL</label>
                  <input
                    required
                    type="email"
                    className="form-input"
                    placeholder="client@executive.com"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">VIEWING LOCATION PREFERENCE</label>
                  <select className="form-input form-select" defaultValue="studio">
                    <option value="studio">Blaze Autos Private Studio (VIP Lounge)</option>
                    <option value="airfield">Private Airfield / FBO Direct Delivery</option>
                    <option value="residence">Private Residence Viewing (Confidential)</option>
                  </select>
                </div>

                <div className="modal-actions">
                  <button type="submit" className="hud-btn-primary full-width">
                    TRANSMIT SECURE INQUIRY
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: TECHNICAL BUILD SHEET INSPECTION
         ========================================================================= */}
      {isSpecModalOpen && (
        <div className="hud-modal-backdrop" onClick={() => setIsSpecModalOpen(false)}>
          <div
            className="hud-modal-dialog spec-sheet-dialog"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="modal-header">
              <div className="stage-tag">
                <span className="stage-index">FACTORY RECORD</span>
                <span className="stage-divider">/</span>
                <span className="stage-name">AFFALTERBACH BUILD RECORD</span>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setIsSpecModalOpen(false)}
                aria-label="Close modal"
              >
                &times;
              </button>
            </div>

            <h3 className="modal-title">
              TECHNICAL <span className="accent-text">BUILD SHEET</span>
            </h3>

            <div className="spec-table-container">
              <table className="spec-table">
                <tbody>
                  <tr>
                    <td>MODEL CODE</td>
                    <td>Mercedes-AMG GLE 63 S 4MATIC+ Coupe</td>
                  </tr>
                  <tr>
                    <td>ENGINE IDENTIFIER</td>
                    <td>M177 4.0L 90° V8 Direct Injection BiTurbo</td>
                  </tr>
                  <tr>
                    <td>HORSEPOWER</td>
                    <td>603 hp @ 5,750 – 6,500 rpm (+21 hp EQ Boost)</td>
                  </tr>
                  <tr>
                    <td>TORQUE</td>
                    <td>850 Nm (627 lb-ft) @ 2,500 – 4,500 rpm</td>
                  </tr>
                  <tr>
                    <td>TRANSMISSION</td>
                    <td>AMG SPEEDSHIFT TCT 9-Speed Multi-Clutch</td>
                  </tr>
                  <tr>
                    <td>DRIVETRAIN</td>
                    <td>AMG Performance 4MATIC+ Fully Variable AWD</td>
                  </tr>
                  <tr>
                    <td>SUSPENSION</td>
                    <td>AMG RIDE CONTROL+ Adaptive Air with ACTIVE RIDE CONTROL</td>
                  </tr>
                  <tr>
                    <td>BRAKE HARDWARE</td>
                    <td>420mm Ventilated & Perforated Front Discs with 6-Piston Calipers</td>
                  </tr>
                  <tr>
                    <td>EXHAUST SYSTEM</td>
                    <td>AMG Performance Dual Twin-Pipe Switchable Valved Exhaust</td>
                  </tr>
                  <tr>
                    <td>INTERIOR SPEC</td>
                    <td>Exclusive Style Black Nappa Leather with AMG Carbon Structure</td>
                  </tr>
                  <tr>
                    <td>AUDIO MATRIX</td>
                    <td>Burmester® High-End 3D Surround Sound (1,450W, 25 Transducers)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="modal-actions">
              <button
                type="button"
                className="hud-btn-primary"
                onClick={() => {
                  setIsSpecModalOpen(false);
                  setIsViewingModalOpen(true);
                }}
              >
                PROCEED TO PRIVATE VIEWING INQUIRY
              </button>
              <button
                type="button"
                className="hud-btn-secondary"
                onClick={() => setIsSpecModalOpen(false)}
              >
                DISMISS
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


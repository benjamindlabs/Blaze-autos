"use client";

import React, { useState, useEffect } from "react";

export interface OpenViewingOptions {
  title?: string;
  vehicle?: string;
  subtitle?: string;
}

export function openPrivateViewing(options?: OpenViewingOptions) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("open-private-viewing", {
        detail: options || {},
      })
    );
  }
}

export default function PrivateViewingModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [modalDetails, setModalDetails] = useState<OpenViewingOptions>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const handleOpen = (e: Event) => {
      const customEvent = e as CustomEvent<OpenViewingOptions>;
      setModalDetails(customEvent.detail || {});
      setIsSubmitted(false);
      setIsOpen(true);
    };

    window.addEventListener("open-private-viewing", handleOpen);
    return () => {
      window.removeEventListener("open-private-viewing", handleOpen);
    };
  }, []);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsSubmitted(false);
    }, 3200);
  };

  if (!isOpen) return null;

  const displayTitle = modalDetails.title || "REQUEST PRIVATE VIEWING";
  const displaySubtitle =
    modalDetails.subtitle ||
    (modalDetails.vehicle
      ? `${modalDetails.vehicle} · Private Collection Viewing Room or Direct Airfield Delivery`
      : "Bespoke Collection Viewing & Private Test Drive · Mayfair, DIFC, or Direct Airfield Delivery");

  return (
    <div
      className="hud-modal-backdrop"
      onClick={() => setIsOpen(false)}
      role="dialog"
      aria-modal="true"
    >
      <div className="hud-modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="stage-tag">
            <span className="stage-index">VIP ALLOCATION</span>
            <span className="stage-divider">/</span>
            <span className="stage-name">BLAZE AUTOS CONCIERGE</span>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={() => setIsOpen(false)}
            aria-label="Close modal"
          >
            &times;
          </button>
        </div>

        <h3 className="modal-title">
          {displayTitle.includes("TEST DRIVE") ? (
            <>
              BOOK A TEST <span className="accent-text">DRIVE</span>
            </>
          ) : (
            <>
              REQUEST PRIVATE <span className="accent-text">VIEWING</span>
            </>
          )}
        </h3>
        <p className="modal-subtitle">{displaySubtitle}</p>

        {isSubmitted ? (
          <div className="modal-success-box">
            <div className="success-icon">&#10003;</div>
            <div className="success-title">INQUIRY ENCRYPTED & TRANSMITTED</div>
            <p className="success-desc">
              A Blaze Autos Senior Client Director will contact you via private channel within 2 hours.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="modal-form">
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
              <label className="form-label">PREFERENCE / LOCATION</label>
              <select className="form-input form-select" defaultValue="test-drive-studio">
                <option value="test-drive-studio">
                  Bespoke Test Drive & Studio Session (VIP Lounge)
                </option>
                <option value="airfield">
                  Private Airfield / FBO Direct Runway Delivery
                </option>
                <option value="residence">
                  Confidential Residence Delivery & Viewing
                </option>
                <option value="consignment">
                  Private Collection Consignment Assessment
                </option>
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
  );
}


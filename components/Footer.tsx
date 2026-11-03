"use client";

import React, { useState } from "react";
import { scrollToSection } from "./SmoothScrollProvider";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubscribed(true);
    setTimeout(() => {
      setEmail("");
      setIsSubscribed(false);
    }, 3500);
  };

  return (
    <>
      {/* Part 04: Architectural Allocations Section */}
      <section
        id="allocations"
        className="allocations-glossy-section"
        aria-label="Global Allocations Statement"
      >
        {/* Specular Edge Highlights & Glass Texture */}
        <div className="glossy-specular-highlight" aria-hidden="true" />
        <div className="glossy-glass-texture" aria-hidden="true" />

        <div className="glossy-container">
          <div className="footer-hero-statement">
            <div className="footer-tag">
              <span className="footer-tag-index">04 // ALLOCATIONS</span>
              <span className="footer-tag-divider">/</span>
              <span className="footer-tag-text">GLOBAL ATELIER NETWORK</span>
            </div>
            <h2 className="footer-monolith-headline">
              DRIVEN BY <span className="accent-serif-italic">RARITY.</span>
              <br />
              DELIVERED WORLDWIDE.
            </h2>
            <p className="footer-monolith-sub">
              Private vehicle acquisitions, confidential consignment, and white-glove logistics
              spanning Europe, the Middle East, and the Americas.
            </p>

            {/* Minimalist Dispatch Coordinates & Allocation Status */}
            <div className="allocations-dispatch-bar">
              <span className="dispatch-badge">
                <span className="dispatch-dot" aria-hidden="true" />
                STATUS: ALLOCATIONS ACTIVE Q4
              </span>
              <span className="dispatch-divider">/</span>
              <span className="dispatch-coord">
                <span className="coord-city">MAYFAIR</span> 51.5098° N, 0.1444° W
              </span>
              <span className="dispatch-divider">/</span>
              <span className="dispatch-coord">
                <span className="coord-city">DIFC</span> 25.2048° N, 55.2708° E
              </span>
              <span className="dispatch-divider">/</span>
              <span className="dispatch-coord">
                <span className="coord-city">ZÜRICH</span> 47.3769° N, 8.5417° E
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Dark Luxury Editorial Footer */}
      <footer id="contact" className="editorial-footer" aria-label="Showroom Contact & Information">
        {/* Top Architectural Divider */}
        <div className="footer-top-rule" />

        <div className="footer-container">
          {/* 4-Column Architectural Information Grid */}
          <div className="footer-grid">
          {/* Column 1: Showroom Ateliers */}
          <div className="footer-col">
            <h3 className="footer-col-title">FLAGSHIP ATELIERS</h3>
            <div className="footer-entry">
              <span className="footer-entry-city">LONDON &middot; MAYFAIR</span>
              <p className="footer-entry-text">
                14 Albemarle Street, Mayfair
                <br />
                London W1S 4PH, United Kingdom
              </p>
              <span className="footer-entry-code">T: +44 20 7946 0912</span>
            </div>

            <div className="footer-entry">
              <span className="footer-entry-city">DUBAI &middot; DIFC</span>
              <p className="footer-entry-text">
                Gate Village, Building 03
                <br />
                DIFC, Dubai, United Arab Emirates
              </p>
              <span className="footer-entry-code">T: +971 4 362 7000</span>
            </div>
          </div>

          {/* Column 2: VIP Client Concierge */}
          <div className="footer-col">
            <h3 className="footer-col-title">CLIENT CONCIERGE</h3>
            <div className="footer-entry">
              <span className="footer-entry-label">DIRECT ENCRYPTED LINE</span>
              <a href="tel:+442079460912" className="footer-link-highlight">
                +44 20 7946 0912
              </a>
            </div>

            <div className="footer-entry">
              <span className="footer-entry-label">SIGNAL / WHATSAPP VIP</span>
              <span className="footer-entry-code">+44 7700 900821 [SECURE]</span>
            </div>

            <div className="footer-entry">
              <span className="footer-entry-label">CONFIDENTIAL EMAIL</span>
              <a href="mailto:concierge@blazeautos.com" className="footer-link">
                concierge@blazeautos.com
              </a>
            </div>

            <div className="footer-entry">
              <span className="footer-entry-label">OPERATING PROTOCOL</span>
              <span className="footer-entry-dim">
                MON – SAT &middot; 09:00 – 19:00 GMT
                <br />
                STRICTLY BY APPOINTMENT
              </span>
            </div>
          </div>

          {/* Column 3: Services & Logistics */}
          <div className="footer-col">
            <h3 className="footer-col-title">SPECIAL OPERATIONS</h3>
            <ul className="footer-services-list">
              <li>
                <span className="service-bullet" />
                <span>Enclosed Climate Airfreight Worldwide</span>
              </li>
              <li>
                <span className="service-bullet" />
                <span>Escrow & Title Security Verification</span>
              </li>
              <li>
                <span className="service-bullet" />
                <span>Off-Market Allocation Build Slots</span>
              </li>
              <li>
                <span className="service-bullet" />
                <span>Biometric De-Humidified Vault Storage</span>
              </li>
              <li>
                <span className="service-bullet" />
                <span>Factory Certified Provenance Audit</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Private Allocation Registry & Test Drive Inquiry Form */}
          <div className="footer-col" id="test-drive">
            <h3 className="footer-col-title">BOOK A TEST DRIVE & REGISTRY</h3>
            <p className="footer-registry-desc">
              Request a private driving appointment, bespoke collection viewing, or receive confidential off-market allocations.
            </p>

            {isSubscribed ? (
              <div className="registry-success-box">
                <span className="registry-success-dot">&#10003;</span>
                <span className="registry-success-title">INQUIRY TRANSMITTED</span>
                <p className="registry-success-text">
                  Your test drive & client credentials have been logged with our Private Client Director.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="footer-registry-form">
                <div className="registry-input-group">
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ENTER CLIENT EMAIL"
                    className="registry-input"
                    aria-label="Enter your email to book a test drive or join the Private Registry"
                  />
                  <button type="submit" className="registry-btn">
                    REQUEST
                  </button>
                </div>
                <span className="registry-disclaimer">
                  ENCRYPTED TRANSMISSION &middot; BESPOKE TEST DRIVE &middot; CONFIDENTIAL DISPATCH
                </span>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Sub-footer Bar */}
        <div className="footer-sub-bar">
          <div className="footer-sub-left">
            <span className="footer-brand-mark">BLAZE AUTOS</span>
            <span className="footer-copyright">
              &copy; {new Date().getFullYear()} BLAZE AUTOS GROUP LTD. ALL RIGHTS RESERVED.
            </span>
          </div>

          <div className="footer-sub-links">
            <a
              href="#collection"
              className="footer-sub-link"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("collection");
              }}
            >
              INVENTORY
            </a>
            <a
              href="#heritage"
              className="footer-sub-link"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("heritage");
              }}
            >
              HERITAGE
            </a>
            <a
              href="#contact"
              className="footer-sub-link"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("contact");
              }}
            >
              CONCIERGE
            </a>
            <span className="footer-sub-dim">51.5098° N, -0.1415° W</span>
          </div>
        </div>
      </div>
      </footer>
    </>
  );
}


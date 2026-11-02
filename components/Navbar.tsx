"use client";

import React from "react";

export default function Navbar() {
  return (
    <header className="editorial-navbar">
      {/* Left: Brand */}
      <a href="#" className="nav-brand">
        BLAZE AUTOS
      </a>

      {/* Right: Nav Links & CTA */}
      <div className="nav-right">
        <div className="nav-links">
          <a href="#inventory" className="nav-link">
            INVENTORY
          </a>
          <a href="#heritage" className="nav-link">
            HERITAGE
          </a>
          <a href="#contact" className="nav-link">
            CONTACT
          </a>
        </div>

        <button type="button" className="nav-btn">
          BOOK A TEST DRIVE
        </button>
      </div>
    </header>
  );
}

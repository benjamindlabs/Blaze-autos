"use client";

import React from "react";
import { scrollToSection } from "./SmoothScrollProvider";
import { openPrivateViewing } from "./PrivateViewingModal";

export default function Navbar() {
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    scrollToSection(targetId);
  };

  const handleTestDriveClick = (e: React.MouseEvent) => {
    e.preventDefault();
    openPrivateViewing({
      title: "BOOK A TEST DRIVE",
      vehicle: "BESPOKE PRIVATE TEST DRIVE",
      subtitle: "Private Driving Experience & Viewing Room · Mayfair, DIFC, or Direct Airfield Delivery",
    });
  };

  return (
    <header className="editorial-navbar">
      {/* Left: Brand */}
      <a
        href="#"
        className="nav-brand"
        onClick={(e) => handleNavClick(e, "top")}
      >
        BLAZE AUTOS
      </a>

      {/* Right: Nav Links & CTA */}
      <div className="nav-right">
        <div className="nav-links">
          <a
            href="#collection"
            className="nav-link"
            onClick={(e) => handleNavClick(e, "collection")}
          >
            INVENTORY
          </a>
          <a
            href="#heritage"
            className="nav-link"
            onClick={(e) => handleNavClick(e, "heritage")}
          >
            HERITAGE
          </a>
          <a
            href="#contact"
            className="nav-link"
            onClick={(e) => handleNavClick(e, "contact")}
          >
            CONTACT
          </a>
        </div>

        <button
          type="button"
          className="nav-btn"
          onClick={handleTestDriveClick}
        >
          BOOK A TEST DRIVE
        </button>
      </div>
    </header>
  );
}

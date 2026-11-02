"use client";

import React from "react";

interface BrandItem {
  id: string;
  name: string;
  color: string;
  glowColor: string;
  icon: React.ReactNode;
}

const TOP_ROW_BRANDS: BrandItem[] = [
  {
    id: "range-rover",
    name: "RANGE ROVER",
    color: "#005A2B",
    glowColor: "rgba(0, 90, 43, 0.45)",
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#005A2B"
        strokeWidth="1.8"
        aria-hidden="true"
      >
        <rect x="2" y="6" width="20" height="12" rx="3" />
        <line x1="2" y1="12" x2="22" y2="12" strokeDasharray="2 2" />
        <path d="M6 9h12M8 15h8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "lexus",
    name: "LEXUS",
    color: "#D3D3D3",
    glowColor: "rgba(211, 211, 211, 0.35)",
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#D3D3D3"
        strokeWidth="2"
        aria-hidden="true"
      >
        <ellipse cx="12" cy="12" rx="10" ry="8" />
        <path
          d="M8 8v7.5h8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8 15.5L16 8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    id: "lamborghini",
    name: "LAMBORGHINI",
    color: "#D4AF37",
    glowColor: "rgba(212, 175, 55, 0.4)",
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#D4AF37"
        strokeWidth="1.8"
        aria-hidden="true"
      >
        <path
          d="M12 2L4 5.5v5.5c0 5.5 3.5 9.5 8 11 4.5-1.5 8-5.5 8-11V5.5L12 2z"
          fill="#D4AF37"
          fillOpacity="0.15"
        />
        <path
          d="M8.5 13.5L12 7.5l3.5 6-3.5-2-3.5 2z"
          fill="#D4AF37"
        />
      </svg>
    ),
  },
  {
    id: "mercedes-benz",
    name: "MERCEDES-BENZ",
    color: "#C0C0C0",
    glowColor: "rgba(192, 192, 192, 0.35)",
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#C0C0C0"
        strokeWidth="1.8"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="9.5" />
        <line x1="12" y1="12" x2="12" y2="2.5" />
        <line x1="12" y1="12" x2="3.8" y2="16.8" />
        <line x1="12" y1="12" x2="20.2" y2="16.8" />
      </svg>
    ),
  },
  {
    id: "bmw",
    name: "BMW",
    color: "#0066B1",
    glowColor: "rgba(0, 102, 177, 0.4)",
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#0066B1"
        strokeWidth="1.8"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="9.5" />
        <circle cx="12" cy="12" r="6" />
        <line x1="12" y1="6" x2="12" y2="18" />
        <line x1="6" y1="12" x2="18" y2="12" />
        <path
          d="M12 6 A6 6 0 0 1 18 12 L12 12 Z"
          fill="#0066B1"
          fillOpacity="0.5"
        />
        <path
          d="M6 12 A6 6 0 0 1 12 18 L12 12 Z"
          fill="#0066B1"
          fillOpacity="0.5"
        />
      </svg>
    ),
  },
  {
    id: "toyota",
    name: "TOYOTA",
    color: "#EB0A1E",
    glowColor: "rgba(235, 10, 30, 0.4)",
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#EB0A1E"
        strokeWidth="1.8"
        aria-hidden="true"
      >
        <ellipse cx="12" cy="12" rx="10" ry="7.2" />
        <ellipse cx="12" cy="12" rx="3.8" ry="7.2" />
        <ellipse cx="12" cy="9.2" rx="6.5" ry="3.2" />
      </svg>
    ),
  },
];

const BOTTOM_ROW_BRANDS: BrandItem[] = [
  {
    id: "jaguar",
    name: "JAGUAR",
    color: "#005A2B",
    glowColor: "rgba(0, 90, 43, 0.45)",
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#005A2B"
        strokeWidth="1.8"
        aria-hidden="true"
      >
        <path
          d="M3 14c2.5-2.2 6-3 9.5-3s7 .8 9.5 3"
          strokeLinecap="round"
        />
        <path
          d="M5 10c2-1.8 4.5-2.5 7-2.5s5 .7 7 2.5"
          strokeLinecap="round"
        />
        <circle cx="12" cy="12" r="9.5" />
      </svg>
    ),
  },
  {
    id: "porsche",
    name: "PORSCHE",
    color: "#B12B28",
    glowColor: "rgba(177, 43, 40, 0.4)",
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#B12B28"
        strokeWidth="1.8"
        aria-hidden="true"
      >
        <path
          d="M12 2L5 5v6c0 5.5 3.5 10 7 11 3.5-1 7-5.5 7-11V5l-7-3z"
          fill="#B12B28"
          fillOpacity="0.2"
        />
        <line x1="12" y1="5" x2="12" y2="18" />
        <line x1="6" y1="10" x2="18" y2="10" />
        <circle cx="12" cy="11.5" r="2.2" fill="#B12B28" />
      </svg>
    ),
  },
  {
    id: "nissan",
    name: "NISSAN",
    color: "#A8A8A8",
    glowColor: "rgba(168, 168, 168, 0.35)",
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#A8A8A8"
        strokeWidth="1.8"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="9" />
        <rect
          x="2"
          y="9.5"
          width="20"
          height="5"
          fill="#121212"
          stroke="#A8A8A8"
          strokeWidth="1.6"
          rx="1"
        />
      </svg>
    ),
  },
  {
    id: "audi",
    name: "AUDI",
    color: "#F50537",
    glowColor: "rgba(245, 5, 55, 0.4)",
    icon: (
      <svg
        width="26"
        height="18"
        viewBox="0 0 28 20"
        fill="none"
        stroke="#F50537"
        strokeWidth="1.8"
        aria-hidden="true"
      >
        <circle cx="6.5" cy="10" r="4.2" />
        <circle cx="11.5" cy="10" r="4.2" />
        <circle cx="16.5" cy="10" r="4.2" />
        <circle cx="21.5" cy="10" r="4.2" />
      </svg>
    ),
  },
  {
    id: "ford",
    name: "FORD",
    color: "#1858A8",
    glowColor: "rgba(24, 88, 168, 0.4)",
    icon: (
      <svg
        width="24"
        height="18"
        viewBox="0 0 26 20"
        fill="none"
        stroke="#1858A8"
        strokeWidth="1.8"
        aria-hidden="true"
      >
        <ellipse cx="13" cy="10" rx="11" ry="7" />
        <path
          d="M8.5 13.5L11.5 6.5h5M10 10.5h4"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    id: "rolls-royce",
    name: "ROLLS-ROYCE",
    color: "#8B2232",
    glowColor: "rgba(139, 34, 50, 0.4)",
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#8B2232"
        strokeWidth="1.8"
        aria-hidden="true"
      >
        <rect x="4" y="3" width="16" height="18" rx="2" />
        <path
          d="M8 8h3.8a2 2 0 0 1 2 2v0a2 2 0 0 1-2 2H8V8zm3.8 4l2.8 4M8 12h5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    id: "tesla",
    name: "TESLA",
    color: "#E82127",
    glowColor: "rgba(232, 33, 39, 0.4)",
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="#E82127"
        aria-hidden="true"
      >
        <path d="M12 6.5c2.8 0 5.4.8 7.5 2.2l.5-1.5C17.5 5.7 14.8 5 12 5s-5.5.7-8 2.2l.5 1.5c2.1-1.4 4.7-2.2 7.5-2.2z" />
        <path d="M11 9.2h2V19h-2z" />
        <path d="M10 8.6h4l.5 2.2h-5z" />
      </svg>
    ),
  },
];

export default function LogoMarquee() {
  // Multiply arrays by 4 for mathematically seamless infinite loop on any screen width
  const topSequence = [
    ...TOP_ROW_BRANDS,
    ...TOP_ROW_BRANDS,
    ...TOP_ROW_BRANDS,
    ...TOP_ROW_BRANDS,
  ];
  const bottomSequence = [
    ...BOTTOM_ROW_BRANDS,
    ...BOTTOM_ROW_BRANDS,
    ...BOTTOM_ROW_BRANDS,
    ...BOTTOM_ROW_BRANDS,
  ];

  return (
    <section
      className="marquee-section"
      aria-label="Automotive Brand Partnerships"
    >
      {/* Small Header Above Logos */}
      <div className="marquee-section-header">
        <p className="marquee-header-tag">
          TRUSTED BY THE WORLD&apos;S FINEST
        </p>
      </div>

      {/* Marquee Container with Left and Right Edge Fade Mask */}
      <div className="marquee-track-wrapper marquee-mask">
        {/* Row 1: Moves Right to Left */}
        <div className="marquee-row-left">
          {topSequence.map((brand, idx) => (
            <div
              key={`top-${brand.id}-${idx}`}
              className="brand-marquee-card"
              style={
                {
                  "--brand-color": brand.color,
                  "--brand-glow": brand.glowColor,
                } as React.CSSProperties
              }
            >
              <div className="brand-card-icon">
                {brand.icon}
              </div>
              <span
                className="brand-card-name"
                style={{ color: brand.color }}
              >
                {brand.name}
              </span>
            </div>
          ))}
        </div>

        {/* Row 2: Moves Left to Right */}
        <div className="marquee-row-right">
          {bottomSequence.map((brand, idx) => (
            <div
              key={`bottom-${brand.id}-${idx}`}
              className="brand-marquee-card"
              style={
                {
                  "--brand-color": brand.color,
                  "--brand-glow": brand.glowColor,
                } as React.CSSProperties
              }
            >
              <div className="brand-card-icon">
                {brand.icon}
              </div>
              <span
                className="brand-card-name"
                style={{ color: brand.color }}
              >
                {brand.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

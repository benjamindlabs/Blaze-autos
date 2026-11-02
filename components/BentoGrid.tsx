"use client";

/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect, useCallback } from "react";

export type CarCategory = "HYPERCAR" | "PERFORMANCE SUV" | "TRACK SPEC";

export interface CarItem {
  id: string;
  cardIndex: number;
  category: CarCategory;
  makeModel: string;
  serifSubtext: string;
  tag: string;
  meta: string;
  image: string;
  specs: string[];
  engine: string;
  power: string;
  topSpeed: string;
  acceleration: string;
}

interface RawCarInventory {
  id: string;
  filename: string;
  category: CarCategory;
  serifSubtext?: string;
  tag?: string;
  meta?: string;
  engine?: string;
  power?: string;
  topSpeed?: string;
  acceleration?: string;
  additionalImages?: string[];
}

const RAW_INVENTORY: RawCarInventory[] = [
  {
    id: "lamborghini-revuelto",
    filename: "lamborghini-revuelto.png",
    category: "HYPERCAR",
    serifSubtext: "CURATED INVENTORY",
    tag: "FLAGSHIP ALLOCATION",
    meta: "SERIES 01 // V12 HYBRID",
    engine: "6.5L Naturally Aspirated V12 + 3 E-Motors",
    power: "1,001 BHP @ 9,250 RPM",
    topSpeed: "350+ KM/H",
    acceleration: "0-100 KM/H 2.5S",
    additionalImages: [
      "/bento-images/lamborghini-revuelto-1.jpg",
      "/bento-images/lamborghini-revuelto-2.jpg",
      "/bento-images/lamborghini-revuelto-3.jpg",
    ],
  },
  {
    id: "range-rover-sv",
    filename: "range-rover-sv.jpg",
    category: "PERFORMANCE SUV",
    serifSubtext: "AVAILABLE NOW",
    tag: "BRITISH LUXURY",
    meta: "SPECIAL VEHICLE // V8",
    engine: "4.4L Twin-Turbocharged V8",
    power: "606 BHP @ 6,000 RPM",
    topSpeed: "261 KM/H",
    acceleration: "0-100 KM/H 4.3S",
    additionalImages: [
      "/bento-images/range-rover-sv-1.jpg",
      "/bento-images/range-rover-sv-2.jpg",
      "/bento-images/range-rover-sv-3.jpg",
    ],
  },
  {
    id: "mercedes-amg-g63",
    filename: "mercedes-amg-g63.jpg",
    category: "PERFORMANCE SUV",
    serifSubtext: "CURATED INVENTORY",
    tag: "AFFALTERBACH ICON",
    meta: "BITURBO V8 // AVAILABLE",
    engine: "4.0L Handcrafted BiTurbo V8",
    power: "577 BHP @ 6,000 RPM",
    topSpeed: "240 KM/H",
    acceleration: "0-100 KM/H 4.5S",
    additionalImages: [
      "/bento-images/mercedes-amg-g63-1.jpg",
      "/bento-images/mercedes-amg-g63-2.jpg",
      "/bento-images/mercedes-amg-g63-3.jpg",
    ],
  },
  {
    id: "lexus-lx700h",
    filename: "lexus-lx700h.jpg",
    category: "PERFORMANCE SUV",
    serifSubtext: "AVAILABLE NOW",
    tag: "EXECUTIVE HYBRID",
    meta: "FLAGSHIP // I-FORCE MAX",
    engine: "3.4L Twin-Turbo V6 Hybrid",
    power: "457 BHP @ 5,200 RPM",
    topSpeed: "210 KM/H",
    acceleration: "0-100 KM/H 6.1S",
    additionalImages: [
      "/bento-images/lexus-lx700h-1.jpg",
      "/bento-images/lexus-lx700h-2.jpg",
      "/bento-images/lexus-lx700h-3.jpg",
    ],
  },
  {
    id: "toyota-hilux-adventure",
    filename: "toyota-hilux-adventure.jpg",
    category: "PERFORMANCE SUV",
    serifSubtext: "CURATED INVENTORY",
    tag: "ALL-TERRAIN 4X4",
    meta: "ADVENTURE SPEC // AVAILABLE",
    engine: "4.0L V6 / 2.8L Turbo Diesel",
    power: "235 BHP @ 5,200 RPM",
    topSpeed: "180 KM/H",
    acceleration: "0-100 KM/H 9.0S",
    additionalImages: [
      "/bento-images/toyota-hilux-adventure-1.jpg",
      "/bento-images/toyota-hilux-adventure-2.jpg",
      "/bento-images/toyota-hilux-adventure-3.jpg",
    ],
  },
  {
    id: "toyota-corolla",
    filename: "toyota-corolla.jpg",
    category: "TRACK SPEC",
    serifSubtext: "AVAILABLE NOW",
    tag: "CURATED EDITION",
    meta: "DYNAMIC FORCE // HYBRID",
    engine: "2.0L Dynamic Force Hybrid",
    power: "196 BHP @ 6,000 RPM",
    topSpeed: "190 KM/H",
    acceleration: "0-100 KM/H 7.4S",
    additionalImages: [
      "/bento-images/toyota-corolla-1.jpg",
      "/bento-images/toyota-corolla-2.jpg",
      "/bento-images/toyota-corolla-3.jpg",
    ],
  },
];

const CARS_SHOWCASE: CarItem[] = RAW_INVENTORY.map((item, index) => {
  const mainImage = `/bento-images/${item.filename}`;

  // Extract car name from filename (e.g. "toyota-rav4.jpg" -> "TOYOTA RAV4")
  const makeModel = item.filename
    .replace(/\.[^/.]+$/, "")
    .split("-")
    .map((word) => word.toUpperCase())
    .join(" ");

  // Modal specs gallery: use additional images if available, otherwise duplicate main image
  const gallery =
    item.additionalImages && item.additionalImages.length > 0
      ? [mainImage, ...item.additionalImages]
      : [mainImage, mainImage, mainImage, mainImage];

  return {
    id: item.id,
    cardIndex: index + 1,
    category: item.category,
    makeModel,
    serifSubtext: item.serifSubtext || "CURATED INVENTORY",
    tag: item.tag || "EXCLUSIVE ALLOCATION",
    meta: item.meta || "AVAILABLE NOW",
    image: mainImage,
    specs: gallery,
    engine: item.engine || "HIGH PERFORMANCE POWERTRAIN",
    power: item.power || "COMMISSION ON REQUEST",
    topSpeed: item.topSpeed || "FACTORY SPEC",
    acceleration: item.acceleration || "IMMEDIATE COMMISSION",
  };
});

const FILTER_TABS = [
  { key: "ALL", label: "ALL" },
  { key: "HYPERCAR", label: "HYPERCAR" },
  { key: "PERFORMANCE SUV", label: "PERFORMANCE SUV" },
  { key: "TRACK SPEC", label: "TRACK SPEC" },
] as const;

export default function BentoGrid() {
  const [activeCategory, setActiveCategory] = useState<string>("ALL");
  const [selectedCar, setSelectedCar] = useState<CarItem | null>(null);
  const [activeImageIdx, setActiveImageIdx] = useState<number>(0);

  const openModal = (car: CarItem) => {
    setSelectedCar(car);
    setActiveImageIdx(0);
  };

  const closeModal = useCallback(() => {
    setSelectedCar(null);
    setActiveImageIdx(0);
  }, []);

  const nextImage = useCallback(() => {
    if (!selectedCar) return;
    setActiveImageIdx((prev) => (prev + 1) % selectedCar.specs.length);
  }, [selectedCar]);

  const prevImage = useCallback(() => {
    if (!selectedCar) return;
    setActiveImageIdx((prev) =>
      prev === 0 ? selectedCar.specs.length - 1 : prev - 1
    );
  }, [selectedCar]);

  // Lock body scroll and attach keyboard listeners when modal is open
  useEffect(() => {
    if (!selectedCar) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeModal();
      } else if (e.key === "ArrowRight") {
        nextImage();
      } else if (e.key === "ArrowLeft") {
        prevImage();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedCar, closeModal, nextImage, prevImage]);

  return (
    <section
      id="showcase"
      className="bento-section"
      aria-label="Automotive Bento Showcase"
    >
      {/* Section Header */}
      <div className="bento-header">
        <div>
          <span
            className="bento-card-tag"
            style={{ display: "block", marginBottom: "8px" }}
          >
            SHOWCASE ARCHITECTURE
          </span>
          <h2 className="bento-main-heading">THE COLLECTION</h2>
        </div>
        <p className="bento-header-desc">
          PRECISION ENGINEERING. CURATED PROVENANCE. UNCOMPROMISING RARITY.
        </p>
      </div>

      {/* Interactive Category Filter Bar */}
      <div className="bento-filter-container">
        <div
          className="bento-filter-bar"
          role="tablist"
          aria-label="Filter collection by category"
        >
          {FILTER_TABS.map((tab) => {
            const isActive = activeCategory === tab.key;
            const count =
              tab.key === "ALL"
                ? CARS_SHOWCASE.length
                : CARS_SHOWCASE.filter((c) => c.category === tab.key).length;
            return (
              <button
                key={tab.key}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={`bento-filter-tab ${isActive ? "is-active" : ""}`}
                onClick={() => setActiveCategory(tab.key)}
              >
                <span className="bento-tab-indicator" />
                <span className="bento-tab-label">{tab.label}</span>
                <span className="bento-tab-count">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Asymmetric Bento Grid: 6 Distinct Cars */}
      <div className="bento-grid-container">
        {CARS_SHOWCASE.map((car) => {
          const isLargeCard = car.cardIndex === 1;
          const isMatch =
            activeCategory === "ALL" || car.category === activeCategory;

          return (
            <div
              key={car.id}
              className={`bento-card bento-card-${car.cardIndex} ${
                isMatch ? "is-matching" : "is-dimmed"
              } group`}
              onClick={() => openModal(car)}
              role="button"
              tabIndex={0}
              aria-label={`View specs for ${car.makeModel}`}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  openModal(car);
                }
              }}
            >
              {/* Background Car Image */}
              <img
                src={car.image}
                alt={car.makeModel}
                className="bento-card-bg-img"
                loading="lazy"
                decoding="async"
              />

              {/* Brightened Gradient Overlay for optimal car visibility & text legibility */}
              <div
                className="bento-card-gradient-overlay bg-gradient-to-t from-black/80 via-black/20 to-transparent"
                aria-hidden="true"
              />

              {/* Blueprint Grid Pattern */}
              <div className="bento-grid-pattern" aria-hidden="true" />

              {/* Top Meta Header */}
              <div className="bento-card-header">
                <span className="bento-card-tag">{car.tag}</span>
                <span className="bento-meta-tag">{car.meta}</span>
              </div>

              {/* Main Typography Area */}
              <div className="bento-card-body">
                <span className="bento-card-subtitle-accent">
                  {car.serifSubtext}
                </span>
                <h3
                  className={
                    isLargeCard
                      ? "bento-card-title-lg"
                      : "bento-card-title-car"
                  }
                >
                  {car.makeModel}
                </h3>
              </div>

              {/* Bottom Action Button */}
              <div className="bento-card-footer">
                <button
                  type="button"
                  className="bento-btn-secondary"
                  onClick={(e) => {
                    e.stopPropagation();
                    openModal(car);
                  }}
                  aria-label={`Open specs gallery for ${car.makeModel}`}
                >
                  <span>VIEW SPECS</span>
                  <span className="bento-btn-arrow" aria-hidden="true">
                    →
                  </span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Brutalist Modal Gallery */}
      {selectedCar && (
        <div
          className="bento-modal-backdrop"
          onClick={closeModal}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-car-title"
        >
          <div
            className="bento-modal-dialog"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bento-modal-header">
              <div className="bento-modal-title-group">
                <div className="bento-modal-tag-row">
                  <span className="bento-card-tag">{selectedCar.tag}</span>
                  <span className="text-zinc-600 font-mono text-[10px]">
                    {"//"}
                  </span>
                  <span className="bento-meta-tag">{selectedCar.meta}</span>
                </div>
                <h2 id="modal-car-title" className="bento-modal-headline">
                  {selectedCar.makeModel}
                </h2>
                <span className="bento-card-subtitle-accent">
                  {selectedCar.serifSubtext}
                </span>
              </div>

              <button
                type="button"
                className="bento-modal-close-btn"
                onClick={closeModal}
                aria-label="Close vehicle specifications modal"
              >
                <span>CLOSE</span>
                <span aria-hidden="true">✕</span>
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="bento-modal-scroll-area">
              {/* Featured Main Image Showcase */}
              <div className="bento-modal-featured-container">
                <img
                  src={selectedCar.specs[activeImageIdx]}
                  alt={`${selectedCar.makeModel} - View ${activeImageIdx + 1}`}
                  className="bento-modal-featured-img"
                />

                {/* Left / Right Navigation Arrows */}
                <button
                  type="button"
                  className="bento-modal-nav-arrow prev"
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage();
                  }}
                  aria-label="Previous gallery image"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                </button>

                <button
                  type="button"
                  className="bento-modal-nav-arrow next"
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                  aria-label="Next gallery image"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>

                {/* Counter Tag */}
                <div className="bento-modal-counter">
                  {`0${activeImageIdx + 1} / 0${selectedCar.specs.length}`}
                </div>
              </div>

              {/* 4 Thumbnail Strip */}
              <div className="bento-modal-thumbs-grid">
                {selectedCar.specs.map((imgUrl, idx) => (
                  <button
                    key={`${selectedCar.id}-thumb-${idx}`}
                    type="button"
                    className={`bento-modal-thumb-btn ${
                      activeImageIdx === idx ? "active" : ""
                    }`}
                    onClick={() => setActiveImageIdx(idx)}
                    aria-label={`View photo ${idx + 1}`}
                  >
                    <img
                      src={imgUrl}
                      alt={`Thumbnail ${idx + 1}`}
                      className="bento-modal-thumb-img"
                    />
                  </button>
                ))}
              </div>

              {/* Technical Specifications Strip */}
              <div className="bento-modal-specs-strip">
                <div className="bento-modal-spec-block">
                  <span className="bento-modal-spec-label">POWERTRAIN</span>
                  <span className="bento-modal-spec-value">
                    {selectedCar.engine}
                  </span>
                </div>
                <div className="bento-modal-spec-block">
                  <span className="bento-modal-spec-label">OUTPUT</span>
                  <span className="bento-modal-spec-value">
                    {selectedCar.power}
                  </span>
                </div>
                <div className="bento-modal-spec-block">
                  <span className="bento-modal-spec-label">ACCELERATION</span>
                  <span className="bento-modal-spec-value">
                    {selectedCar.acceleration}
                  </span>
                </div>
                <div className="bento-modal-spec-block">
                  <span className="bento-modal-spec-label">TOP SPEED</span>
                  <span className="bento-modal-spec-value">
                    {selectedCar.topSpeed}
                  </span>
                </div>
              </div>

              {/* Bottom Action Footer */}
              <div className="bento-modal-actions">
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-[#C5A059] animate-pulse" />
                  <span className="text-[11px] font-mono tracking-widest text-zinc-400 uppercase">
                    CHASSIS AVAILABLE FOR IMMEDIATE COMMISSION
                  </span>
                </div>

                <a
                  href="#contact"
                  className="bento-btn-secondary"
                  onClick={closeModal}
                >
                  <span>INQUIRE ABOUT THIS VEHICLE</span>
                  <span className="bento-btn-arrow" aria-hidden="true">
                    →
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

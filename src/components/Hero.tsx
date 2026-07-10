import { useState } from "react";
import { Lens } from "./Lens";
import "./Hero.css";

interface HeroProps {
  showContent: boolean;
}

export function Hero({ showContent }: HeroProps) {
  const [hovering, setHovering] = useState(false);

  return (
    <div className="hero-container">
      {/* Banner Card at the top */}
      <div className={`hero-visual-card reveal-item reveal-scale ${showContent ? "animate-reveal delay-1" : ""
        }`}>
        <Lens hovering={hovering} setHovering={setHovering} lensSize={180} zoomFactor={1.5}>
          <img src="/hero.gif" alt="Hero Banner" className="hero-banner-image" fetchPriority="high" loading="eager" decoding="sync" />
        </Lens>
      </div>

      {/* Overlapping profile picture */}
      <div className={`hero-avatar-wrap reveal-item reveal-scale ${showContent ? "animate-reveal delay-2" : ""
        }`}>
        <img
          src="/profpic-animated.webp"
          alt="Ayan Biswas Profile"
          className="hero-avatar-image"
          fetchPriority="high"
          loading="eager"
          decoding="sync"
          onError={(e) => {
            e.currentTarget.src = "/profpic.jpg"; // fallback to static jpg if webp fails to load
          }}
        />
      </div>

      {/* Details Row (Name, Tagline, and Social Buttons aligned beside the avatar) */}
      <div className={`hero-details-row reveal-item ${showContent ? "animate-reveal delay-3" : ""
        }`}>
        <div className="hero-text-container">
          <h1 className="hero-main-title">I am Ayan</h1>
          <p className="hero-description">
            want sites that sell? i can help you with that
          </p>
        </div>

        <div className="hero-social-row">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hero-social-button"
            aria-label="GitHub"
          >
            <img src="/github.svg" alt="GitHub" />
          </a>
          <a
            href="https://x.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hero-social-button"
            aria-label="Twitter/X"
          >
            <img src="/twitter.svg" alt="Twitter" />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hero-social-button"
            aria-label="Instagram"
          >
            <img src="/instagram.png" alt="Instagram" />
          </a>
        </div>
      </div>


    </div>
  );
}

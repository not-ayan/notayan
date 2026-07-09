import { useEffect, useState, useRef } from "react";
import "./FAB.css";

export function FAB() {
  const [open, setOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleOpen = () => {
    setOpen((prev) => !prev);
  };

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleScrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setOpen(false);
  };

  // Close popover when clicking outside the FAB container
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  // Track window scroll coordinates
  useEffect(() => {
    const trackScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", trackScroll);

    return () => {
      window.removeEventListener("scroll", trackScroll);
    };
  }, []);

  return (
    <div className="fab-container" ref={menuRef}>
      {/* Scroll to Top Button */}
      <button
        className={`fab-btn scroll-top-btn ${scrollY > 200 ? "visible" : ""} ${open ? "menu-open" : ""}`}
        onClick={handleScrollToTop}
        aria-label="Scroll to top"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="fab-icon">
          <path d="M18 15l-6-6-6 6" />
        </svg>
      </button>

      {/* Main FAB Toggle Button */}
      <button
        className={`fab-btn main-fab-btn ${open ? "open" : ""}`}
        onClick={handleOpen}
        aria-label="Toggle menu"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="fab-icon toggle-icon">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </button>

      {/* Popover Menu Card */}
      {open && (
        <div className="fab-menu-card">
          <div className="fab-menu-header">
            <span className="menu-header-logo">av</span>
            <span className="menu-header-title">ayan biswas.</span>
          </div>

          <nav className="fab-menu-links">
            <a href="#home" onClick={(e) => handleScrollToSection(e, "home")} className="fab-menu-link">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="link-icon">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              <span>Home</span>
              <span className="link-arrow">→</span>
            </a>

            <a href="#about" onClick={(e) => handleScrollToSection(e, "about")} className="fab-menu-link">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="link-icon">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
              <span>About</span>
              <span className="link-arrow">→</span>
            </a>

            <a href="#projects" onClick={(e) => handleScrollToSection(e, "projects")} className="fab-menu-link">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="link-icon">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
              </svg>
              <span>Projects</span>
              <span className="link-arrow">→</span>
            </a>

            <a href="#skills" onClick={(e) => handleScrollToSection(e, "skills")} className="fab-menu-link">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="link-icon">
                <line x1="18" y1="20" x2="18" y2="10" />
                <line x1="12" y1="20" x2="12" y2="4" />
                <line x1="6" y1="20" x2="6" y2="14" />
              </svg>
              <span>Expertise</span>
              <span className="link-arrow">→</span>
            </a>

            <a href="#contact" onClick={(e) => handleScrollToSection(e, "contact")} className="fab-menu-link">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="link-icon">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              <span>Contact</span>
              <span className="link-arrow">→</span>
            </a>
          </nav>

          <div className="fab-menu-footer">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="footer-social-link">GitHub</a>
            <span className="footer-divider">•</span>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="footer-social-link">Instagram</a>
            <span className="footer-divider">•</span>
            <a href="mailto:ayan98542@gmail.com" className="footer-social-link">Email</a>
          </div>
        </div>
      )}
    </div>
  );
}

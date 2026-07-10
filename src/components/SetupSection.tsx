export function SetupSection() {
  return (
    <section className="setup-section" id="setup">
      <div className="setup-container">
        <div className="setup-header reveal-on-scroll reveal-left delay-1">
          <h2 className="setup-main-title">my setup.</h2>
          <p className="setup-philosophy">
            A carefully curated selection of gear and daily drivers that power my design and development workflows.
          </p>
        </div>

        <div className="setup-grid">
          {/* Monitor Card: Spans 7 Columns */}
          <div className="setup-card card-monitor span-7 reveal-on-scroll delay-2">
            <div className="setup-card-header">
              <span className="setup-tag">// DISPLAY</span>
              <div className="setup-icon-wrapper">
                <svg className="setup-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="2" y="3" width="20" height="13" rx="1.5" />
                  <path d="M12 16v5M8 21h8" />
                </svg>
              </div>
            </div>
            <div className="setup-card-body">
              <h3 className="setup-item-title">Acer 21.5" Monitor</h3>
              <div className="setup-specs">
                <span className="spec-tag">100Hz Refresh</span>
                <span className="spec-tag">99% sRGB Color</span>
                <span className="spec-tag">1ms Response</span>
              </div>
            </div>
          </div>

          {/* Keyboard Card: Spans 5 Columns */}
          <div className="setup-card card-keyboard span-5 reveal-on-scroll delay-3">
            <div className="setup-card-header">
              <span className="setup-tag">// INPUT</span>
              <div className="setup-icon-wrapper">
                <svg className="setup-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="2" y="6" width="20" height="12" rx="2" />
                  <path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M6 14h.01M18 14h.01M9 14h6" />
                </svg>
              </div>
            </div>
            <div className="setup-card-body">
              <h3 className="setup-item-title">Aula F75</h3>
              <div className="setup-specs">
                <span className="spec-tag">75% Form Factor</span>
                <span className="spec-tag">THOCC</span>
                <span className="spec-tag">Gasket Mounted</span>
              </div>
            </div>
          </div>

          {/* Tablet Card: Spans 4 Columns */}
          <div className="setup-card card-tablet span-4 reveal-on-scroll delay-2">
            <div className="setup-card-header">
              <span className="setup-tag">// TABLET</span>
              <div className="setup-icon-wrapper">
                <svg className="setup-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="4" y="2" width="16" height="20" rx="2" />
                  <circle cx="12" cy="20" r="0.5" fill="currentColor" />
                </svg>
              </div>
            </div>
            <div className="setup-card-body">
              <h3 className="setup-item-title">Motorola Pad 60 Neo 5G</h3>
              <div className="setup-specs">
                <span className="spec-tag">COC!!!!</span>
                <span className="spec-tag">Media & Notes</span>
              </div>
            </div>
          </div>

          {/* Phone Card: Spans 4 Columns */}
          <div className="setup-card card-phone span-4 reveal-on-scroll delay-3">
            <div className="setup-card-header">
              <span className="setup-tag">// PHONE</span>
              <div className="setup-icon-wrapper">
                <svg className="setup-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="5" y="2" width="14" height="20" rx="2" />
                  <path d="M12 18h.01" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
            </div>
            <div className="setup-card-body">
              <h3 className="setup-item-title">Motorola G54 5G</h3>
              <div className="setup-specs">
                <span className="spec-tag">Primary Driver</span>
                <span className="spec-tag">AxionAosp ftw</span>
              </div>
            </div>
          </div>

          {/* Mouse Card: Spans 4 Columns */}
          <div className="setup-card card-mouse span-4 reveal-on-scroll delay-4">
            <div className="setup-card-header">
              <span className="setup-tag">// MOUSE</span>
              <div className="setup-icon-wrapper">
                <svg className="setup-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 2C9.24 2 7 4.24 7 7v10c0 2.76 2.24 5 5 5s5-2.24 5-5V7c0-2.76-2.24-5-5-5z" />
                  <path d="M12 2v7M7 9h10" />
                </svg>
              </div>
            </div>
            <div className="setup-card-body">
              <h3 className="setup-item-title">Logitech G102</h3>
              <div className="setup-specs">
                <span className="spec-tag">8000 DPI Sensor</span>
                <span className="spec-tag">Lightsync RGB</span>
              </div>
            </div>
          </div>

          {/* IEM 1 Card: Spans 6 Columns */}
          <div className="setup-card card-iem-1 span-6 reveal-on-scroll delay-2">
            <div className="setup-card-header">
              <span className="setup-tag">// AUDIO / IEM</span>
              <div className="setup-icon-wrapper">
                <svg className="setup-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M3 14c0-4.97 4.03-9 9-9s9 4.03 9 9" />
                  <rect x="3" y="12" width="4" height="6" rx="1.5" />
                  <rect x="17" y="12" width="4" height="6" rx="1.5" />
                  <path d="M7 15h10M9 18h6" />
                </svg>
              </div>
            </div>
            <div className="setup-card-body">
              <h3 className="setup-item-title">7Hz x Crinacle Zero:2</h3>
              <div className="setup-specs">
                <span className="spec-tag">Audiocular C03 Cable</span>
                <span className="spec-tag">Tuned by Crinacle</span>
                <span className="spec-tag">10mm Dynamic Driver</span>
              </div>
            </div>
          </div>

          {/* IEM 2 Card: Spans 6 Columns */}
          <div className="setup-card card-iem-2 span-6 reveal-on-scroll delay-3">
            <div className="setup-card-header">
              <span className="setup-tag">// AUDIO / IEM</span>
              <div className="setup-icon-wrapper">
                <svg className="setup-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M3 14c0-4.97 4.03-9 9-9s9 4.03 9 9" />
                  <rect x="3" y="12" width="4" height="6" rx="1.5" />
                  <rect x="17" y="12" width="4" height="6" rx="1.5" />
                  <path d="M7 15h10M9 18h6" />
                </svg>
              </div>
            </div>
            <div className="setup-card-body">
              <h3 className="setup-item-title">GK Kunten</h3>
              <div className="setup-specs">
                <span className="spec-tag">10mm Super-Linear Driver</span>
                <span className="spec-tag">Wired IEM</span>
                <span className="spec-tag">V-Shaped Tuning</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

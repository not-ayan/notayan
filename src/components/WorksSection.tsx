import { useState } from 'react';

const PROJECTS = [
  {
    id: 1,
    title: 'Wallwidgy',
    logo: 'w',
    description: 'A wallpaper site made to feel premium while providing a curated collection of high quality wallpapers',
    tech: ['react', 'js', 'tailwind'],
    visitUrl: 'https://github.com',
    githubUrl: 'https://github.com',
    mockups: {
      back: {
        title: 'Explore Categories',
        items: [
          { name: 'Nature', gradient: 'linear-gradient(135deg, #1f4068, #162447)' },
          { name: 'Anime', gradient: 'linear-gradient(135deg, #F1A5A0, #4e1a3d)' },
          { name: 'Art', gradient: 'linear-gradient(135deg, #ffd369, #393e46)' }
        ]
      },
      middle: {
        gradient: 'linear-gradient(to top, #08060d, #cdc8c5)'
      },
      front: {
        title: 'Wallwidgy',
        walls: [
          'linear-gradient(to bottom, #30cfd0 0%, #330867 100%)',
          'linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%)',
          'linear-gradient(to top, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)',
          'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        ]
      }
    }
  },
  {
    id: 2,
    title: 'Axion OS',
    logo: 'a',
    description: 'A custom Android Open Source Project operating system focused on performance, battery life, and clean UI.',
    tech: ['android', 'cpp', 'java'],
    visitUrl: 'https://github.com',
    githubUrl: 'https://github.com',
    mockups: {
      back: {
        title: 'System Settings',
        items: [
          { name: 'Themes', gradient: 'linear-gradient(135deg, #0f2027, #203a43)' },
          { name: 'Battery', gradient: 'linear-gradient(135deg, #11998e, #38ef7d)' },
          { name: 'Gestures', gradient: 'linear-gradient(135deg, #8a2387, #e94057)' }
        ]
      },
      middle: {
        gradient: 'linear-gradient(135deg, #141e30, #243b55)'
      },
      front: {
        title: 'Axion OS',
        walls: [
          'linear-gradient(135deg, #0f2027, #203a43, #2c5364)',
          'linear-gradient(to right, #24243e, #300030, #f7797d)',
          'linear-gradient(135deg, #11998e, #38ef7d)',
          'linear-gradient(135deg, #7f00ff, #e100ff)'
        ]
      }
    }
  },
  {
    id: 3,
    title: 'Design Hub',
    logo: 'd',
    description: 'A platform connecting web designers and developers to share mockups, feedback, and assets.',
    tech: ['figma', 'react', 'css'],
    visitUrl: 'https://github.com',
    githubUrl: 'https://github.com',
    mockups: {
      back: {
        title: 'Community Feed',
        items: [
          { name: 'Hot UI', gradient: 'linear-gradient(135deg, #f857a6, #ff5858)' },
          { name: 'Feedback', gradient: 'linear-gradient(135deg, #4facfe, #00f2fe)' },
          { name: 'Assets', gradient: 'linear-gradient(135deg, #f12711, #f5af19)' }
        ]
      },
      middle: {
        gradient: 'linear-gradient(135deg, #000428, #004e92)'
      },
      front: {
        title: 'Design Hub',
        walls: [
          'linear-gradient(135deg, #ff0844 0%, #ffb199 100%)',
          'linear-gradient(to top, #30cfd0 0%, #330867 100%)',
          'linear-gradient(to top, #505285 0%, #585e92 12%, #65689f 25%, #7474b0 37%, #7e7ebb 50%, #8389c7 62%, #9798d5 75%, #a2a1dc 87%, #b5aeeb 100%)',
          'linear-gradient(-20deg, #b721ff 0%, #21d4fd 100%)'
        ]
      }
    }
  }
];

function TechIcon({ type }: { type: string }) {
  switch (type) {
    case 'react':
      return (
        <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="6" className="tech-svg">
          <ellipse cx="50" cy="50" rx="15" ry="40" transform="rotate(0 50 50)" />
          <ellipse cx="50" cy="50" rx="15" ry="40" transform="rotate(60 50 50)" />
          <ellipse cx="50" cy="50" rx="15" ry="40" transform="rotate(120 50 50)" />
          <circle cx="50" cy="50" r="6" fill="currentColor" />
        </svg>
      );
    case 'js':
      return (
        <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="6" className="tech-svg">
          <rect x="15" y="15" width="70" height="70" rx="10" />
          <path d="M45 65 c0 5 -4 9 -9 9 c-5 0 -9 -4 -9 -9 M65 45 v20 c0 5 -4 9 -9 9" strokeLinecap="round" />
        </svg>
      );
    case 'tailwind':
      return (
        <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="6" className="tech-svg">
          <path d="M25 45 C35 30 50 30 60 40 C70 50 80 50 90 40 C80 55 65 55 55 45 C45 35 35 35 25 45 Z" fill="currentColor" />
          <path d="M10 60 C20 45 35 45 45 55 C55 65 65 65 75 55 C65 70 50 70 40 60 C30 50 20 50 10 60 Z" fill="currentColor" />
        </svg>
      );
    case 'android':
      return (
        <svg viewBox="0 0 100 100" fill="currentColor" className="tech-svg">
          <path d="M50 20 c-12 0 -22 10 -22 22 h44 c0 -12 -10 -22 -22 -22 Z M20 48 h60 v15 c0 6 -5 11 -11 11 h-38 c-6 0 -11 -5 -11 -11 Z M35 12 l-4 6 M65 12 l4 6" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
        </svg>
      );
    case 'cpp':
      return (
        <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="6" className="tech-svg">
          <circle cx="50" cy="50" r="35" />
          <path d="M45 40 h15 M45 50 h15 M45 60 h15" strokeLinecap="round" />
        </svg>
      );
    case 'java':
      return (
        <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="6" className="tech-svg">
          <path d="M30 40 c0 15 5 25 20 25 c15 0 20 -10 20 -25 h-40 Z M65 40 c5 0 10 5 10 10 c0 5 -5 10 -10 10 M35 75 c5 -5 20 -5 25 0" strokeLinecap="round" />
        </svg>
      );
    case 'figma':
      return (
        <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="6" className="tech-svg">
          <circle cx="35" cy="30" r="15" />
          <circle cx="65" cy="30" r="15" />
          <circle cx="35" cy="50" r="15" />
          <circle cx="65" cy="50" r="15" />
          <path d="M35 70 c0 8 7 15 15 15 c8 0 15 -7 15 -15 V55 H35 v15 Z" />
        </svg>
      );
    case 'css':
      return (
        <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="6" className="tech-svg">
          <rect x="20" y="15" width="60" height="70" rx="5" />
          <path d="M35 35 h30 M35 50 h25 M35 65 h30" strokeLinecap="round" />
        </svg>
      );
    default:
      return null;
  }
}

export function WorksSection() {
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);

  const handleNext = () => {
    setActiveProjectIndex((prev) => (prev + 1) % PROJECTS.length);
  };

  const handlePrev = () => {
    setActiveProjectIndex((prev) => (prev - 1 + PROJECTS.length) % PROJECTS.length);
  };

  const project = PROJECTS[activeProjectIndex];

  return (
    <section className="works-section" id="projects">
      <h2 className="works-section-title reveal-on-scroll reveal-left delay-1">stuff i have worked on</h2>

      <div className="works-container reveal-on-scroll delay-2">
        {/* Left Panel: Project Info */}
        <div className="project-info-panel">
          <div className="project-top-row">
            <span className="project-index">
              {String(activeProjectIndex + 1).padStart(2, '0')} of {String(PROJECTS.length).padStart(2, '0')}
            </span>
          </div>

          <div className="project-title-row">
            <h3 className="project-name">{project.title}</h3>
            <span className="project-logo-badge">{project.logo}</span>
          </div>

          <p className="project-desc">{project.description}</p>

          <div className="project-tech-section">
            <p className="tech-title">Made with:</p>
            <div className="tech-icons-row">
              {project.tech.map((techKey) => (
                <div className="tech-icon-wrapper" key={techKey} title={techKey}>
                  <TechIcon type={techKey} />
                </div>
              ))}
            </div>
          </div>

          <div className="project-actions-row">
            <div className="action-buttons">
              <a href={project.visitUrl} target="_blank" rel="noopener noreferrer" className="btn-visit">
                VISIT SITE <span className="arrow">↗</span>
              </a>
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="btn-github">
                GITHUB REPO <span className="arrow">↗</span>
              </a>
            </div>

            <div className="pagination-buttons">
              <button onClick={handlePrev} className="pag-btn" aria-label="Previous project">
                &lt;
              </button>
              <button onClick={handleNext} className="pag-btn" aria-label="Next project">
                &gt;
              </button>
            </div>
          </div>
        </div>

        {/* Right Panel: Interactive 3D Stack Mockup */}
        <div className="project-preview-panel">
          <div className="mockup-stack">
            {/* Back Card */}
            <div className="mockup-card card-back">
              <div className="mockup-header-bar">
                <span className="mockup-dot"></span>
                <span className="mockup-dot"></span>
                <span className="mockup-dot"></span>
              </div>
              <div className="mockup-body">
                <h6 className="mockup-card-title">{project.mockups.back.title}</h6>
                <div className="mockup-categories">
                  {project.mockups.back.items.map((item, idx) => (
                    <div className="category-item" key={idx}>
                      <span className="cat-gradient" style={{ background: item.gradient }}></span>
                      <span className="cat-name">{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Middle Card */}
            <div className="mockup-card card-middle">
              <div className="mockup-header-bar">
                <span className="mockup-dot"></span>
                <span className="mockup-dot"></span>
                <span className="mockup-dot"></span>
              </div>
              <div className="mockup-body mockup-body-full" style={{ background: project.mockups.middle.gradient }}>
                <div className="mockup-abstract-design"></div>
              </div>
            </div>

            {/* Front Card */}
            <div className="mockup-card card-front">
              <div className="mockup-header-bar">
                <span className="mockup-dot"></span>
                <span className="mockup-dot"></span>
                <span className="mockup-dot"></span>
              </div>
              <div className="mockup-body">
                <h6 className="mockup-logo-text">{project.mockups.front.title}</h6>
                <div className="mockup-wallpapers-grid">
                  {project.mockups.front.walls.map((wallBg, idx) => (
                    <div className="mockup-wall-thumb" key={idx} style={{ background: wallBg }}></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="works-divider"></div>

      <div className="design-redirect-banner reveal-on-scroll delay-1">
        <div className="design-redirect-info">
          <span className="design-redirect-tag">// CREATIVE WORK</span>
          <h3 className="design-redirect-title">Looking for my design & photography?</h3>
          <p className="design-redirect-desc">
            Explore a compiled gallery of typography poster experiments, vector branding, interactive user interface systems, and street photography.
          </p>
        </div>
        <div className="design-redirect-actions">
          <a href="/photography" className="design-redirect-btn btn-photography">
            Photography <span className="arrow">↗</span>
          </a>
          <a href="/design" className="design-redirect-btn btn-design">
            Graphic Design <span className="arrow">↗</span>
          </a>
        </div>
      </div>
    </section>
  );
}

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { LazyImage } from './LazyImage';

interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  tech: string[];
  visitUrl: string;
  githubUrl: string;
  status: string;
  photos: string[];
}

interface Logo {
  id: string;
  title: string;
  tag: string;
  desc: string;
  imagePath: string;
}

interface GalleryImage {
  path: string;
  aspect: number;
}

interface Manifest {
  projects: Project[];
  designs: Record<string, (string | GalleryImage)[]>;
  logos: Logo[];
  photography: (string | GalleryImage)[];
}

const LOCAL_DEFAULT_MANIFEST: Manifest = {
  projects: [
    {
      id: 'wallwidgy',
      title: 'Wallwidgy',
      category: 'Web App',
      description: 'A wallpaper site made to feel premium while providing a curated collection of high quality wallpapers. Features dynamic filtering and custom palettes.',
      tech: ['React', 'JavaScript', 'Tailwind CSS', 'Framer Motion'],
      visitUrl: 'https://github.com',
      githubUrl: 'https://github.com',
      status: 'Active',
      photos: ['/projects/wallwidgy/tokyo_street.png']
    },
    {
      id: 'axion-os',
      title: 'Axion OS',
      category: 'System',
      description: 'A custom Android Open Source Project operating system focused on performance, battery life, and clean UI configurations. Rebuilt kernel optimizations.',
      tech: ['Android', 'C++', 'Java', 'Linux'],
      visitUrl: 'https://github.com',
      githubUrl: 'https://github.com',
      status: 'Maintained',
      photos: ['/projects/axion-os/hero.jpg']
    },
    {
      id: 'design-hub',
      title: 'Design Hub',
      category: 'Design Platform',
      description: 'A platform connecting web designers and developers to share mockups, feedback, and assets in a collaborative blueprint workspace.',
      tech: ['Figma', 'React', 'CSS3', 'Node.js'],
      visitUrl: 'https://github.com',
      githubUrl: 'https://github.com',
      status: 'Completed',
      photos: ['/projects/design-hub/gradient.png']
    },
    {
      id: 'realm-ui',
      title: 'Realm UI',
      category: 'Library',
      description: 'A premium component library featuring dark mode, glassmorphism UI blocks, and highly fluid micro-animations for developer efficiency.',
      tech: ['Next.js', 'Jotai', 'Tailwind CSS', 'Radix UI'],
      visitUrl: 'https://github.com',
      githubUrl: 'https://github.com',
      status: 'Active',
      photos: ['/projects/realm-ui/architecture.png']
    }
  ],
  designs: {
    posters: [
      '/designs/posters/architecture_poster.png',
      '/designs/posters/hero_design.jpg'
    ],
    layouts: [
      '/designs/layouts/avatar_art.png',
      '/designs/layouts/tokyo_layout.png'
    ]
  },
  logos: [
    {
      id: 'axion',
      title: 'Axion OS',
      tag: '// BRAND SYMBOL',
      desc: 'Minimalist delta shape focusing on structural stability and clean interfaces.',
      imagePath: '/logos/axion/logo.svg'
    },
    {
      id: 'wallwidgy',
      title: 'Wallwidgy',
      tag: '// DRAFT WORK',
      desc: 'Abstract window grid with custom anchor points representing layout modules.',
      imagePath: '/logos/wallwidgy/logo.svg'
    },
    {
      id: 'realm-ui',
      title: 'Realm UI',
      tag: '// VECTOR ICON',
      desc: 'Isometric wireframe cube representing dimensional user interfaces.',
      imagePath: '/logos/realm-ui/logo.svg'
    },
    {
      id: 'ayan-monogram',
      title: 'AYAN.DEV',
      tag: '// MONOGRAM',
      desc: 'Personal logotype fusing monogram lines with developer geometry constraints.',
      imagePath: '/logos/ayan-monogram/logo.svg'
    }
  ],
  photography: [
    '/photography/tokyo_street.png',
    '/photography/architecture.png',
    '/photography/portrait_study.jpg'
  ]
};

function getTechIconUrl(tech: string): string {
  const slug = tech
    .toLowerCase()
    .trim()
    .replace(/\.js$/, 'js')
    .replace(/\+/g, 'plus')
    .replace(/#/g, 'sharp')
    .replace(/\s+/g, '')
    .replace(/[^a-z0-9]/g, '');
  
  const customMapping: Record<string, string> = {
    'css': 'css3',
    'css3': 'css3',
    'html': 'html5',
    'html5': 'html5',
    'cpp': 'cplusplus',
    'cplusplus': 'cplusplus',
    'c': 'c',
    'motion': 'framer',
    'framermotion': 'framer',
    'framer': 'framer',
    'designplatform': 'figma',
    'nextjs': 'nextdotjs',
    'node': 'nodedotjs',
    'nodejs': 'nodedotjs',
    'threejs': 'threedotjs',
    'vue': 'vuedotjs',
    'nuxt': 'nuxtdotjs',
    'tailwind': 'tailwindcss',
    'tailwindcss': 'tailwindcss',
    'radix': 'radixui',
    'radixui': 'radixui',
    'linux': 'linux',
    'android': 'android',
    'java': 'openjdk',
  };

  const finalSlug = customMapping[slug] || slug;
  return `https://cdn.simpleicons.org/${finalSlug}`;
}

function InlineSVG({ url, className }: { url: string; className?: string }) {
  const [svgContent, setSvgContent] = useState<string | null>(null);

  useEffect(() => {
    if (url.endsWith('.svg')) {
      fetch(url)
        .then((res) => {
          if (!res.ok) throw new Error('Failed to load SVG');
          return res.text();
        })
        .then((text) => {
          // Keep only the SVG contents by extracting <svg ... </svg>
          const svgMatch = text.match(/<svg[\s\S]*<\/svg>/i);
          if (svgMatch) {
            // Remove hardcoded width and height attributes to make it responsive
            const cleanSvg = svgMatch[0]
              .replace(/width="[^"]*"/gi, '')
              .replace(/height="[^"]*"/gi, '');
            setSvgContent(cleanSvg);
          } else {
            setSvgContent(text);
          }
        })
        .catch((err) => {
          console.error('Error loading inline SVG:', err);
          setSvgContent(null);
        });
    } else {
      setSvgContent(null);
    }
  }, [url]);

  if (!url.endsWith('.svg')) {
    return <img src={url} alt="" className={className} loading="lazy" decoding="async" />;
  }

  if (!svgContent) {
    return <div className={`${className} logo-svg-skeleton`} />;
  }

  return (
    <div 
      className={className} 
      dangerouslySetInnerHTML={{ __html: svgContent }} 
      style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
    />
  );
}

interface ProjectsPageProps {
  initialScrollTarget?: string;
  clearScrollTarget?: () => void;
}

export function ProjectsPage({ initialScrollTarget, clearScrollTarget }: ProjectsPageProps) {
  const [manifest, setManifest] = useState<Manifest>(LOCAL_DEFAULT_MANIFEST);
  const [filter, setFilter] = useState<string>('All');
  const [expandedPhoto, setExpandedPhoto] = useState<string | null>(null);

  useEffect(() => {
    if (initialScrollTarget) {
      const scroll = () => {
        const el = document.getElementById(initialScrollTarget);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          if (clearScrollTarget) {
            clearScrollTarget();
          }
          return true;
        }
        return false;
      };

      if (!scroll()) {
        const timer = setTimeout(() => {
          scroll();
        }, 100);
        return () => clearTimeout(timer);
      }
    }
  }, [initialScrollTarget, manifest, clearScrollTarget]);

  useEffect(() => {
    fetch('/manifest.json')
      .then((res) => {
        if (!res.ok) throw new Error('Manifest not found');
        return res.json();
      })
      .then((data) => {
        setManifest(data);
      })
      .catch((err) => {
        console.warn('Could not fetch manifest.json, using fallback data:', err);
        setManifest(LOCAL_DEFAULT_MANIFEST);
      });
  }, []);

  const categories = ['All', ...new Set(manifest.projects.map(p => p.category))];

  const filteredProjects = filter === 'All' 
    ? manifest.projects 
    : manifest.projects.filter(p => p.category === filter);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="page-view-container fade-in">
      <header className="page-header">
        <h1 className="page-title">creations.</h1>
        <p className="page-description-sub">
          A catalog of engineering, brand design, layout grids, and visual observations.
        </p>

        {/* Section Navigation Header */}
        <nav className="projects-section-nav">
          <button onClick={() => scrollToSection('dev-projects')} className="nav-anchor-btn">
            <span className="nav-anchor-dot"></span>DEV PROJECTS
          </button>
          <button onClick={() => scrollToSection('logo-design')} className="nav-anchor-btn">
            <span className="nav-anchor-dot"></span>LOGOS
          </button>
          <button onClick={() => scrollToSection('graphic-design')} className="nav-anchor-btn">
            <span className="nav-anchor-dot"></span>DESIGNS
          </button>
          <button onClick={() => scrollToSection('photography')} className="nav-anchor-btn">
            <span className="nav-anchor-dot"></span>PHOTOGRAPHY
          </button>
        </nav>
      </header>

      {/* SECTION 1: DEV PROJECTS */}
      <section className="projects-sub-section" id="dev-projects">
        <div className="section-meta-header">
          <h2 className="section-section-title">development projects</h2>
        </div>

        {/* Filter Tabs */}
        <div className="projects-filter-bar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`filter-btn ${filter === cat ? 'active' : ''}`}
            >
              {cat.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="projects-list-grid">
          {filteredProjects.map((project) => (
            <div key={project.id} id={project.id} className={`project-detail-card ${initialScrollTarget === project.id ? 'highlight-pulse' : ''}`} style={{ overflow: 'hidden' }}>
              {/* Project main preview banner */}
              {project.photos && project.photos.length > 0 && (
                <div 
                  className="project-card-banner-frame" 
                  onClick={() => setExpandedPhoto(project.photos[0])}
                  style={{ 
                    width: '100%', 
                    height: '180px', 
                    overflow: 'hidden', 
                    borderRadius: '18px', 
                    marginBottom: '8px',
                    border: '1px solid var(--border-color)',
                  }}
                >
                  <LazyImage 
                    src={project.photos[0]} 
                    alt={project.title} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                </div>
              )}

              <div className="project-card-header">
                <span className="project-category-tag">{project.category}</span>
                <span className={`project-status-dot ${project.status.toLowerCase()}`}>
                  {project.status}
                </span>
              </div>

              <h3 className="project-card-title">{project.title}</h3>
              <p className="project-card-description">{project.description}</p>

              {/* Extra photos row */}
              {project.photos && project.photos.length > 1 && (
                <div 
                  className="project-mini-gallery" 
                  style={{ 
                    display: 'flex', 
                    gap: '8px', 
                    marginBottom: '8px', 
                    overflowX: 'auto', 
                    paddingBottom: '6px'
                  }}
                >
                  {project.photos.slice(1).map((photo, pIdx) => (
                    <LazyImage 
                      key={pIdx} 
                      src={photo} 
                      alt="" 
                      onClick={() => setExpandedPhoto(photo)}
                      style={{ 
                        width: '60px', 
                        height: '45px', 
                        objectFit: 'cover', 
                        borderRadius: '8px', 
                        border: '1px solid var(--border-color)', 
                        flexShrink: 0 
                      }} 
                    />
                  ))}
                </div>
              )}

              <div className="project-tech-tags">
                {project.tech.map((t, idx) => (
                  <span key={idx} className="tech-tag" style={{ display: 'inline-flex', alignItems: 'center' }}>
                    <img 
                      src={getTechIconUrl(t)} 
                      alt="" 
                      className="tech-icon-img" 
                      loading="lazy"
                      decoding="async"
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                      style={{ width: '14px', height: '14px', marginRight: '6px', verticalAlign: 'middle' }}
                    />
                    {t}
                  </span>
                ))}
              </div>

              <div className="project-card-links">
                {project.visitUrl && (
                  <a href={project.visitUrl} target="_blank" rel="noopener noreferrer" className="proj-link visit-btn">
                    Visit Project ↗
                  </a>
                )}
                {project.githubUrl && (
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="proj-link github-btn">
                    Source Code ↗
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 2: LOGOS */}
      <section className="projects-sub-section" id="logo-design">
        <div className="section-meta-header">
          <h2 className="section-section-title">logo & branding marks</h2>
        </div>
        <p className="section-intro-text">
          A small collection of geometric, vector-based logotypes and branding experiments.
        </p>

        <div className="logo-designs-grid">
          {manifest.logos.map((logo) => (
            <div key={logo.id} className="logo-design-card">
              <div className="logo-visual-box">
                <InlineSVG url={logo.imagePath} className="logo-svg-mark" />
                <div className="blueprint-grid-overlay"></div>
              </div>
              <div className="logo-info">
                <h4 className="logo-title">{logo.title}</h4>
                <p className="logo-desc">{logo.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 3: DESIGNS */}
      <section className="projects-sub-section" id="graphic-design">
        <div className="section-meta-header">
          <h2 className="section-section-title">designs & poster art</h2>
        </div>
        <p className="section-intro-text">
          Print materials, Swiss typography systems, layout architectures, and visual experiments.
        </p>

        {manifest.designs && Object.keys(manifest.designs).length > 0 && (
          <div className="designs-subsections-container" style={{ display: 'flex', flexDirection: 'column', gap: '48px', marginTop: '32px' }}>
            {Object.keys(manifest.designs).map((folderName) => (
              <div key={folderName} className="graphic-subsection">
                <div className="subsection-header">
                  <h3 className="subsection-title">{folderName.replace(/-/g, ' ')}</h3>
                  <span className="subsection-line"></span>
                </div>

                {/* Designs Masonry Grid */}
                <div className="masonry-grid">
                  {manifest.designs[folderName]?.map((imgItem, idx) => {
                    const isObj = typeof imgItem === 'object' && imgItem !== null;
                    const imagePath = isObj ? (imgItem as GalleryImage).path : (imgItem as string);
                    const aspect = isObj ? (imgItem as GalleryImage).aspect : undefined;
                    const fileName = imagePath.split('/').pop()?.split('.')[0]?.replace(/_/g, ' ') || 'Design';
                    return (
                      <div 
                        key={idx} 
                        className="photo-card-wrapper masonry-item" 
                        onClick={() => setExpandedPhoto(imagePath)}
                        style={aspect ? { aspectRatio: String(aspect) } : undefined}
                      >
                        <div 
                          className="photo-frame masonry-frame"
                          style={aspect ? { aspectRatio: String(aspect) } : undefined}
                        >
                          <LazyImage src={imagePath} alt={fileName} className="gallery-photo" native />
                          <div className="photo-overlay"></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* SECTION 4: PHOTOGRAPHY */}
      <section className="projects-sub-section" id="photography">
        <div className="section-meta-header">
          <h2 className="section-section-title">photography</h2>
        </div>
        <p className="section-intro-text">
          Visual captures, architectural lines, high-contrast framing, and street observations.
        </p>

        {/* Photography Masonry Grid */}
        <div className="masonry-grid">
          {manifest.photography.map((imgItem, idx) => {
            const isObj = typeof imgItem === 'object' && imgItem !== null;
            const imagePath = isObj ? (imgItem as GalleryImage).path : (imgItem as string);
            const aspect = isObj ? (imgItem as GalleryImage).aspect : undefined;
            const fileName = imagePath.split('/').pop()?.split('.')[0]?.replace(/_/g, ' ') || 'Photo';
            return (
              <div 
                key={idx} 
                className="photo-card-wrapper masonry-item" 
                onClick={() => setExpandedPhoto(imagePath)}
                style={aspect ? { aspectRatio: String(aspect) } : undefined}
              >
                <div 
                  className="photo-frame masonry-frame"
                  style={aspect ? { aspectRatio: String(aspect) } : undefined}
                >
                  <LazyImage src={imagePath} alt={fileName} className="gallery-photo" native />
                  <div className="photo-overlay"></div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Lightbox Modal */}
      {expandedPhoto && createPortal(
        <div 
          className="photo-lightbox-overlay" 
          onClick={() => setExpandedPhoto(null)}
        >
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <img src={expandedPhoto} alt="" className="lightbox-img" />
            <button className="lightbox-close-btn" onClick={() => setExpandedPhoto(null)}>×</button>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

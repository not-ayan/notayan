import { useState, useEffect } from 'react';

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
    }
  ],
  designs: {},
  logos: [],
  photography: []
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
    'composeui': 'jetpackcompose',
    'jetpackcompose': 'jetpackcompose',
    'kotlin': 'kotlin',
    'typescript': 'typescript'
  };

  const finalSlug = customMapping[slug] || slug;
  return `https://cdn.simpleicons.org/${finalSlug}`;
}

const MOCKUP_DATA_MAP: Record<string, any> = {
  'wallwidgy': {
    logo: 'w',
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
        photo: '',
        walls: [
          'linear-gradient(to bottom, #30cfd0 0%, #330867 100%)',
          'linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%)',
          'linear-gradient(to top, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)',
          'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        ]
      }
    }
  },
  'Wallwidgy android': {
    logo: 'wa',
    mockups: {
      back: {
        title: 'System Integration',
        items: [
          { name: 'Material You', gradient: 'linear-gradient(135deg, #a1c4fd, #c2e9fb)' },
          { name: 'Favorites', gradient: 'linear-gradient(135deg, #ff9a9e, #fecfef)' },
          { name: 'Curated API', gradient: 'linear-gradient(135deg, #30cfd0, #330867)' }
        ]
      },
      middle: {
        gradient: 'linear-gradient(135deg, #1f4068, #162447)'
      },
      front: {
        title: 'Wallwidgy Compose',
        photo: '',
        walls: [
          'linear-gradient(to bottom, #30cfd0 0%, #330867 100%)',
          'linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%)',
          'linear-gradient(to top, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)',
          'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        ]
      }
    }
  }
};

const getProjectMockupData = (proj: Project) => {
  if (MOCKUP_DATA_MAP[proj.id]) {
    return MOCKUP_DATA_MAP[proj.id];
  }
  // Generic fallback using screenshots/metadata
  const logo = proj.title.charAt(0).toLowerCase();
  const photo = proj.photos && proj.photos.length > 0 ? proj.photos[0] : '';
  
  return {
    logo,
    mockups: {
      back: {
        title: 'Stack & Info',
        items: proj.tech.map((t, idx) => ({
          name: t,
          gradient: `linear-gradient(135deg, ${idx % 2 === 0 ? '#1f4068' : '#F1A5A0'}, ${idx % 2 === 0 ? '#162447' : '#4e1a3d'})`
        })).slice(0, 3)
      },
      middle: {
        gradient: 'linear-gradient(135deg, #0f2027, #203a43, #2c5364)'
      },
      front: {
        title: proj.title,
        photo: photo,
        walls: [
          'linear-gradient(to bottom, #30cfd0 0%, #330867 100%)',
          'linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%)'
        ]
      }
    }
  };
};

export function WorksSection() {
  const [projects, setProjects] = useState<Project[]>(LOCAL_DEFAULT_MANIFEST.projects);
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);
  const [failedIcons, setFailedIcons] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetch('/manifest.json')
      .then((res) => {
        if (!res.ok) throw new Error('Manifest not found');
        return res.json();
      })
      .then((data) => {
        if (data && data.projects) {
          setProjects(data.projects);
        }
      })
      .catch((err) => {
        console.warn('Could not fetch manifest.json, using fallback data:', err);
        setProjects(LOCAL_DEFAULT_MANIFEST.projects);
      });
  }, []);

  const handleNext = () => {
    setActiveProjectIndex((prev) => (prev + 1) % projects.length);
  };

  const handlePrev = () => {
    setActiveProjectIndex((prev) => (prev - 1 + projects.length) % projects.length);
  };

  if (projects.length === 0) return null;

  const project = projects[activeProjectIndex];
  const mockupData = getProjectMockupData(project);

  return (
    <section className="works-section" id="projects">
      <h2 className="works-section-title reveal-on-scroll reveal-left delay-1">stuff i have worked on</h2>

      <div className="works-container reveal-on-scroll delay-2">
        {/* Left Panel: Project Info */}
        <div className="project-info-panel">
          <div className="project-top-row">
            <span className="project-index">
              {String(activeProjectIndex + 1).padStart(2, '0')} of {String(projects.length).padStart(2, '0')}
            </span>
          </div>

          <div className="project-title-row">
            <h3 className="project-name">{project.title}</h3>
            <span className="project-logo-badge">{mockupData.logo}</span>
          </div>

          <p className="project-desc">{project.description}</p>

          <div className="project-tech-section">
            <p className="tech-title">Made with:</p>
            <div className="tech-icons-row">
              {project.tech
                .filter((techName) => !failedIcons[techName])
                .map((techName) => (
                  <div className="tech-icon-wrapper" key={techName} title={techName}>
                    <img 
                      src={getTechIconUrl(techName)} 
                      alt={techName} 
                      className="tech-icon-img" 
                      onError={() => setFailedIcons(prev => ({ ...prev, [techName]: true }))}
                      style={{ width: '20px', height: '20px', objectFit: 'contain' }}
                    />
                  </div>
                ))}
            </div>
          </div>

          <div className="project-actions-row">
            <div className="action-buttons">
              {project.visitUrl || project.githubUrl ? (
                <>
                  {project.visitUrl && (
                    <a href={project.visitUrl} target="_blank" rel="noopener noreferrer" className="btn-visit">
                      VISIT SITE <span className="arrow">↗</span>
                    </a>
                  )}
                  {project.githubUrl && (
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="btn-github">
                      GITHUB REPO <span className="arrow">↗</span>
                    </a>
                  )}
                </>
              ) : (
                <span className={`project-status-tag ${project.status.toLowerCase()}`}>
                  {project.status}
                </span>
              )}
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
                <h6 className="mockup-card-title">{mockupData.mockups.back.title}</h6>
                <div className="mockup-categories">
                  {mockupData.mockups.back.items.map((item: any, idx: number) => (
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
              <div className="mockup-body mockup-body-full" style={{ background: mockupData.mockups.middle.gradient }}>
                <div className="mockup-abstract-design"></div>
              </div>
            </div>

            {/* Front Card */}
            <div 
              className="mockup-card card-front"
              style={mockupData.mockups.front.photo ? { overflow: 'hidden' } : undefined}
            >
              <div className="mockup-header-bar">
                <span className="mockup-dot"></span>
                <span className="mockup-dot"></span>
                <span className="mockup-dot"></span>
              </div>
              <div 
                className="mockup-body"
                style={mockupData.mockups.front.photo ? { 
                  backgroundImage: `url(${mockupData.mockups.front.photo})`, 
                  backgroundSize: 'cover', 
                  backgroundPosition: 'center',
                  height: 'calc(100% - 24px)',
                  padding: 0
                } : undefined}
              >
                {!mockupData.mockups.front.photo && <h6 className="mockup-logo-text">{mockupData.mockups.front.title}</h6>}
                {!mockupData.mockups.front.photo && (
                  <div className="mockup-wallpapers-grid">
                    {mockupData.mockups.front.walls.map((wallBg: string, idx: number) => (
                      <div className="mockup-wall-thumb" key={idx} style={{ background: wallBg }}></div>
                    ))}
                  </div>
                )}
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

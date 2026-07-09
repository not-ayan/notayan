import { useState } from 'react';

const PROJECTS_DATA = [
  {
    id: 1,
    title: 'Wallwidgy',
    category: 'Web App',
    description: 'A wallpaper site made to feel premium while providing a curated collection of high quality wallpapers. Features dynamic filtering and custom palettes.',
    tech: ['React', 'JavaScript', 'Tailwind', 'Motion'],
    visitUrl: 'https://github.com',
    githubUrl: 'https://github.com',
    status: 'Active'
  },
  {
    id: 2,
    title: 'Axion OS',
    category: 'System',
    description: 'A custom Android Open Source Project operating system focused on performance, battery life, and clean UI configurations. Rebuilt kernel optimizations.',
    tech: ['Android', 'C++', 'Java', 'Linux'],
    visitUrl: 'https://github.com',
    githubUrl: 'https://github.com',
    status: 'Maintained'
  },
  {
    id: 3,
    title: 'Design Hub',
    category: 'Design Platform',
    description: 'A platform connecting web designers and developers to share mockups, feedback, and assets in a collaborative blueprint workspace.',
    tech: ['Figma', 'React', 'CSS', 'Node.js'],
    visitUrl: 'https://github.com',
    githubUrl: 'https://github.com',
    status: 'Completed'
  },
  {
    id: 4,
    title: 'Realm UI',
    category: 'Library',
    description: 'A premium component library featuring dark mode, glassmorphism UI blocks, and highly fluid micro-animations for developer efficiency.',
    tech: ['Next.js', 'Jotai', 'Tailwind', 'Radix'],
    visitUrl: 'https://github.com',
    githubUrl: 'https://github.com',
    status: 'Active'
  }
];

export function ProjectsPage() {
  const [filter, setFilter] = useState<'All' | 'Web App' | 'System' | 'Library' | 'Design Platform'>('All');

  const filteredProjects = filter === 'All' 
    ? PROJECTS_DATA 
    : PROJECTS_DATA.filter(p => p.category === filter);

  return (
    <div className="page-view-container fade-in">
      <header className="page-header">
        <span className="page-label">// WORKS & CREATIONS</span>
        <h1 className="page-title">my projects.</h1>
      </header>

      {/* Filter Tabs */}
      <div className="projects-filter-bar">
        {(['All', 'Web App', 'System', 'Library', 'Design Platform'] as const).map((cat) => (
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
          <div key={project.id} className="project-detail-card">
            <div className="project-card-header">
              <span className="project-category-tag">{project.category}</span>
              <span className={`project-status-dot ${project.status.toLowerCase()}`}>
                {project.status}
              </span>
            </div>

            <h2 className="project-card-title">{project.title}</h2>
            <p className="project-card-description">{project.description}</p>

            <div className="project-tech-tags">
              {project.tech.map((t, idx) => (
                <span key={idx} className="tech-tag">{t}</span>
              ))}
            </div>

            <div className="project-card-links">
              <a href={project.visitUrl} target="_blank" rel="noopener noreferrer" className="proj-link visit-btn">
                Visit Project ↗
              </a>
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="proj-link github-btn">
                Source Code ↗
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

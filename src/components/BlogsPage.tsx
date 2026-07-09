import { useState } from 'react';
import { useAxionData, formatDate, formatFileSize } from '../hooks/useAxionData';

type Post = {
  id: string;
  type: 'article' | 'rom';
  category: string;
  title: string;
  subtitle?: string;
  date: string;
  readTime?: string;
  excerpt: string;
  image?: string;
  content?: string;
  resources?: {
    title: string;
    links: { label: string; href: string }[];
  }[];
};

const BLOG_POSTS: Post[] = [
  {
    id: 'font-pairing-guide',
    type: 'article',
    category: 'Typography',
    title: 'Font Pairing Guide',
    date: 'Jun 20, 2023',
    readTime: '5 min read',
    excerpt: 'A comprehensive guide to combining typefaces and establishing typographic hierarchy in design projects.',
    content: `
      Before pairing fonts, it is important to understand the main typeface categories:
      
      ### 1. Typeface Categories
      - **Serif**: Traditional, formal fonts with decorative strokes (e.g. Merriweather, Georgia).
      - **Sans-serif**: Clean, modern fonts without decorative strokes (e.g. Inter, Roboto).
      - **Script**: Decorative, handwritten-style typefaces.
      - **Display**: Bold, attention-grabbing headlines.
      - **Monospace**: Fixed-width typefaces, great for code layouts.
      
      ### 2. Basic Principles
      - **Contrast**: Pair fonts with distinct differences (e.g., a bold serif heading with a neutral sans-serif body).
      - **Hierarchy**: Use size weights, line spacing, and sizes effectively.
      - **Readability**: Ensure the body font is highly legible at smaller scales.
      
      ### 3. Popular Combinations
      - Serif + Sans-serif (e.g. Playfair Display + Inter)
      - Display + Sans-serif (e.g. Syne + Outfit)
    `,
    resources: [
      {
        title: 'Font Resources',
        links: [
          { label: 'Google Fonts', href: 'https://fonts.google.com' },
          { label: 'Adobe Fonts', href: 'https://fonts.adobe.com' }
        ]
      },
      {
        title: 'Interactive Tools',
        links: [
          { label: 'Type Scale Calculator', href: 'https://type-scale.com' },
          { label: 'Font Pair', href: 'https://fontpair.co' }
        ]
      }
    ]
  },
  {
    id: 'vector-art-tips',
    type: 'article',
    category: 'Illustrations',
    title: 'Vector Art Tips',
    date: 'Jun 15, 2023',
    readTime: '6 min read',
    excerpt: 'Mastering paths, anchor points, shape builders, and shading techniques to create clean vector illustrations.',
    content: `
      Vector art uses mathematical equations to create scalable graphics. Here are some essential tips for creating vector illustrations:
      
      ### 1. Essential Tools
      - **Adobe Illustrator**: Industry standard vector editor.
      - **Figma**: Modern design tool with advanced vector networks.
      - **Inkscape**: Free open-source alternative.
      
      ### 2. Best Practices
      - **Pen Tool Mastery**: Use the fewest possible anchor points to maintain smooth, clean curves.
      - **Handles & Nodes**: Keep handle directions consistent to prevent weird crimping.
      - **Organized Layers**: Always name your vectors and group shapes logically.
    `,
    resources: [
      {
        title: 'Assets & Libraries',
        links: [
          { label: 'SVG Repo', href: 'https://www.svgrepo.com' },
          { label: 'Undraw Illustrations', href: 'https://undraw.co' }
        ]
      }
    ]
  },
  {
    id: 'ui-components',
    type: 'article',
    category: 'Design Kits',
    title: 'UI Components Design',
    date: 'Jun 10, 2023',
    readTime: '7 min read',
    excerpt: 'Detailed guidelines for structuring and designing clean, accessible, and responsive user interface components.',
    content: `
      Every digital application relies on a solid component foundation. Follow these guides to structure yours:
      
      ### 1. Core Component Blueprint
      - **Buttons**: Define clear primary, secondary, and ghost variants.
      - **Inputs**: Build responsive text boxes with error, focus, and disabled states.
      - **Cards**: Contain information uniformly with fixed padding and borders.
      
      ### 2. Accessible Design
      - Ensure a color contrast ratio of at least 4.5:1 for text blocks.
      - Map keyboard navigation states (focus indicators) clearly.
    `,
    resources: [
      {
        title: 'Libraries & Systems',
        links: [
          { label: 'Radix Primitives', href: 'https://www.radix-ui.com' },
          { label: 'Tailwind UI', href: 'https://tailwindui.com' }
        ]
      }
    ]
  },
  {
    id: 'fluid-animations',
    type: 'article',
    category: 'Development',
    title: 'Building Fluid Micro-Animations in React',
    date: 'Jul 8, 2026',
    readTime: '4 min read',
    excerpt: 'How to utilize CSS variables, springs, and Framer Motion to build animations that feel organic and extremely responsive.',
    content: `
      Designing high-quality web interfaces requires going beyond static assets. The difference between a good interface and a premium interface is how it moves.
      
      ### 1. Spring Physics
      Static linear transitions (e.g. \`transition: all 0.3s linear\`) often feel artificial. Real-world objects have weight and momentum. By using spring configurations, elements accelerate and decelerate with fluid inertia.
      
      ### 2. Utilizing Framer Motion
      In React, libraries like Framer Motion allow developer-friendly access to spring physics:
      \`\`\`jsx
      <motion.button
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      />
      \`\`\`
    `
  }
];

function CopyableCommand({ command }: { command: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="copyable-command-container">
      <span className="command-text-span">{command}</span>
      <button className="copy-icon-btn" onClick={handleCopy} title="Copy command">
        {copied ? (
          <span style={{ fontSize: '10px', color: 'var(--accent)' }}>Copied!</span>
        ) : (
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
        )}
      </button>
    </div>
  );
}

function CollapsiblePanel({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="collapsible-panel">
      <button className="collapsible-trigger-btn" onClick={() => setOpen(!open)}>
        <span>{title}</span>
        <span>{open ? '−' : '+'}</span>
      </button>
      {open && <div className="collapsible-panel-content">{children}</div>}
    </div>
  );
}

function parseChangelog(raw: string) {
  if (!raw) return null;
  const lines = raw.split('\n');
  const items = lines.filter(l => l.trim().startsWith('-')).map(l => l.replace(/^-\s*/, '').trim());

  let version = "";
  let buildDate = "";
  let credits = "";

  for (const line of lines) {
    if (line.includes('Version:')) {
      version = line.split('Version:')[1].trim();
    } else if (line.includes('Build Date:')) {
      buildDate = line.split('Build Date:')[1].trim();
    } else if (line.includes('Credits:')) {
      credits = line.split('Credits:')[1].trim();
    }
  }

  return { version, buildDate, credits, items };
}

export function BlogsPage() {
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const { data: axionData } = useAxionData();

  const handleBack = () => {
    setSelectedPostId(null);
  };

  //  If a post is selected, render its detail view
  if (selectedPostId) {
    if (selectedPostId === 'axion-aosp') {
      const changelog = axionData?.changelog ? parseChangelog(axionData.changelog) : null;
      const changelogItems = changelog?.items && changelog.items.length > 0
        ? changelog.items
        : [
          'Update Wi-Fi HAL interfaces combination to match MediaTek BSP behaviour.',
          'Kernel compiled at O3 level optimization for Cancunf.',
          'GMS updates and battery optimizations.'
        ];

      return (
        <div className="page-view-container fade-in">
          <button className="back-btn" onClick={handleBack}>
            ← BACK TO LOGS
          </button>

          <article className="blog-article">
            <header className="page-header" style={{ marginBottom: '24px' }}>
              <span className="page-label">
                Official Build for Moto G54 (cancunf) • {axionData?.gms ? formatDate(axionData.gms.datetime) : 'Dec 13, 2025'}
              </span>
              <h1 className="page-title">
                Axion AOSP {axionData?.gms?.version ? `v${axionData.gms.version}` : 'v2.2.1'}
              </h1>
            </header>

            {/* ROM Info Card */}
            <div className="rom-info-card" style={{ marginTop: '24px' }}>
              <div className="rom-info-header">
                <div className="rom-thumb-icon">AX</div>
                <div>
                  <h2 className="card-section-title">Device & Build Information</h2>
                  <div className="rom-meta-rows">
                    <span className="rom-meta-item">
                      <span className="rom-meta-bullet"></span>Android 15
                    </span>
                    <span className="rom-meta-item">
                      <span className="rom-meta-bullet"></span>Official ROM
                    </span>
                    <span className="rom-meta-item">
                      <span className="rom-meta-bullet"></span>OTA Supported
                    </span>
                  </div>
                </div>
              </div>

              {/* Dynamic Downloads Grid */}
              <div className="rom-download-grid">
                {/* GMS Build */}
                <div className="rom-download-subcard">
                  <div className="rom-subcard-header">
                    <div className="rom-subcard-icon">G</div>
                    <div>
                      <h3 className="rom-subcard-title">GMS Build</h3>
                      <p className="rom-subcard-subtitle">Google Play Services Pre-loaded</p>
                    </div>
                  </div>
                  <div className="rom-subcard-specs">
                    <div className="rom-spec-row">
                      <span className="rom-spec-key">File Size</span>
                      <span className="rom-spec-val">
                        {axionData?.gms ? formatFileSize(axionData.gms.size) : '2.09 GB'}
                      </span>
                    </div>
                    <div className="rom-spec-row">
                      <span className="rom-spec-key">Date</span>
                      <span className="rom-spec-val">
                        {axionData?.gms ? formatDate(axionData.gms.datetime) : '13/12/2025'}
                      </span>
                    </div>
                  </div>
                  <a href={axionData?.gms?.url || '#'} target="_blank" rel="noopener noreferrer" className="rom-download-action-btn">
                    Download GMS Build ↗
                  </a>
                </div>

                {/* Vanilla Build */}
                <div className="rom-download-subcard">
                  <div className="rom-subcard-header">
                    <div className="rom-subcard-icon">V</div>
                    <div>
                      <h3 className="rom-subcard-title">Vanilla Build</h3>
                      <p className="rom-subcard-subtitle">Clean Minimal AOSP Core</p>
                    </div>
                  </div>
                  <div className="rom-subcard-specs">
                    <div className="rom-spec-row">
                      <span className="rom-spec-key">File Size</span>
                      <span className="rom-spec-val">
                        {axionData?.vanilla ? formatFileSize(axionData.vanilla.size) : '1.65 GB'}
                      </span>
                    </div>
                    <div className="rom-spec-row">
                      <span className="rom-spec-key">Date</span>
                      <span className="rom-spec-val">
                        {axionData?.vanilla ? formatDate(axionData.vanilla.datetime) : '13/12/2025'}
                      </span>
                    </div>
                  </div>
                  <a href={axionData?.vanilla?.url || '#'} target="_blank" rel="noopener noreferrer" className="rom-download-action-btn secondary-btn">
                    Download Vanilla ↗
                  </a>
                </div>
              </div>
            </div>

            {/* Changelog panel */}
            <div className="rom-info-card">
              <div className="flex items-center justify-between mb-3">
                <h2 className="card-section-title" style={{ margin: 0 }}>
                  {changelog?.version || 'v2.2.1'} Changelog
                </h2>
                <span style={{ fontSize: '11px', fontFamily: 'var(--mono)', color: 'var(--text-muted)' }}>
                  {changelog?.buildDate || 'Build Date: 13/12/2025'}
                </span>
              </div>
              <p className="body-para" style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>
                Credits: <span style={{ color: 'var(--text-dark)', fontWeight: '500' }}>{changelog?.credits || '@cyberknight777 & @sarthakroy2002'}</span>
              </p>
              <div className="article-body" style={{ gap: '10px' }}>
                {changelogItems.map((line, idx) => (
                  <p key={idx} className="body-para" style={{ display: 'flex', gap: '8px', fontSize: '14px' }}>
                    <span style={{ color: 'var(--accent)' }}>•</span>
                    <span>{line}</span>
                  </p>
                ))}
              </div>
              <div style={{ marginTop: '20px', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                <a href="https://github.com/AxionAOSP/axion_changelogs" target="_blank" rel="noopener noreferrer" className="game-link-badge-modern" style={{ width: 'fit-content' }}>
                  View Full Changelog GitHub ↗
                </a>
              </div>
            </div>

            {/* Collapsible installation instructions */}
            <CollapsiblePanel title="Flashing Custom Recovery Instructions">
              <span className="instruction-subhead">PREREQUISITES:</span>
              <p className="body-para" style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '4px 0 12px 0' }}>
                Unlock bootloader, enable USB debugging, and ensure Android 14 firmware (U1TD34M.94-12-7) is loaded.
              </p>
              <span className="instruction-subhead">STEPS:</span>
              <ol className="instructions-list">
                <li>Power off device and enter bootloader (Volume Down + Power).</li>
                <li>Connect device to PC via USB.</li>
                <li>Execute the fastboot bootloader commands in terminal:</li>
              </ol>
              <CopyableCommand command="fastboot reboot fastboot&#10;fastboot flash vendor_boot vendor_boot.img" />
            </CollapsiblePanel>

            <CollapsiblePanel title="Sideloading ROM Zip File via Recovery">
              <span className="instruction-subhead">STEPS:</span>
              <ol className="instructions-list">
                <li>Enter Custom Recovery from bootloader.</li>
                <li>Navigate to "Factory Reset" / "Format Data" and confirm.</li>
                <li>Go back and select "Apply Update" → "Apply from ADB Sideload".</li>
                <li>Run sideload command on your host PC:</li>
              </ol>
              <CopyableCommand command="adb sideload rom-build.zip" />
              <p className="body-para" style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>
                * Replace <code>rom-build.zip</code> with your downloaded GMS or Vanilla zip file.
              </p>
            </CollapsiblePanel>

            {/* Support Development */}
            <div className="rom-info-card">
              <h2 className="card-section-title">Support Project</h2>
              <p className="body-para" style={{ fontSize: '14px', margin: '8px 0 16px 0' }}>
                Keep ROM development and test builds alive. Support AOSP building:
              </p>
              <div className="support-actions">
                <a href="https://paypal.me/ayanbiswas" target="_blank" rel="noopener noreferrer" className="support-action-btn">
                  PayPal ↗
                </a>
                <a href="https://upi.com/ayanbiswas" target="_blank" rel="noopener noreferrer" className="support-action-btn">
                  UPI / QR ↗
                </a>
                <a href="https://github.com/AxionAOSP" target="_blank" rel="noopener noreferrer" className="support-action-btn">
                  GitHub Organization ↗
                </a>
              </div>
            </div>
          </article>
        </div>
      );
    }

    if (selectedPostId === 'lineageos-ext') {
      return (
        <div className="page-view-container fade-in">
          <button className="back-btn" onClick={handleBack}>
            ← BACK TO LOGS
          </button>

          <article className="blog-article">
            <header className="page-header" style={{ marginBottom: '24px' }}>
              <span className="page-label">
                Custom ROM • Android 15 Build
              </span>
              <h1 className="page-title">
                LineageOS Extended
              </h1>
            </header>

            {/* Download and Info */}
            <div className="rom-info-card" style={{ marginTop: '24px' }}>
              <div className="rom-info-header">
                <div className="rom-thumb-icon">LOS</div>
                <div>
                  <h3 className="card-section-title">Cancunf Extended</h3>
                  <p className="body-para" style={{ fontSize: '13px', margin: '4px 0' }}>
                    Standard Lineage core with custom scheduling and hardware improvements.
                  </p>
                </div>
              </div>
              <div style={{ marginTop: '20px' }}>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="rom-download-action-btn">
                  Download Release ZIP ↗
                </a>
              </div>
            </div>

            {/* Changelog panel */}
            <div className="rom-info-card">
              <h2 className="card-section-title" style={{ marginBottom: '16px' }}>Changelogs</h2>
              <div className="support-actions" style={{ marginTop: '8px' }}>
                <a href="https://github.com/LineageOS/android" target="_blank" rel="noopener noreferrer" className="support-action-btn">
                  Source Changelog ↗
                </a>
                <a href="https://github.com/LineageOS/android_device_motorola_cancunf" target="_blank" rel="noopener noreferrer" className="support-action-btn">
                  Device Changelog ↗
                </a>
              </div>
            </div>

            {/* Instructions */}
            <CollapsiblePanel title="Flashing Instructions">
              <span className="instruction-subhead">PREREQUISITES:</span>
              <p className="body-para" style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '4px 0 12px 0' }}>
                Unlock bootloader, enable USB debugging, and ensure Android 14 firmware (U1TD34M.94-12-7) is loaded.
              </p>
              <span className="instruction-subhead">STEPS:</span>
              <ol className="instructions-list">
                <li>Power off device and enter bootloader (Volume Down + Power).</li>
                <li>Connect device to PC via USB.</li>
                <li>Execute fastboot recovery commands:</li>
              </ol>
              <CopyableCommand command="fastboot reboot fastboot&#10;fastboot flash vendor_boot vendor_boot.img" />

              <span className="instruction-subhead" style={{ marginTop: '20px' }}>SIDELOADING:</span>
              <ol className="instructions-list" style={{ marginTop: '4px' }}>
                <li>Select recovery and boot into it.</li>
                <li>Format user data partition.</li>
                <li>Go to "Apply update" → "ADB Sideload" and run:</li>
              </ol>
              <CopyableCommand command="adb sideload rom.zip" />
            </CollapsiblePanel>

            {/* Support Development */}
            <div className="rom-info-card">
              <h2 className="card-section-title">Support Project</h2>
              <p className="body-para" style={{ fontSize: '14px', margin: '8px 0 16px 0' }}>
                Consider supporting the developers to keep the project alive:
              </p>
              <div className="support-actions">
                <a href="https://paypal.me/ayanbiswas" target="_blank" rel="noopener noreferrer" className="support-action-btn">
                  PayPal ↗
                </a>
                <a href="https://upi.com/ayanbiswas" target="_blank" rel="noopener noreferrer" className="support-action-btn">
                  UPI ↗
                </a>
              </div>
            </div>
          </article>
        </div>
      );
    }

    // Otherwise it is a standard article
    const article = BLOG_POSTS.find(p => p.id === selectedPostId);
    return (
      <div className="page-view-container fade-in">
        <button className="back-btn" onClick={handleBack}>
          ← BACK TO LOGS
        </button>

        <article className="blog-article">
          <header className="page-header" style={{ marginBottom: '24px' }}>
            <span className="page-label">
              {article?.category} • {article?.date} {article?.readTime ? `• ${article.readTime}` : ''}
            </span>
            <h1 className="page-title">
              {article?.title}
            </h1>
          </header>

          {article?.content && (
            <div className="article-body">
              {article.content.split('\n\n').map((paragraph, index) => {
                const trimmed = paragraph.trim();
                if (trimmed.startsWith('###')) {
                  return (
                    <h3 key={index} className="body-heading">
                      {trimmed.replace('###', '').trim()}
                    </h3>
                  );
                }
                if (trimmed.startsWith('-')) {
                  return (
                    <ul key={index} className="instructions-list" style={{ listStyle: 'disc' }}>
                      {trimmed.split('\n').map((li, i) => (
                        <li key={i}>{li.replace(/^-\s*/, '').trim()}</li>
                      ))}
                    </ul>
                  );
                }
                return (
                  <p key={index} className="body-para">
                    {trimmed}
                  </p>
                );
              })}

              {article.resources && (
                <div style={{ marginTop: '32px', borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
                  <h3 className="body-heading" style={{ marginTop: 0 }}>Resources & Links</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px', marginTop: '16px' }}>
                    {article.resources.map((res, i) => (
                      <div key={i} className="rom-download-subcard" style={{ padding: '16px' }}>
                        <span style={{ fontSize: '12px', fontWeight: '600', display: 'block', color: 'var(--text-dark)', marginBottom: '8px' }}>{res.title}</span>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          {res.links.map((link, idx) => (
                            <li key={idx}>
                              <a href={link.href} target="_blank" rel="noopener noreferrer" className="read-more-link" style={{ fontSize: '12px' }}>
                                {link.label}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </article>
      </div>
    );
  }

  // Render the list of posts grouped by type
  return (
    <div className="page-view-container fade-in">
      <header className="page-header">
        <h1 className="page-title">eh i do shitty stuff</h1>
      </header>

      {/* ROMs and Systems Section */}
      <h2 className="category-title" style={{ marginTop: '24px' }}>PINNED SYSTEM BUILDS</h2>
      <div className="about-games-grid" style={{ marginBottom: '40px' }}>
        {/* Dynamic Axion build card */}
        <div className="game-card-modern game-theme-ww" style={{ cursor: 'pointer' }} onClick={() => setSelectedPostId('axion-aosp')}>
          <div className="game-card-badge-modern">Android 15 ROM</div>
          <h3 className="game-card-title-modern">
            Axion AOSP {axionData?.gms?.version ? `v${axionData.gms.version}` : 'v2.2.1'}
          </h3>
          <p className="game-card-desc-modern">
            Official system build for Moto G54 (cancunf). Engineered for maximum battery efficiency, governor tuning, and high frame rates.
          </p>
          <div className="project-tech-tags">
            <span className="tech-tag">Kernel 5.15</span>
            <span className="tech-tag">MediaTek</span>
            <span className="tech-tag">AOSP</span>
          </div>
          <span className="read-more-link" style={{ marginTop: '12px', display: 'block' }}>
            VIEW DETAILS & DOWNLOADS ↗
          </span>
        </div>

        {/* LineageOS Extended build card */}
        <div className="game-card-modern game-theme-lineage" style={{ cursor: 'pointer' }} onClick={() => setSelectedPostId('lineageos-ext')}>
          <div className="game-card-badge-modern">Android 15 ROM</div>
          <h3 className="game-card-title-modern">LineageOS Extended</h3>
          <p className="game-card-desc-modern">
            Clean Lineage build featuring extended toggles, custom ROM modifications, and core kernel scheduling tweaks.
          </p>
          <div className="project-tech-tags">
            <span className="tech-tag">LineageOS</span>
            <span className="tech-tag">Cancunf</span>
            <span className="tech-tag">Vanilla</span>
          </div>
          <span className="read-more-link" style={{ marginTop: '12px', display: 'block' }}>
            VIEW DETAILS & DOWNLOADS ↗
          </span>
        </div>
      </div>

      {/* Articles Section */}
      <h2 className="category-title" style={{ marginTop: '24px' }}>GUIDES & ARCHIVES</h2>
      <div className="blog-posts-list">
        {BLOG_POSTS.filter(p => p.type === 'article').map((post) => (
          <div key={post.id} className="blog-summary-card" onClick={() => setSelectedPostId(post.id)}>
            <div className="blog-meta-row">
              <span className="blog-date">{post.date}</span>
              <span className="meta-divider">•</span>
              <span className="blog-readtime">{post.readTime}</span>
              <span className="meta-divider">•</span>
              <span style={{ color: 'var(--accent)' }}>{post.category}</span>
            </div>
            <h2 className="blog-summary-title">{post.title}</h2>
            <p className="blog-summary-excerpt">{post.excerpt}</p>
            <span className="read-more-link">READ LOG ↗</span>
          </div>
        ))}
      </div>
    </div>
  );
}

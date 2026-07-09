import { useState, useEffect } from 'react'
import { ReactLenis } from 'lenis/react'
import { PaperTexture } from '@paper-design/shaders-react'
import { FAB } from './components/FAB'
import { Hero } from './components/Hero'
import './App.css'

const WORDS = [
  'Hello',       // English
  'Bonjour',     // French
  'Ciao',        // Italian
  'Hola',        // Spanish
  'नमस्ते',       // Hindi
  'こんにちは',    // Japanese
  'Olá',         // Portuguese
  '你好',        // Chinese
  'Hallo'        // German
]

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
          { name: 'Anime', gradient: 'linear-gradient(135deg, #e05a5a, #4e1a3d)' },
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
]

const LASTFM_API_KEY = 'c0a8e935644458896a1bda5e8468ec52'
const LASTFM_USER = 'Not_ayan'
const LASTFM_PROFILE_URL = `https://www.last.fm/user/${LASTFM_USER}`

type MusicTrack = {
  title: string
  artist: string
  url: string
  imageUrl: string
  isNowPlaying: boolean
}

const FALLBACK_MUSIC_TRACK: MusicTrack = {
  title: 'babydoll',
  artist: 'boywithuke',
  url: LASTFM_PROFILE_URL,
  imageUrl: '/babydoll.png',
  isNowPlaying: false
}

function getBestLastFmImage(images?: Array<{ '#text': string; size: string }>) {
  const image = [...(images ?? [])]
    .reverse()
    .find((item) => item['#text'] && !item['#text'].includes('2a96cbd8b46e442fc41c2b86b821562f'))

  return image?.['#text'] ?? ''
}

async function getItunesArtwork(title: string, artist: string, signal: AbortSignal) {
  const params = new URLSearchParams({
    term: `${artist} ${title}`,
    media: 'music',
    entity: 'song',
    limit: '1'
  })

  const response = await fetch(`https://itunes.apple.com/search?${params.toString()}`, { signal })
  if (!response.ok) return ''

  const data = await response.json()
  const artworkUrl = data?.results?.[0]?.artworkUrl100

  return typeof artworkUrl === 'string' ? artworkUrl.replace('100x100bb', '600x600bb') : ''
}

async function getLatestMusicTrack(signal: AbortSignal): Promise<MusicTrack> {
  const params = new URLSearchParams({
    method: 'user.getrecenttracks',
    user: LASTFM_USER,
    api_key: LASTFM_API_KEY,
    format: 'json',
    limit: '1'
  })

  const response = await fetch(`https://ws.audioscrobbler.com/2.0/?${params.toString()}`, { signal })
  if (!response.ok) throw new Error('Could not load Last.fm recent tracks')

  const data = await response.json()
  const recentTrack = data?.recenttracks?.track
  const track = Array.isArray(recentTrack) ? recentTrack[0] : recentTrack

  if (!track?.name) {
    return FALLBACK_MUSIC_TRACK
  }

  const artist = track.artist?.['#text'] || track.artist?.name || 'unknown artist'
  const title = track.name
  const lastFmImage = getBestLastFmImage(track.image)
  const itunesImage = lastFmImage ? '' : await getItunesArtwork(title, artist, signal)

  return {
    title,
    artist,
    url: track.url || LASTFM_PROFILE_URL,
    imageUrl: lastFmImage || itunesImage || FALLBACK_MUSIC_TRACK.imageUrl,
    isNowPlaying: track['@attr']?.nowplaying === 'true'
  }
}

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
      )
    case 'js':
      return (
        <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="6" className="tech-svg">
          <rect x="15" y="15" width="70" height="70" rx="10" />
          <path d="M45 65 c0 5 -4 9 -9 9 c-5 0 -9 -4 -9 -9 M65 45 v20 c0 5 -4 9 -9 9" strokeLinecap="round" />
        </svg>
      )
    case 'tailwind':
      return (
        <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="6" className="tech-svg">
          <path d="M25 45 C35 30 50 30 60 40 C70 50 80 50 90 40 C80 55 65 55 55 45 C45 35 35 35 25 45 Z" fill="currentColor" />
          <path d="M10 60 C20 45 35 45 45 55 C55 65 65 65 75 55 C65 70 50 70 40 60 C30 50 20 50 10 60 Z" fill="currentColor" />
        </svg>
      )
    case 'android':
      return (
        <svg viewBox="0 0 100 100" fill="currentColor" className="tech-svg">
          <path d="M50 20 c-12 0 -22 10 -22 22 h44 c0 -12 -10 -22 -22 -22 Z M20 48 h60 v15 c0 6 -5 11 -11 11 h-38 c-6 0 -11 -5 -11 -11 Z M35 12 l-4 6 M65 12 l4 6" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
        </svg>
      )
    case 'cpp':
      return (
        <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="6" className="tech-svg">
          <circle cx="50" cy="50" r="35" />
          <path d="M45 40 h15 M45 50 h15 M45 60 h15" strokeLinecap="round" />
        </svg>
      )
    case 'java':
      return (
        <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="6" className="tech-svg">
          <path d="M30 40 c0 15 5 25 20 25 c15 0 20 -10 20 -25 h-40 Z M65 40 c5 0 10 5 10 10 c0 5 -5 10 -10 10 M35 75 c5 -5 20 -5 25 0" strokeLinecap="round" />
        </svg>
      )
    case 'figma':
      return (
        <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="6" className="tech-svg">
          <circle cx="35" cy="30" r="15" />
          <circle cx="65" cy="30" r="15" />
          <circle cx="35" cy="50" r="15" />
          <circle cx="65" cy="50" r="15" />
          <path d="M35 70 c0 8 7 15 15 15 c8 0 15 -7 15 -15 V55 H35 v15 Z" />
        </svg>
      )
    case 'css':
      return (
        <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="6" className="tech-svg">
          <rect x="20" y="15" width="60" height="70" rx="5" />
          <path d="M35 35 h30 M35 50 h25 M35 65 h30" strokeLinecap="round" />
        </svg>
      )
    default:
      return null
  }
}

function App() {
  const [wordIndex, setWordIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [exiting, setExiting] = useState(false)
  const [showContent, setShowContent] = useState(false)
  const [activeProjectIndex, setActiveProjectIndex] = useState(0)
  const [localTime, setLocalTime] = useState('')
  const [musicTrack, setMusicTrack] = useState<MusicTrack>(FALLBACK_MUSIC_TRACK)
  const [musicError, setMusicError] = useState(false)

  useEffect(() => {
    const updateTime = () => {
      const options: Intl.DateTimeFormatOptions = {
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
        timeZone: 'Asia/Kolkata'
      }
      setLocalTime(new Intl.DateTimeFormat('en-US', options).format(new Date()))
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    let isMounted = true

    const updateMusicTrack = async () => {
      try {
        const track = await getLatestMusicTrack(controller.signal)
        if (!isMounted) return

        setMusicTrack(track)
        setMusicError(false)
      } catch {
        if (!isMounted || controller.signal.aborted) return
        setMusicError(true)
      }
    }

    updateMusicTrack()
    const interval = setInterval(updateMusicTrack, 60_000)

    return () => {
      isMounted = false
      controller.abort()
      clearInterval(interval)
    }
  }, [])

  const handleNext = () => {
    setActiveProjectIndex((prev) => (prev + 1) % PROJECTS.length)
  }

  const handlePrev = () => {
    setActiveProjectIndex((prev) => (prev - 1 + PROJECTS.length) % PROJECTS.length)
  }

  const project = PROJECTS[activeProjectIndex]

  // Cycle through the greeting words
  useEffect(() => {
    if (wordIndex < WORDS.length - 1) {
      const timer = setTimeout(() => {
        setWordIndex((prev) => prev + 1)
      }, 180) // 180ms per word
      return () => clearTimeout(timer)
    } else {
      // Pause on the final word, then trigger exit transition
      const timer = setTimeout(() => {
        setExiting(true)
        const exitTimer = setTimeout(() => {
          setLoading(false)
          setShowContent(true)
        }, 850) // Transition duration matching CSS
        return () => clearTimeout(exitTimer)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [wordIndex])

  // Prevent scroll during loading
  useEffect(() => {
    if (loading) {
      document.body.classList.add('loading')
    } else {
      document.body.classList.remove('loading')
    }
    return () => {
      document.body.classList.remove('loading')
    }
  }, [loading])

  // Set up Intersection Observer for scroll animations
  useEffect(() => {
    if (!showContent) return

    const observerOptions = {
      root: null, // viewport
      rootMargin: '0px 0px -10% 0px', // trigger slightly before entering viewport fully
      threshold: 0.1 // trigger when 10% of element is visible
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-reveal')
          observer.unobserve(entry.target)
        }
      })
    }, observerOptions)

    const targets = document.querySelectorAll('.reveal-on-scroll')
    targets.forEach((target) => observer.observe(target))

    return () => {
      targets.forEach((target) => observer.unobserve(target))
    }
  }, [showContent])

  return (
    <ReactLenis root>
      {/* Global Tactile Paper Texture Overlay */}
      <div className="global-paper-overlay">
        <PaperTexture
          width="100%"
          height="100%"
          colorBack="#ffffff"
          colorFront="#cdc8c5"
          contrast={0.25}
          roughness={0.35}
          fiber={0.25}
          fiberSize={0.15}
          crumples={0.2}
          crumpleSize={0.3}
          folds={0.4}
          foldCount={4}
          drops={0.1}
          fade={0}
          seed={12.5}
          scale={0.8}
          fit="cover"
        />
      </div>
      {/* Hello Languages Loader */}
      {loading && (
        <div className={`preloader ${exiting ? 'exiting' : ''}`}>
          <div className="preloader-content">
            <span className="preloader-dot"></span>
            <span key={wordIndex} className="preloader-text">
              {WORDS[wordIndex]}
            </span>
          </div>
        </div>
      )}

      {/* Main Home Page Section */}
      <main className="hero-section" id="home">
        <Hero showContent={showContent} />
      </main>

      {/* About Info Grid Section */}
      <section className="about-section" id="about">
        <div className="about-header reveal-on-scroll delay-1">
          <h2 className="about-title-small">now you might wonder</h2>
          <h3 className="about-title-large">who is this guy even...</h3>
        </div>

        <div className="info-grid">
          {/* Box 1: Location & Bio */}
          <div className="grid-box box-1 reveal-on-scroll reveal-left delay-2">
            <h4 className="box-title">I am from Assam, India</h4>
            <p className="box-subtitle">
              <span className="cursive-text">&</span> i am a <span className="cursive-text">23 y.o</span>
            </p>
            <div className="badge-row">
              <span className="badge">student</span>
              <span className="badge">web designer</span>
              <span className="badge">web dev</span>
              <span className="badge">graphic designer</span>
            </div>
            <p className="and-more-text">and much more...</p>
          </div>

          {/* Box 2: Education Timeline */}
          <div className="grid-box box-2 reveal-on-scroll delay-3">
            <div className="timeline">
              <div className="timeline-item">
                <div className="timeline-left">
                  <div className="timeline-badge badge-coral">
                    <img src="/edu.svg" alt="Education" className="edu-icon" />
                  </div>
                  <div className="timeline-connector">
                    <span className="diamond top-diamond"></span>
                    <span className="line"></span>
                    <span className="diamond bottom-diamond"></span>
                  </div>
                </div>
                <div className="timeline-content">
                  <h5>Tezpur University</h5>
                  <p className="degree">MCA | 2025 - present</p>
                </div>
              </div>

              <div className="timeline-item">
                <div className="timeline-left">
                  <div className="timeline-badge badge-gray">
                    <img src="/edu.svg" alt="Education" className="edu-icon" />
                  </div>
                  <div className="timeline-connector last-connector">
                    <span className="diamond top-diamond"></span>
                    <span className="line"></span>
                  </div>
                </div>
                <div className="timeline-content">
                  <h5>Chaiduar College</h5>
                  <p className="degree">B. Sc | 2021 - 2024</p>
                </div>
              </div>
            </div>
          </div>

          {/* Box 3: Mesh Gradient Circle */}
          <div className="box-3-wrapper reveal-on-scroll reveal-scale delay-4">
            <div className="gradient-circle"></div>
          </div>

          {/* Box 4: Project automation & AOSP */}
          <div className="grid-box box-4 reveal-on-scroll delay-2">
            <h4 className="box-title">I automate stuff and maintain Axion AOSP</h4>
            <p className="box-subtitle-project">
              i also maintain <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="highlight-link">wallwidgy</a> and a lot of other stuff
            </p>
            
            <div className="project-cards-row">
              <div className="project-card">
                <h6>Design community</h6>
                <div className="project-links">
                  <a href="https://github.com" target="_blank" rel="noopener noreferrer">Channel ↗</a>
                  <a href="https://github.com" target="_blank" rel="noopener noreferrer">Chat ↗</a>
                </div>
              </div>

              <div className="project-card">
                <h6>Tech and stuff</h6>
                <div className="project-links">
                  <a href="https://github.com" target="_blank" rel="noopener noreferrer">Channel ↗</a>
                  <a href="https://github.com" target="_blank" rel="noopener noreferrer">Chat ↗</a>
                </div>
              </div>

              <div className="project-card">
                <h6>Wallpapers</h6>
                <div className="project-links">
                  <a href="https://github.com" target="_blank" rel="noopener noreferrer">Channel ↗</a>
                  <a href="https://github.com" target="_blank" rel="noopener noreferrer">Chat ↗</a>
                </div>
              </div>

              <div className="project-card">
                <h6>Music Dump</h6>
                <div className="project-links">
                  <a href="https://github.com" target="_blank" rel="noopener noreferrer">Channel ↗</a>
                </div>
              </div>
            </div>
          </div>

          {/* Box 5: Last.fm listening activity */}
          <div className="grid-box box-5 reveal-on-scroll reveal-right delay-3">
            <div className="music-content">
              <div className="music-text-top">
                <p className="music-label">
                  {musicError ? 'last played' : musicTrack.isNowPlaying ? 'now playing' : 'last played'}
                </p>
                <h4 className="music-title">{musicTrack.title}</h4>
                <p className="music-artist">{musicTrack.artist}</p>
              </div>
              <a href={musicTrack.url} target="_blank" rel="noopener noreferrer" className="music-link">lastfm ↗</a>
            </div>
            <div className="vinyl-container">
              <img
                src={musicTrack.imageUrl}
                alt={`${musicTrack.title} cover`}
                className="vinyl-disc-img"
                onError={(event) => {
                  event.currentTarget.src = FALLBACK_MUSIC_TRACK.imageUrl
                }}
              />
              <div className="vinyl-gloss"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Works/Projects Section */}
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
      </section>

      {/* Fanned-Out Designs Dock Redirection Section */}
      <section className="designs-dock-section">
        <div className="designs-dock-container">
          <div className="dock-cards-stack reveal-on-scroll delay-1">
            {/* Card 1: Photography - Landscape */}
            <a href="/photography" className="dock-card card-1-photo">
              <div className="card-inner">
                <div className="card-header-info">
                  <span className="card-tag">Photography</span>
                  <h4 className="card-title">light & <span className="cursive-title-text">landscapes</span></h4>
                </div>
                <div className="card-visual visual-landscape">
                  <div className="visual-shimmer"></div>
                  <div className="camera-viewfinder">
                    <span className="viewfinder-corner top-left"></span>
                    <span className="viewfinder-corner top-right"></span>
                    <span className="viewfinder-corner bottom-left"></span>
                    <span className="viewfinder-corner bottom-right"></span>
                    <div className="viewfinder-center">
                      <span className="center-cross"></span>
                      <span className="center-circle"></span>
                    </div>
                  </div>
                  <div className="visual-landscape-peak"></div>
                </div>
              </div>
            </a>

            {/* Card 2: Graphic Design - Typographic Poster */}
            <a href="/design" className="dock-card card-2-poster">
              <div className="card-inner">
                <div className="card-header-info">
                  <span className="card-tag">Poster Art</span>
                  <h4 className="card-title">visual <span className="cursive-title-text">identities</span></h4>
                </div>
                <div className="card-visual visual-poster">
                  <div className="poster-red-dot"></div>
                  <div className="poster-large-num">01</div>
                  <div className="poster-cross">＋</div>
                  <div className="poster-lines">
                    <span className="line-sm"></span>
                    <span className="line-md"></span>
                    <span className="line-lg"></span>
                  </div>
                </div>
              </div>
            </a>

            {/* Card 3: UI/UX Design - Interactive App (Center Card) */}
            <a href="/design" className="dock-card card-3-ui">
              <div className="card-inner">
                <div className="card-header-info">
                  <span className="card-tag">UI/UX Design</span>
                  <h4 className="card-title">interactive <span className="cursive-title-text">systems</span></h4>
                </div>
                <div className="card-visual visual-ui">
                  <div className="ui-mock-screen">
                    <div className="ui-mock-header">
                      <div className="ui-mock-dots">
                        <span className="mock-dot-red"></span>
                        <span className="mock-dot-yellow"></span>
                        <span className="mock-dot-green"></span>
                      </div>
                      <div className="ui-mock-address-bar"></div>
                    </div>
                    <div className="ui-mock-body">
                      <div className="ui-mock-hero-bar"></div>
                      <div className="ui-mock-row">
                        <div className="ui-mock-circle"></div>
                        <div className="ui-mock-text-block"></div>
                      </div>
                      <div className="ui-mock-row">
                        <div className="ui-mock-circle"></div>
                        <div className="ui-mock-text-block"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </a>

            {/* Card 4: Graphic Design - Branding Monogram */}
            <a href="/design" className="dock-card card-4-brand">
              <div className="card-inner">
                <div className="card-header-info">
                  <span className="card-tag">Branding</span>
                  <h4 className="card-title">modern <span className="cursive-title-text">logos</span></h4>
                </div>
                <div className="card-visual visual-brand">
                  <div className="brand-monogram-circle">
                    <div className="brand-monogram-text">AD</div>
                    <div className="brand-monogram-orbit"></div>
                  </div>
                  <div className="brand-grid-pattern"></div>
                </div>
              </div>
            </a>

            {/* Card 5: Photography - Street / Monochrome */}
            <a href="/photography" className="dock-card card-5-street">
              <div className="card-inner">
                <div className="card-header-info">
                  <span className="card-tag">Street Photography</span>
                  <h4 className="card-title">shadow & <span className="cursive-title-text">spaces</span></h4>
                </div>
                <div className="card-visual visual-street">
                  <div className="street-guidelines">
                    <span className="guide-line horiz-1"></span>
                    <span className="guide-line horiz-2"></span>
                    <span className="guide-line vert-1"></span>
                    <span className="guide-line vert-2"></span>
                  </div>
                  <div className="street-shadow-cast"></div>
                  <div className="street-sun-spot"></div>
                </div>
              </div>
            </a>
          </div>

          {/* The Pill-shaped Redirection Dock Bar */}
          <div className="dock-pill reveal-on-scroll reveal-scale delay-2">
            <div className="dock-pill-prompt">
              <span className="prompt-sparkle">✦</span>
              <span className="prompt-text">checkout the designs</span>
            </div>
            <div className="dock-pill-actions">
              <a href="/photography" className="dock-pill-btn btn-pill-photography">
                <span>Photography</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="btn-icon-svg">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                  <circle cx="12" cy="13" r="4" />
                </svg>
              </a>
              <a href="/design" className="dock-pill-btn btn-pill-design">
                <span>Graphic Design</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="btn-icon-svg">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="skills-section" id="skills">
        <div className="skills-container">
          {/* Left Column: Narrative & CTA */}
          <div className="skills-left reveal-on-scroll reveal-left delay-1">
            <span className="skills-sub">my expertise</span>
            <h2 className="skills-main-title">
              crafting digital <span className="cursive-title-text">experiences</span> & solid code.
            </h2>
            <p className="skills-philosophy">
              Specializing in building premium frontends, optimizing user interfaces, and custom OS development. I focus on details that make software unforgettable.
            </p>
            <div className="skills-cta-box">
              <span className="cta-spark">✦</span>
              <p className="cta-text">Always open to learning new technologies and hacking on interesting projects.</p>
            </div>
          </div>
          
          {/* Right Column: Skills Categories */}
          <div className="skills-right">
            <div className="skills-category reveal-on-scroll delay-2">
              <h3 className="category-title">01 / Frontend & Dev</h3>
              <ul className="skills-list">
                <li className="skill-item">
                  <span className="skill-num">01</span>
                  <span className="skill-name">React & React Native</span>
                  <span className="skill-dot"></span>
                </li>
                <li className="skill-item">
                  <span className="skill-num">02</span>
                  <span className="skill-name">TypeScript / JavaScript</span>
                  <span className="skill-dot"></span>
                </li>
                <li className="skill-item">
                  <span className="skill-num">03</span>
                  <span className="skill-name">TailwindCSS & CSS Grid</span>
                  <span className="skill-dot"></span>
                </li>
                <li className="skill-item">
                  <span className="skill-num">04</span>
                  <span className="skill-name">HTML5 / Semantic Web</span>
                  <span className="skill-dot"></span>
                </li>
              </ul>
            </div>

            <div className="skills-category reveal-on-scroll delay-3">
              <h3 className="category-title">02 / Design & Creative</h3>
              <ul className="skills-list">
                <li className="skill-item">
                  <span className="skill-num">05</span>
                  <span className="skill-name">UI/UX Design Systems</span>
                  <span className="skill-dot"></span>
                </li>
                <li className="skill-item">
                  <span className="skill-num">06</span>
                  <span className="skill-name">Figma prototyping</span>
                  <span className="skill-dot"></span>
                </li>
                <li className="skill-item">
                  <span className="skill-num">07</span>
                  <span className="skill-name">Graphic Design & Vectors</span>
                  <span className="skill-dot"></span>
                </li>
                <li className="skill-item">
                  <span className="skill-num">08</span>
                  <span className="skill-name">Typography & Layouts</span>
                  <span className="skill-dot"></span>
                </li>
              </ul>
            </div>

            <div className="skills-category reveal-on-scroll delay-4">
              <h3 className="category-title">03 / Systems & Core</h3>
              <ul className="skills-list">
                <li className="skill-item">
                  <span className="skill-num">09</span>
                  <span className="skill-name">Android ROMs & AOSP</span>
                  <span className="skill-dot"></span>
                </li>
                <li className="skill-item">
                  <span className="skill-num">10</span>
                  <span className="skill-name">C++ / Java development</span>
                  <span className="skill-dot"></span>
                </li>
                <li className="skill-item">
                  <span className="skill-num">11</span>
                  <span className="skill-name">Git & Command Line</span>
                  <span className="skill-dot"></span>
                </li>
                <li className="skill-item">
                  <span className="skill-num">12</span>
                  <span className="skill-name">Automation & Scripting</span>
                  <span className="skill-dot"></span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* GitHub Contribution Graph Section */}
      <section className="github-section">
        <div className="github-container">
          <h2 className="github-title reveal-on-scroll reveal-left delay-1">github activity.</h2>
          <div className="github-graph-wrapper reveal-on-scroll reveal-scale delay-2">
            {/* DESKTOP LAYOUT */}
            <div className="github-desktop-layout">
              <div className="github-graph-header">
                <div className="github-graph-header-left">
                  <span className="github-graph-dot-indicator"></span>
                  <span className="github-graph-user">github / ayanbiswas</span>
                </div>
                <div className="github-graph-header-right">
                  <span className="github-graph-badge">active contributions</span>
                </div>
              </div>
              
              <div className="github-graph-main">
                <div className="github-graph-days">
                  <span className="day-empty"></span>
                  <span>Mon</span>
                  <span className="day-empty"></span>
                  <span>Wed</span>
                  <span className="day-empty"></span>
                  <span>Fri</span>
                  <span className="day-empty"></span>
                </div>
                <div className="github-graph-scroll-container">
                  <div className="github-graph-inner">
                    <div className="github-graph-months">
                      <span>Jan</span>
                      <span>Feb</span>
                      <span>Mar</span>
                      <span>Apr</span>
                      <span>May</span>
                      <span>Jun</span>
                      <span>Jul</span>
                      <span>Aug</span>
                      <span>Sep</span>
                      <span>Oct</span>
                      <span>Nov</span>
                      <span>Dec</span>
                    </div>
                    <div className="github-graph">
                      {Array.from({ length: 7 * 53 }).map((_, i) => {
                        const hash = (i * 37 + (i % 7) * 23 + (i % 13) * 17) % 100;
                        let level = 0;
                        if (hash < 14) level = 1;
                        else if (hash < 25) level = 2;
                        else if (hash < 33) level = 3;
                        else if (hash < 39) level = 4;
                        return (
                          <span
                            key={i}
                            className={`contrib-square level-${level}`}
                            title={`Contribution index: ${i}`}
                          ></span>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              <div className="github-graph-footer">
                <span className="contrib-total">2,345 contributions in the last year</span>
                <div className="github-graph-legend">
                  <span>Less</span>
                  <span className="contrib-square level-0"></span>
                  <span className="contrib-square level-1"></span>
                  <span className="contrib-square level-2"></span>
                  <span className="contrib-square level-3"></span>
                  <span className="contrib-square level-4"></span>
                  <span>More</span>
                </div>
              </div>
            </div>

            {/* MOBILE LAYOUT */}
            <div className="github-mobile-layout">
              <div className="github-mobile-header">
                <div className="github-profile-row">
                  <div className="github-avatar-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mobile-github-svg">
                      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                    </svg>
                  </div>
                  <div className="github-username-info">
                    <span className="github-mobile-user">ayanbiswas</span>
                    <span className="github-mobile-status"><span className="status-dot"></span>Active</span>
                  </div>
                </div>
              </div>

              <div className="github-stats-grid">
                <div className="github-stat-card">
                  <span className="stat-label">Contributions</span>
                  <span className="stat-value">2,345</span>
                  <span className="stat-sub">past year</span>
                </div>
                <div className="github-stat-card">
                  <span className="stat-label">Current Streak</span>
                  <span className="stat-value">12 days</span>
                  <span className="stat-sub">active now</span>
                </div>
                <div className="github-stat-card">
                  <span className="stat-label">Daily Avg</span>
                  <span className="stat-value">6.4</span>
                  <span className="stat-sub">commits/day</span>
                </div>
                <div className="github-stat-card">
                  <span className="stat-label">Main Language</span>
                  <span className="stat-value">TypeScript</span>
                  <span className="stat-sub">94% of repos</span>
                </div>
              </div>

              <div className="github-mobile-graph-section">
                <div className="mobile-graph-title">Recent Activity (Last 12 Weeks)</div>
                <div className="github-mobile-graph-container">
                  <div className="github-graph-days">
                    <span className="day-empty"></span>
                    <span>Mon</span>
                    <span className="day-empty"></span>
                    <span>Wed</span>
                    <span className="day-empty"></span>
                    <span>Fri</span>
                    <span className="day-empty"></span>
                  </div>
                  <div className="github-graph-scroll-container">
                    <div className="github-graph-inner">
                      <div className="github-graph-months">
                        <span>Oct</span>
                        <span>Nov</span>
                        <span>Dec</span>
                      </div>
                      <div className="github-graph mobile-only-grid">
                        {Array.from({ length: 7 * 12 }).map((_, i) => {
                          const hash = (i * 47 + (i % 7) * 19 + (i % 11) * 23) % 100;
                          let level = 0;
                          if (hash < 18) level = 1;
                          else if (hash < 32) level = 2;
                          else if (hash < 44) level = 3;
                          else if (hash < 52) level = 4;
                          return (
                            <span
                              key={i}
                              className={`contrib-square level-${level}`}
                            ></span>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="github-recent-pushes">
                <div className="push-feed-header">Latest Commits</div>
                <div className="push-item">
                  <span className="push-time">2 hours ago</span>
                  <p className="push-message">feat: added lenis smooth scrolling</p>
                </div>
                <div className="push-item">
                  <span className="push-time">1 day ago</span>
                  <p className="push-message">refactor: optimized mobile layout grid</p>
                </div>
            </div>
          </div>
          </div>
        </div>
      </section>

      {/* Contact Section - Modern Digital Grid */}
      <section className="contact-section" id="contact">
        <div className="contact-grid-overlay"></div>
        
        <div className="contact-container">
          <div className="contact-header reveal-on-scroll reveal-left delay-1">
            <h2 className="contact-main-title">get in touch.</h2>
          </div>

          <div className="contact-grid">
            {/* Box 1: Collaboration */}
            <div className="contact-box contact-box-collab reveal-on-scroll reveal-left delay-2">
              <h3 className="contact-box-title">let's build something.</h3>
              <p className="contact-box-desc">
                Looking for a premium frontend interface, custom Android OS optimization, or a striking digital design? Let's collaborate.
              </p>
              <div className="contact-info-tags">
                <span className="info-tag">Freelance</span>
                <span className="info-tag">Contracts</span>
                <span className="info-tag">Full-time Roles</span>
              </div>
            </div>

            {/* Box 2: Status & Location */}
            <div className="contact-box contact-box-status reveal-on-scroll delay-3">
              <span className="status-label">CURRENT STATUS</span>
              <div className="status-indicator-row">
                <span className="pulse-dot"></span>
                <span className="status-text">Available for new opportunities</span>
              </div>
              <div className="location-info">
                <span className="location-label">BASED IN</span>
                <p className="location-text">Assam, India 🇮🇳</p>
              </div>
            </div>

            {/* Box 3: Direct Email */}
            <div className="contact-box contact-box-email reveal-on-scroll delay-2">
              <h4 className="email-label">DIRECT EMAIL</h4>
              <a href="mailto:ayan98542@gmail.com" className="email-address-link">
                ayan98542@gmail.com
              </a>
              <div className="email-actions">
                <a href="mailto:ayan98542@gmail.com" className="email-btn-send">
                  SEND MESSAGE <span className="arrow">↗</span>
                </a>
              </div>
            </div>

            {/* Box 4: Social Channels */}
            <div className="contact-box contact-box-socials reveal-on-scroll reveal-right delay-3">
              <h4 className="socials-label">DIGITAL SPACES</h4>
              <div className="socials-grid-links">
                <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="social-grid-item">
                  <span className="social-name">Twitter / X</span>
                  <span className="social-arrow">↗</span>
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-grid-item">
                  <span className="social-name">Instagram</span>
                  <span className="social-arrow">↗</span>
                </a>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="social-grid-item">
                  <span className="social-name">GitHub</span>
                  <span className="social-arrow">↗</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dark Editorial Footer Section */}
      <footer className="footer-section">
        <div className="footer-watermark">THANK YOU</div>
        
        <div className="footer-container">
          <div className="footer-left">
            <div className="footer-logo-badge">
              <span className="logo-text">av</span>
            </div>
            <h3 className="footer-name">ayan biswas</h3>
            <p className="footer-copyright">all rights reserved.</p>
          </div>

          <div className="footer-right">
            <div className="footer-column">
              <span className="column-label">Pages</span>
              <a href="#" className="footer-link">Home</a>
              <a href="#projects" className="footer-link">Projects</a>
            </div>

            <div className="footer-column">
              <span className="column-label">Navigation</span>
              <a href="#" className="footer-link back-to-top">
                Back to Top <span className="arrow-up">↑</span>
              </a>
            </div>
            
            <div className="footer-column">
              <span className="column-label">Contact</span>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="footer-link">Instagram</a>
              <a href="mailto:ayan98542@gmail.com" className="footer-link">Email</a>
            </div>
          </div>
        </div>

        <div className="footer-bottom-row">
          <div className="footer-status">
            <span className="status-dot"></span>
            <span>Available for freelance, contracts & full-time roles</span>
          </div>
          <div className="footer-time">
            <span>Assam, India — {localTime}</span>
          </div>
        </div>
      </footer>

      {/* Floating Action Button Quick Navigation */}
      <FAB />
    </ReactLenis>
  )
}

export default App

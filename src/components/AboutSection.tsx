interface AboutSectionProps {
  musicTrack: {
    title: string;
    artist: string;
    url: string;
    imageUrl: string;
    isNowPlaying: boolean;
  };
  musicError: boolean;
  FALLBACK_MUSIC_TRACK: {
    title: string;
    artist: string;
    url: string;
    imageUrl: string;
    isNowPlaying: boolean;
  };
}

export function AboutSection({ musicTrack, musicError, FALLBACK_MUSIC_TRACK }: AboutSectionProps) {
  return (
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
  );
}

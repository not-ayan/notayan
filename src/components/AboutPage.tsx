import { useState, useEffect } from 'react';

const infoWidgets = [
  { title: "Typing Speed", value: "68", unit: "WPM" },
  { title: "Timezone", value: "+5:30", unit: "IST / GMT" },
  { title: "Nationality", value: "IND", unit: "(Indian)" },
  { title: "Favorites", value: "Dog", unit: "Yes" },
  { title: "Caffeine Intake", value: "250", unit: "mg/d" },
  { title: "CSE CGPA", value: "7.90", unit: "OUT OF 10.0" },
  { title: "Education", value: "MCA", unit: "Tezpur Univ." },
  { title: "Personality", value: "God", unit: "Complex" }
];

const gamesList = [
  {
    title: "Clash of Clans",
    genre: "Strategy",
    description: "Supercell's strategy game. Train troops, build layouts, and participate in Clan Wars.",
    platforms: [
      { label: "iOS", href: "https://apps.apple.com/us/app/clash-of-clans/id529479190" },
      { label: "Android", href: "https://play.google.com/store/apps/details?id=com.supercell.clashofclans" }
    ],
    accounts: [
      { name: "『 WeeD々AyaN』", tag: "#PPY9Q0JYU" },
      { name: "Notayan", tag: "#2QCUR28C0" }
    ]
  },
  {
    title: "Wuthering Waves",
    genre: "ARPG",
    description: "A beautiful open-world action RPG featuring resonator combat mechanics and traversal systems.",
    platforms: [
      { label: "PC", href: "https://download.kurogames.net" },
      { label: "iOS", href: "https://apps.apple.com/us/app/wuthering-waves/id6475033368" },
      { label: "Android", href: "https://play.google.com/store/apps/details?id=com.kurogame.wuthering.waves.global" }
    ]
  },
  {
    title: "DBZ: Sparking Zero",
    genre: "Fighting",
    description: "Next-gen Dragon Ball arena fighter featuring destructible environments and a massive roster.",
    platforms: [
      { label: "PC", href: "https://store.steampowered.com/app/1790600/DRAGON_BALL_Sparking_ZERO/" },
      { label: "PS5", href: "https://store.playstation.com" },
      { label: "Xbox", href: "https://www.xbox.com" }
    ]
  },
  {
    title: "Devil May Cry 5",
    genre: "Action",
    description: "High-octane, combo-driven action game featuring Dante, Nero, and V demon-slaying styles.",
    platforms: [
      { label: "PC", href: "https://store.steampowered.com/app/601150/Devil_May_Cry_5/" },
      { label: "PS5", href: "https://www.playstation.com" },
      { label: "Xbox", href: "https://www.xbox.com" }
    ]
  }
];

interface LastFMTrack {
  name: string;
  artist: {
    "#text": string;
    name?: string;
  };
  album?: {
    "#text": string;
  };
  image?: string;
  url: string;
  "@attr"?: {
    nowplaying: "true" | "false";
  };
}

interface LastFMTopArtist {
  name: string;
  playcount: string;
  url: string;
}

interface LastFMStats {
  user: {
    playcount: string;
    name: string;
    url: string;
    realname?: string;
    registered?: {
      unixtime: string;
    };
    image?: { "#text": string; size: string }[];
  };
  recentTracks?: LastFMTrack[];
  topArtist?: LastFMTopArtist;
  topTracks?: LastFMTrack[];
  weeklyPlaycount?: string;
}

interface AboutPageProps {
  username: string;
  apiKey: string;
}

export function AboutPage({ username, apiKey }: AboutPageProps) {
  const [stats, setStats] = useState<LastFMStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const baseUrl = "https://ws.audioscrobbler.com/2.0";

        const [userInfo, recentTracks, topArtists, topTracks, weeklyChart] = await Promise.all([
          fetch(`${baseUrl}/?method=user.getinfo&user=${username}&api_key=${apiKey}&format=json`).then((res) => res.json().catch(() => null)),
          fetch(`${baseUrl}/?method=user.getrecenttracks&user=${username}&api_key=${apiKey}&format=json&limit=8`).then((res) => res.json().catch(() => null)),
          fetch(`${baseUrl}/?method=user.gettopartists&user=${username}&api_key=${apiKey}&format=json&limit=1&period=overall`).then((res) => res.json().catch(() => null)),
          fetch(`${baseUrl}/?method=user.gettoptracks&user=${username}&api_key=${apiKey}&format=json&limit=1&period=overall`).then((res) => res.json().catch(() => null)),
          fetch(`${baseUrl}/?method=user.getweeklytrackchart&user=${username}&api_key=${apiKey}&format=json`).then((res) => res.json().catch(() => null)),
        ]);

        const recentTracksList = recentTracks?.recenttracks?.track?.map((track: any) => {
          const imgUrl = track.image?.find((i: any) => i.size === 'extralarge' || i.size === 'large')?.['#text'] || track.image?.[0]?.['#text'] || '';
          return {
            name: track.name,
            artist: track.artist,
            album: track.album,
            image: imgUrl,
            url: track.url,
            "@attr": track["@attr"],
          };
        }) || [];

        const topArtist = topArtists?.topartists?.artist?.[0];

        const topTracksList = topTracks?.toptracks?.track?.map((track: any) => ({
          name: track.name,
          artist: { "#text": track.artist?.name || "" },
          url: track.url,
          playcount: track.playcount,
        })) || [];

        const weeklyPlaycount = weeklyChart?.weeklytrackchart?.["@attr"]?.total || "0";

        if (userInfo && userInfo.user) {
          setStats({
            user: userInfo.user,
            recentTracks: recentTracksList,
            topArtist: topArtist ? {
              name: topArtist.name,
              playcount: topArtist.playcount,
              url: topArtist.url,
            } : undefined,
            topTracks: topTracksList,
            weeklyPlaycount,
          });
        }
      } catch (error) {
        console.error("Error fetching LastFM stats:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
    const interval = setInterval(fetchStats, 60000);
    return () => clearInterval(interval);
  }, [username, apiKey]);

  return (
    <div className="page-view-container fade-in">
      <header className="page-header">
        <span className="page-label">eh me?</span>
        <h1 className="page-title">about me.</h1>
      </header>

      {/* Biography Section */}
      <h2 className="category-title" style={{ marginTop: '24px' }}>BIOGRAPHY</h2>
      <div className="about-md-body" style={{ padding: '0 0 24px 0', marginBottom: '24px' }}>
        <p className="body-para">
          A no-shame self-proclaimed ace of all trades, I learn things based
          on my whim and needs. A fast learner, yet a slow practitioner. Brain
          cell counts are pretty low to say the least but they're doing
          their best lmao. I don't like bad design and aesthetics. Retro
          is amazing and modern is minimal. Make things good, not just work.
          Not picky about food and stuffs but I really love spiciness. Not
          really into movies and shit but if you wanna talk about anime,
          I'm your man.
        </p>
      </div>

      {/* Skill Issue Section */}
      <h2 className="category-title" style={{ marginTop: '24px' }}>SKILL ISSUE</h2>
      <div className="about-md-body" style={{ padding: '16px 0 24px 0', marginBottom: '24px' }}>
        <div className="about-widget-grid">
          {infoWidgets.map((item, i) => (
            <div key={i} className="about-widget-card">
              <div className="about-widget-header">
                {item.title}
              </div>
              <div className="about-widget-body">
                <span className="about-widget-val">{item.value}</span>
                <span className="about-widget-unit">{item.unit}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Last.fm Music Section */}
      <h2 className="category-title" style={{ marginTop: '24px' }}>LAST.FM MUSIC & SCROBBLES</h2>
      <div className="about-md-body" style={{ padding: '0 0 24px 0', marginBottom: '24px' }}>
        {loading ? (
          <p className="body-para" style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Loading music stats...</p>
        ) : stats ? (
          <div>
            {/* Profile Info Row */}
            <div className="lastfm-profile-card">
              <img
                src={stats.user.image?.[2]?.['#text'] || '/profpic.jpg'}
                alt={stats.user.name}
                className="lastfm-avatar"
                onError={(e) => { e.currentTarget.src = '/profpic.jpg' }}
              />
              <div className="lastfm-profile-details">
                <span className="lastfm-username">@{stats.user.name}</span>
                <span className="lastfm-realname">{stats.user.realname || 'Ayan Biswas'}</span>
                {stats.user.registered && (
                  <span className="lastfm-registered">
                    Scrobbled since {new Date(Number(stats.user.registered.unixtime) * 1000).toLocaleDateString()}
                  </span>
                )}
              </div>
              <a
                href={stats.user.url}
                target="_blank"
                rel="noopener noreferrer"
                className="rom-download-action-btn secondary-btn"
                style={{ width: 'auto', padding: '8px 16px', fontSize: '12px' }}
              >
                View Profile
              </a>
            </div>

            <p className="body-para" style={{ fontSize: '14px', marginBottom: '20px' }}>
              And here is the fun part! My music taste is all over the place in the best way. I am big on South Asian indie, especially the hidden gems like Umer Anjum, Natasha Noorani, and Talal Qureshi. Emotional lyrics, slick production, and that local meets global vibe? I am all in.
            </p>
            <p className="body-para" style={{ fontSize: '14px', marginBottom: '24px' }}>
              I have got a soft spot for hiphop, soft tracks and glitchy electronic sounds. My playlists are a mix of mellow indie and experimental beats, I don't gatekeep, I just vibe. Good music is good music after all!
            </p>

            {/* Stats & Weekly Chart */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4" style={{ marginBottom: '32px' }}>
              <div className="lastfm-stat-box">
                <span className="lastfm-stat-lbl">Total Scrobbles</span>
                <span className="lastfm-stat-val">{Number(stats.user.playcount).toLocaleString()}</span>
              </div>
              {stats.topArtist && (
                <div className="lastfm-stat-box">
                  <span className="lastfm-stat-lbl">Top Artist</span>
                  <span className="lastfm-stat-val" style={{ fontSize: '16px', fontWeight: '600' }}>{stats.topArtist.name}</span>
                  <span className="lastfm-stat-lbl" style={{ fontSize: '9px', marginTop: '2px' }}>
                    {Number(stats.topArtist.playcount).toLocaleString()} plays
                  </span>
                </div>
              )}
              {stats.topTracks && stats.topTracks[0] && (
                <div className="lastfm-stat-box">
                  <span className="lastfm-stat-lbl">Top Track</span>
                  <span className="lastfm-stat-val" style={{ fontSize: '16px', fontWeight: '600' }}>{stats.topTracks[0].name}</span>
                  <span className="lastfm-stat-lbl" style={{ fontSize: '9px', marginTop: '2px' }}>
                    by {stats.topTracks[0].artist['#text']}
                  </span>
                </div>
              )}
            </div>

            {/* 2-Column Recent Tracks List matching Realm */}
            <h3 className="category-title" style={{ fontSize: '13px', marginBottom: '16px', fontFamily: 'var(--mono)' }}>
              Recent Tracks
            </h3>
            <div className="lastfm-track-grid">
              {stats.recentTracks?.map((track, idx) => (
                <div key={idx} className="lastfm-track-card">
                  <div className="lastfm-track-main">
                    <img
                      src={track.image || '/profpic.jpg'}
                      alt={track.name}
                      className="lastfm-track-art"
                      onError={(e) => { e.currentTarget.src = '/profpic.jpg' }}
                    />
                    <div className="lastfm-track-info">
                      <span className="lastfm-track-title truncate" title={track.name}>
                        {track.name}
                      </span>
                      <span className="lastfm-track-artist truncate" title={track.artist['#text']}>
                        {track.artist['#text']}
                      </span>
                      <span className="lastfm-track-album truncate" title={track.album?.['#text']}>
                        {track.album?.['#text'] || 'Single'}
                      </span>
                    </div>
                  </div>
                  <div className="lastfm-track-actions">
                    <a
                      href={track.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="game-link-badge text-center"
                      style={{ padding: '6px 8px' }}
                    >
                      LastFM
                    </a>
                    <a
                      href={`https://www.youtube.com/results?search_query=${encodeURIComponent(`${track.name} - ${track.artist['#text']}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="game-link-badge text-center"
                      style={{ padding: '6px 8px' }}
                    >
                      YouTube
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="body-para" style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Could not load scrobbler stats.</p>
        )}
      </div>



      {/* Redesigned Games Section */}
      <h2 className="category-title" style={{ marginTop: '24px' }}>We do a bit of gaming</h2>
      <div className="about-md-body" style={{ padding: '16px 0 0 0' }}>
        <div className="about-games-grid">
          {gamesList.map((game, i) => {
            const themeClass =
              game.title === "Clash of Clans" ? "game-theme-coc" :
                game.title === "Wuthering Waves" ? "game-theme-ww" :
                  game.title === "DBZ: Sparking Zero" ? "game-theme-dbz" :
                    "game-theme-dmc";

            return (
              <div key={i} className={`game-card-modern ${themeClass}`}>
                <div className="game-card-badge-modern">{game.genre}</div>
                <h3 className="game-card-title-modern">{game.title}</h3>
                <p className="game-card-desc-modern">{game.description}</p>

                {game.accounts && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
                    {game.accounts.map((acc, idx) => (
                      <div key={idx} className="coc-account-badge">
                        <span className="coc-acc-title">{acc.name}</span>
                        <span className="coc-acc-id">{acc.tag}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="game-spec-links" style={{ marginTop: 'auto' }}>
                  {game.platforms.map((plat, idx) => (
                    <a
                      key={idx}
                      href={plat.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="game-link-badge-modern"
                    >
                      {plat.label}
                      <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block' }}>
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                      </svg>
                    </a>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

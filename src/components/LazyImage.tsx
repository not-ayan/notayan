import { useRef, useState, useEffect } from 'react';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  /** Set true for above-the-fold images — skips lazy entirely */
  priority?: boolean;
  /**
   * native=true  → sets src immediately, uses browser's built-in loading="lazy"
   *                 Use for masonry/flow layouts where height must be known upfront
   * native=false → IntersectionObserver defers src until near viewport
   *                 Use for fixed-height containers (project banners, logos)
   */
  native?: boolean;
}

function toJxlSrc(src: string): string {
  return src.replace(/\.(webp|png|jpg|jpeg)$/i, '.jxl');
}

export function LazyImage({
  src,
  alt,
  className = '',
  style,
  onClick,
  priority = false,
  native = false,
}: LazyImageProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  
  // Start loaded if priority is true
  const [loaded, setLoaded] = useState(priority);

  // ── IntersectionObserver mode ──────────────────────────────────────
  const [activeSrc, setActiveSrc] = useState<string>(
    priority || native ? src : ''
  );

  useEffect(() => {
    // If browser already completed loading (from cache), set loaded immediately
    if (imgRef.current?.complete) {
      setLoaded(true);
    }
  }, [activeSrc]);

  useEffect(() => {
    if (priority || native) return;
    const el = imgRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActiveSrc(src);
          io.disconnect();
        }
      },
      { rootMargin: '300px' }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [src, priority, native]);

  const effectiveSrc = native || priority ? src : activeSrc;
  const jxlSrc = effectiveSrc ? toJxlSrc(effectiveSrc) : '';

  return (
    <picture>
      {jxlSrc && <source srcSet={jxlSrc} type="image/jxl" />}
      {effectiveSrc && <source srcSet={effectiveSrc} type="image/webp" />}
      <img
        ref={imgRef}
        src={effectiveSrc || undefined}
        alt={alt}
        className={`lazy-img${loaded ? ' lazy-img--loaded' : ''} ${className}`}
        style={style}
        onLoad={() => setLoaded(true)}
        onClick={onClick}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        fetchPriority={priority ? 'high' : 'low'}
      />
    </picture>
  );
}

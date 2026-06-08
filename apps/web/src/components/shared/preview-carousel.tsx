'use client';

import { cn } from '@repo/ui';
import Image, { type StaticImageData } from 'next/image';
import { useCallback, useEffect, useState } from 'react';

import preview1 from '@/assets/preview-1.png';
import preview2 from '@/assets/preview-2.png';
import preview3 from '@/assets/preview-3.png';

const slides: { src: StaticImageData; alt: string }[] = [
  { src: preview1, alt: 'Project dashboard preview' },
  { src: preview2, alt: 'Workspace preview' },
  { src: preview3, alt: 'Analytics preview' },
];

const AUTOPLAY_MS = 5000;

/**
 * Product preview carousel. Prev/next controls only appear on hover or keyboard focus; the
 * dot indicators always show which slide is active. Autoplay advances slides but pauses on
 * hover/focus and is disabled entirely for users who prefer reduced motion. Controls are
 * real buttons with labels and visible focus rings, so the carousel is usable by keyboard.
 */
export function PreviewCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [playing, setPlaying] = useState(true);

  const go = useCallback((to: number) => setIndex((to + slides.length) % slides.length), []);

  useEffect(() => {
    if (!playing || paused) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = window.setInterval(() => setIndex((v) => (v + 1) % slides.length), AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [playing, paused, index]);

  return (
    <div
      className="group relative overflow-hidden rounded-xl border border-border shadow-2xl"
      aria-roledescription="carousel"
      aria-label="Product preview"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div
        className="flex transition-transform duration-700 ease-out motion-reduce:transition-none"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {slides.map((slide, i) => (
          <div
            key={slide.alt}
            className="relative aspect-[16/9] w-full shrink-0"
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${slides.length}`}
            aria-hidden={i !== index}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              sizes="(max-width: 1024px) 100vw, 1024px"
              className="object-cover"
              priority={i === 0}
            />
          </div>
        ))}
      </div>

      <button
        type="button"
        aria-label="Previous slide"
        onClick={() => go(index - 1)}
        className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background/70 text-foreground opacity-0 shadow-sm backdrop-blur transition hover:bg-background focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background group-hover:opacity-100"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5"
          aria-hidden="true"
        >
          <path d="m15 18-6-6 6-6" />
        </svg>
      </button>
      <button
        type="button"
        aria-label="Next slide"
        onClick={() => go(index + 1)}
        className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background/70 text-foreground opacity-0 shadow-sm backdrop-blur transition hover:bg-background focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background group-hover:opacity-100"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5"
          aria-hidden="true"
        >
          <path d="m9 18 6-6-6-6" />
        </svg>
      </button>

      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full border border-border bg-background/70 py-2 pl-2 pr-3 shadow-sm backdrop-blur">
        <button
          type="button"
          aria-label={playing ? 'Pause automatic slideshow' : 'Play automatic slideshow'}
          aria-pressed={!playing}
          onClick={() => setPlaying((p) => !p)}
          className="mr-0.5 flex h-5 w-5 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {playing ? (
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-3 w-3">
              <rect x="6" y="5" width="4" height="14" rx="1" />
              <rect x="14" y="5" width="4" height="14" rx="1" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-3 w-3">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>
        {slides.map((slide, i) => (
          <button
            key={slide.alt}
            type="button"
            aria-label={`Go to slide ${i + 1}`}
            aria-current={i === index}
            onClick={() => go(i)}
            className={cn(
              'h-1.5 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
              i === index
                ? 'w-5 bg-foreground'
                : 'w-1.5 bg-muted-foreground/40 hover:bg-muted-foreground',
            )}
          />
        ))}
      </div>
    </div>
  );
}

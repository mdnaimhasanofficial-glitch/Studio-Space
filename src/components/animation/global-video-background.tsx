"use client";

import { useEffect, useRef } from "react";

/**
 * Fixed, site-wide background video (stage lights) at `-z-10` — it paints
 * above the body background colour but below every page element, so it only
 * shows through the gaps between content. A semi-opaque veil keeps text
 * readable in both themes.
 */
export function GlobalVideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    const tryPlay = () => void video.play().catch(() => {});
    if (video.readyState >= 3) tryPlay();
    else video.addEventListener("canplay", tryPlay, { once: true });
    // Resume after the tab was backgrounded and autoplay was suspended.
    const onVisible = () => {
      if (document.visibilityState === "visible") tryPlay();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      video.removeEventListener("canplay", tryPlay);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <video
        ref={videoRef}
        className="size-full object-cover"
        src="/videos/global-stage-lights.mp4"
        poster="/videos/global-stage-lights-poster.jpg"
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        tabIndex={-1}
      />
      {/* Veil to keep the UI readable above the moving video. */}
      <div className="absolute inset-0 bg-background/70" />
    </div>
  );
}

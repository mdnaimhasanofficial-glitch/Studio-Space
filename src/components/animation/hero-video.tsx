"use client";

import { useEffect, useRef } from "react";

/**
 * Muted, looping studio video that fills the hero banner behind the copy.
 * `muted` is enforced in an effect (belt-and-braces alongside the attribute)
 * so autoplay is always allowed and the clip stays silent.
 */
export function HeroVideo() {
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
    <video
      ref={videoRef}
      className="absolute inset-0 size-full object-cover"
      src="/videos/hero-studio-camera.mp4"
      poster="/videos/hero-studio-camera-poster.jpg"
      autoPlay
      loop
      muted
      playsInline
      preload="metadata"
      tabIndex={-1}
      aria-hidden
    />
  );
}

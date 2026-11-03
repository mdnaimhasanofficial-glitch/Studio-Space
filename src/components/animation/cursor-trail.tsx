"use client";

import { useEffect, useRef } from "react";

/**
 * Staggered trail of dots that follow the cursor. Each dot eases toward the
 * pointer at a different rate — lower `ease` = lags further behind, which
 * is what turns a single point into a trailing tail.
 */
const TRAIL_DOTS = [
  { size: "size-2", ease: 0.38, tone: "bg-primary" },
  { size: "size-1.5", ease: 0.28, tone: "bg-primary/80" },
  { size: "size-1", ease: 0.2, tone: "bg-primary/60" },
  { size: "size-1", ease: 0.14, tone: "bg-primary/40" },
  { size: "size-1", ease: 0.09, tone: "bg-primary/25" },
];

/**
 * Decorative, pointer-only layer: a soft glowing orb trails the mouse and a
 * row of primary-coloured dots follows in a staggered tail. The layer starts
 * invisible and fades in on the first move, only for fine pointers
 * (mouse/trackpad) with motion allowed — touch devices and
 * `prefers-reduced-motion` simply never see it.
 */
export function CursorTrail() {
  const layerRef = useRef<HTMLDivElement>(null);
  const orbRef = useRef<HTMLDivElement>(null);
  const dotRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const layer = layerRef.current;
    const orb = orbRef.current;
    const dots = dotRefs.current.filter(Boolean) as HTMLDivElement[];
    if (!layer || !orb || dots.length === 0) return;

    let raf = 0;
    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const orbPos = { ...target };
    const dotPos = TRAIL_DOTS.map(() => ({ ...target }));
    let orbScale = 1;
    let orbTargetScale = 1;
    let shown = false;

    const onMove = (event: PointerEvent) => {
      target.x = event.clientX;
      target.y = event.clientY;
      if (!shown) {
        shown = true;
        layer.style.opacity = "1";
      }
    };

    // Click feedback: the orb briefly swells.
    const onPointerDown = () => {
      orbTargetScale = 1.7;
    };
    const onPointerUp = () => {
      orbTargetScale = 1;
    };
    const onLeave = () => {
      shown = false;
      layer.style.opacity = "0";
    };

    const tick = () => {
      orbPos.x += (target.x - orbPos.x) * 0.16;
      orbPos.y += (target.y - orbPos.y) * 0.16;
      orbScale += (orbTargetScale - orbScale) * 0.2;
      orb.style.transform = `translate3d(${orbPos.x}px, ${orbPos.y}px, 0) translate(-50%, -50%) scale(${orbScale})`;
      dotPos.forEach((dot, index) => {
        const ease = TRAIL_DOTS[index].ease;
        dot.x += (target.x - dot.x) * ease;
        dot.y += (target.y - dot.y) * ease;
        const el = dots[index];
        if (el) {
          el.style.transform = `translate3d(${dot.x}px, ${dot.y}px, 0) translate(-50%, -50%)`;
        }
      });
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointerup", onPointerUp);
    document.documentElement.addEventListener("mouseleave", onLeave);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={layerRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-40 opacity-0 transition-opacity duration-300"
    >
      {/* Soft glow that lags behind the cursor. */}
      <div
        ref={orbRef}
        className="absolute top-0 left-0 size-24 rounded-full bg-primary/25 blur-2xl"
      />
      {TRAIL_DOTS.map((dot, index) => (
        <div
          key={index}
          ref={(el) => {
            dotRefs.current[index] = el;
          }}
          className={`absolute top-0 left-0 rounded-full ${dot.size} ${dot.tone}`}
        />
      ))}
    </div>
  );
}

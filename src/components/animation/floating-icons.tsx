import type { CSSProperties } from "react";
import {
  Camera,
  Clapperboard,
  Lightbulb,
  Mic,
  Music,
  Palette,
  Video,
  type LucideIcon,
} from "lucide-react";

interface FloatingIcon {
  Icon: LucideIcon;
  /** Position and scale of the icon inside the hero canvas. */
  position: string;
  size: string;
  tone: string;
  /** Seconds for one full drift cycle — stagger the rhythm per icon. */
  duration: number;
  /** Negative delay so the loop is already mid-flight on first paint. */
  delay: number;
}

// One icon per studio discipline — the same set the category browse
// cards lead with, so the decoration maps to real data.
const floaters: FloatingIcon[] = [
  {
    Icon: Camera,
    position: "top-[14%] left-[6%]",
    size: "size-9",
    tone: "text-primary/25",
    duration: 9,
    delay: -2,
  },
  {
    Icon: Clapperboard,
    position: "top-[62%] left-[12%]",
    size: "size-10",
    tone: "text-primary/20",
    duration: 11,
    delay: -6,
  },
  {
    Icon: Mic,
    position: "top-[8%] left-[44%]",
    size: "size-7",
    tone: "text-primary/25",
    duration: 8,
    delay: -1,
  },
  {
    Icon: Music,
    position: "top-[74%] left-[38%]",
    size: "size-8",
    tone: "text-primary/20",
    duration: 10,
    delay: -5,
  },
  {
    Icon: Video,
    position: "top-[10%] right-[8%]",
    size: "size-8",
    tone: "text-primary/25",
    duration: 9,
    delay: -4,
  },
  {
    Icon: Palette,
    position: "top-[56%] right-[4%]",
    size: "size-9",
    tone: "text-primary/20",
    duration: 12,
    delay: -8,
  },
  {
    Icon: Lightbulb,
    position: "top-[30%] right-[24%]",
    size: "size-6",
    tone: "text-primary/15",
    duration: 13,
    delay: -3,
  },
];

/**
 * Purely decorative layer of slowly drifting studio-equipment icons behind
 * the hero. CSS-only (no state, no effects) so it can render on the server;
 * `prefers-reduced-motion` freezes it via the globals.css media query.
 */
export function FloatingIcons() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 hidden overflow-hidden md:block"
    >
      {floaters.map(({ Icon, position, size, tone, duration, delay }, index) => (
        <span
          key={index}
          className={`animate-drift absolute ${position} ${size} ${tone}`}
          style={
            {
              "--drift-duration": `${duration}s`,
              "--drift-delay": `${delay}s`,
            } as CSSProperties
          }
        >
          <Icon className="size-full" strokeWidth={1.5} aria-hidden />
        </span>
      ))}
    </div>
  );
}

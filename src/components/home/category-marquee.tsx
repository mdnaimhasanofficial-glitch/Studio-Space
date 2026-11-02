import type { CSSProperties } from "react";
import {
  Camera,
  Clapperboard,
  Mic,
  Music,
  Video,
  type LucideIcon,
} from "lucide-react";

import { studioCategories, type StudioCategory } from "@/lib/studios";

const displayNames: Record<StudioCategory, string> = {
  Photo: "Photo Studios",
  "Sound Stage": "Film Stages",
  Podcast: "Podcast Lounges",
  Music: "Music Suites",
  Video: "Video Studios",
};

const categoryIcons: Record<StudioCategory, LucideIcon> = {
  Photo: Camera,
  "Sound Stage": Clapperboard,
  Podcast: Mic,
  Music: Music,
  Video: Video,
};

/**
 * Endless scrolling band of studio categories. The list is rendered twice
 * and shifted by half its width for a seamless loop; hovering pauses it and
 * `prefers-reduced-motion` freezes it entirely (globals.css).
 */
export function CategoryMarquee() {
  return (
    <div
      aria-hidden
      className="overflow-hidden border-b border-border/60 bg-muted/40 py-3.5 hover:[animation-play-state:paused] [&>*]:hover:[animation-play-state:paused]"
    >
      <div
        className="animate-marquee flex w-max gap-12 will-change-transform"
        style={{ "--marquee-duration": "32s" } as CSSProperties}
      >
        {[0, 1].map((copy) => (
          <div key={copy} className="flex items-center gap-12">
            {studioCategories.map((category) => {
              const Icon = categoryIcons[category];
              return (
                <span
                  key={`${copy}-${category}`}
                  className="flex items-center gap-2.5 text-sm font-medium tracking-wide text-muted-foreground"
                >
                  <Icon
                    className="size-4 shrink-0 text-primary"
                    strokeWidth={1.75}
                  />
                  {displayNames[category]}
                  <span aria-hidden className="pl-9 text-border">
                    ✦
                  </span>
                </span>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

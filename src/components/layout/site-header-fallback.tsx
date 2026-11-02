import { Aperture } from "lucide-react";

/**
 * Static shell of the header, shown while the real SiteHeader streams in.
 * SiteHeader reads usePathname for active-route indicators, which suspends
 * on per-request dynamic routes ("/studios/[slug]", "/account/studios/edit/[id]").
 * Mirroring the final bar height keeps the swap shift-free.
 */
export function SiteHeaderFallback() {
  return (
    <header
      className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md"
      aria-hidden
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <span className="flex items-center gap-2">
          <Aperture className="size-6 text-primary" />
          <span className="text-lg font-semibold tracking-tight">
            StudioSpace
          </span>
        </span>
      </div>
    </header>
  );
}

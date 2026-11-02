import { Skeleton } from "@/components/ui/skeleton";

/**
 * Account segment skeleton. The StudioSpace layout renders client hooks
 * (usePathname in the header), so every dynamic route under /account needs a
 * Suspense boundary here to stay prerenderable under cacheComponents.
 */
export default function AccountLoading() {
  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-16">
      <div className="max-w-2xl space-y-3">
        <Skeleton className="h-9 w-64 max-w-full" aria-hidden />
        <Skeleton className="h-5 w-80 max-w-full" aria-hidden />
      </div>

      <div className="mt-10 space-y-4" aria-hidden>
        <Skeleton className="h-52 w-full rounded-2xl" />
        <Skeleton className="h-52 w-full rounded-2xl" />
        <Skeleton className="h-52 w-full rounded-2xl" />
      </div>
    </div>
  );
}

import { Headset, ShieldCheck, UserCheck, Wrench, type LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

const stats = [
  { value: "200+", label: "verified spaces" },
  { value: "12k", label: "hours booked" },
  { value: "4.9", label: "average rating" },
] as const;

const assurances: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: ShieldCheck,
    title: "Liability protection",
    description:
      "Every reservation is covered by our damage waiver — gear and walls stay protected on both sides of the booking.",
  },
  {
    icon: UserCheck,
    title: "Verified profiles",
    description:
      "Hosts and creators are identity-checked before a single booking is confirmed. No anonymous strangers sharing your space.",
  },
  {
    icon: Wrench,
    title: "Equipment safety",
    description:
      "Listings declare their gear, power and blackout specs, and we check in on first-time studios after their debut booking.",
  },
  {
    icon: Headset,
    title: "24/7 host support",
    description:
      "Lockouts, last-minute schedule shifts, gear questions — a real human answers, day or night.",
  },
];

export function About() {
  return (
    <section id="about" className="mx-auto max-w-6xl px-6 py-20">
      <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
        <div className="space-y-5">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Built by people who book studios
          </h2>
          <p className="text-muted-foreground">
            StudioSpace started because booking a photo studio shouldn&apos;t
            take a dozen phone calls. We verify every space, set clear hourly
            rates, and keep the keys moving — so the only thing you plan is the
            shoot.
          </p>
          <p className="text-muted-foreground">
            Have a space that sits empty half the week? List it, set your rate,
            and let the room pay for itself.
          </p>
          <a
            href="mailto:mdnaimhasan.official@gmail.com"
            className="text-sm font-medium text-primary underline decoration-2 underline-offset-4"
          >
            Become a host →
          </a>
        </div>

        <dl className="grid gap-4 sm:grid-cols-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-border/60 bg-muted/20 p-6"
            >
              <dt className="text-sm text-muted-foreground">{stat.label}</dt>
              <dd className="mt-2 text-3xl font-bold text-primary">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      {/* Host Guarantee & Creator Support */}
      <div className="mt-16 space-y-6">
        <div className="space-y-2">
          <h3 className="text-2xl font-bold tracking-tight md:text-3xl">
            Host guarantee & creator support
          </h3>
          <p className="max-w-2xl text-muted-foreground">
            Booking a stranger&apos;s space takes trust — these four assurances
            keep both sides of every rental safe.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {assurances.map((item) => (
            <Card key={item.title} className="h-full gap-3 p-5">
              <item.icon className="size-5 text-primary" aria-hidden />
              <p className="font-semibold">{item.title}</p>
              <p className="text-sm text-muted-foreground">
                {item.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

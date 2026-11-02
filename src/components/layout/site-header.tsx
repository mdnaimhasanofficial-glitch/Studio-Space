"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense } from "react";
import {
  Aperture,
  Building,
  CalendarDays,
  ChevronDown,
  CirclePlus,
  Heart,
  LogOut,
  Menu,
} from "lucide-react";

import { useAuth } from "@/components/auth/auth-context";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { buttonVariants, Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "cn";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/studios", label: "Explore Studios" },
  { href: "/#how-it-works", label: "How It Works" },
  { href: "/#about", label: "About Us" },
] as const;

const accountItems = [
  { href: "/studios/new", label: "Add New Studio", icon: CirclePlus },
  { href: "/account/studios", label: "My Studio Listings", icon: Building },
  { href: "/account/bookings", label: "My Bookings", icon: CalendarDays },
  { href: "/wishlist", label: "Saved Wishlist", icon: Heart },
] as const;

function isActiveRoute(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  if (href.startsWith("/#")) return false;
  return pathname.startsWith(href);
}

/**
 * Active-route indicator for one nav item. `usePathname` only exists in this
 * leaf — per URL-data-in-Suspense rules of cacheComponents, URL hooks live in
 * the smallest component and the fallback (plain link, no active styling)
 * ships in the static shell.
 */
function NavItem({
  href,
  label,
  onNavigate,
}: {
  href: string;
  label: string;
  onNavigate?: () => void;
}) {
  return (
    <Suspense
      fallback={
        <Link
          href={href}
          onClick={onNavigate}
          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          {label}
        </Link>
      }
    >
      <ActiveNavItem href={href} label={label} onNavigate={onNavigate} />
    </Suspense>
  );
}

function ActiveNavItem({
  href,
  label,
  onNavigate,
}: {
  href: string;
  label: string;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const active = isActiveRoute(pathname, href);

  return (
    <Link
      href={href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={cn(
        "text-sm text-muted-foreground transition-colors hover:text-foreground",
        active &&
          "font-medium text-primary underline decoration-2 underline-offset-8",
      )}
    >
      {label}
    </Link>
  );
}

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <>
      {navItems.map((item) => (
        <NavItem
          key={item.href}
          href={item.href}
          label={item.label}
          onNavigate={onNavigate}
        />
      ))}
    </>
  );
}

function initialsOf(name: string, email: string): string {
  const source = name.trim() || email.split("@")[0];
  return source
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function SiteHeader() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <Aperture className="size-6 text-primary" aria-hidden />
          <span className="text-lg font-semibold tracking-tight">
            StudioSpace
          </span>
        </Link>

        <nav
          aria-label="Main"
          className="hidden items-center gap-8 md:flex"
        >
          <NavLinks />
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle />
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="ghost"
                    aria-label="Account menu"
                    className="gap-2 rounded-full py-1.5 pr-2.5 pl-1.5"
                  />
                }
              >
                <Avatar size="sm">
                  {user.photo ? (
                    <AvatarImage
                      src={user.photo}
                      alt={`${user.name}'s avatar`}
                    />
                  ) : null}
                  <AvatarFallback>
                    {initialsOf(user.name, user.email)}
                  </AvatarFallback>
                </Avatar>
                <span className="max-w-24 truncate text-sm font-medium">
                  {user.name || user.email}
                </span>
                <ChevronDown
                  className="size-3.5 text-muted-foreground"
                  aria-hidden
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                {/* Base UI's group label must live inside a Menu.Group. */}
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="space-y-0.5 py-1.5">
                    <p className="text-xs text-muted-foreground">
                      Signed in as
                    </p>
                    <p className="text-sm font-semibold text-foreground">
                      {user.name || "StudioSpace user"}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {user.email}
                    </p>
                  </DropdownMenuLabel>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                {accountItems.map((item) => (
                  <DropdownMenuItem
                    key={item.href}
                    render={<Link href={item.href} />}
                    className={
                      item.href === "/studios/new"
                        ? "text-primary focus:text-primary"
                        : undefined
                    }
                  >
                    <item.icon aria-hidden />
                    {item.label}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  variant="destructive"
                  onClick={logout}
                >
                  <LogOut aria-hidden />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link
                href="/login"
                className={buttonVariants({ variant: "ghost" })}
              >
                Login
              </Link>
              <Link href="/register" className={buttonVariants()}>
                Register
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-1 md:hidden">
          <ThemeToggle />
          <Sheet>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Open menu"
                />
              }
            >
              <Menu className="size-5" />
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <Aperture className="size-5 text-primary" aria-hidden />
                  StudioSpace
                </SheetTitle>
              </SheetHeader>
              <nav aria-label="Mobile" className="flex flex-col gap-4 px-4">
                <NavLinks />
              </nav>
              <div className="flex flex-col gap-2 px-4">
                {user ? (
                  <>
                    {accountItems.map((item) => (
                      <SheetClose
                        key={item.href}
                        render={
                          <Link
                            href={item.href}
                            className={cn(
                              buttonVariants({
                                variant:
                                  item.href === "/studios/new"
                                    ? "default"
                                    : "outline",
                              }),
                              "justify-start gap-2",
                            )}
                          />
                        }
                      >
                        <item.icon className="size-4" aria-hidden />
                        {item.label}
                      </SheetClose>
                    ))}
                    <SheetClose
                      render={
                        <Button
                          variant="ghost"
                          className="justify-start gap-2"
                          onClick={logout}
                        />
                      }
                    >
                      <LogOut className="size-4" aria-hidden />
                      Sign Out
                    </SheetClose>
                  </>
                ) : (
                  <>
                    <SheetClose
                      render={
                        <Link
                          href="/login"
                          className={buttonVariants({ variant: "outline" })}
                        />
                      }
                    >
                      Login
                    </SheetClose>
                    <SheetClose
                      render={
                        <Link href="/register" className={buttonVariants()} />
                      }
                    >
                      Register
                    </SheetClose>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { Menu, MessageCircle, Phone, X } from "lucide-react";

import { LanguageSwitcher } from "@/components/language-switcher";
import { buttonVariants } from "@/components/ui/button";
import type { Dictionary } from "@/content/types";
import { localePath, type Locale } from "@/lib/i18n";
import { site, sitePaths, whatsappUrl } from "@/lib/site";
import { cn } from "@/lib/utils";

interface SiteHeaderProps {
  locale: Locale;
  t: Dictionary["nav"];
}

/** Sticky header: blurred surface once the page scrolls, full-screen menu below lg. */
export const SiteHeader = ({ locale, t }: SiteHeaderProps): React.JSX.Element => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 8));

  const close = useCallback((): void => {
    setOpen(false);
    menuButtonRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    firstLinkRef.current?.focus();
    const onKey = (event: KeyboardEvent): void => {
      if (event.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      root.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  const links = [
    { href: localePath(locale, "#solutions"), label: t.cabinets },
    { href: sitePaths.catalog, label: t.catalog },
    { href: sitePaths.services, label: t.services },
    { href: sitePaths.about, label: t.about },
  ];

  return (
    <>
      <a
        href="#main"
        className="fixed top-3 left-3 z-[60] -translate-y-24 rounded-control bg-ink px-4 py-2 text-sm font-semibold text-white focus:translate-y-0"
      >
        {t.skipToContent}
      </a>

      <header
        className={cn(
          "sticky top-0 z-40 h-(--header-height) border-b transition-[background-color,border-color,box-shadow] duration-300",
          scrolled || open
            ? "border-line/80 bg-paper/80 shadow-[0_8px_30px_-20px_rgb(23_40_61/0.35)] backdrop-blur-xl"
            : "border-transparent bg-transparent",
        )}
      >
        <div className="container-axis flex h-full items-center gap-6">
          <Link href={localePath(locale)} className="flex shrink-0 items-center gap-4" aria-label="AXIS">
            <Image src="/brand/axis-logo.png" alt="AXIS" width={2108} height={640} priority className="h-7 w-auto" />
            <span className="hidden max-w-[9.5rem] border-l border-line-strong pl-4 text-[0.7rem] leading-tight font-semibold tracking-[0.08em] text-ink-muted uppercase xl:block">
              {t.tagline}
            </span>
          </Link>

          <nav aria-label="AXIS" className="hidden flex-1 justify-center lg:flex">
            <ul className="flex items-center gap-1">
              {links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="rounded-full px-3.5 py-2 text-[0.92rem] font-semibold text-ink/80 transition-colors hover:bg-white hover:text-ink"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="ml-auto flex items-center gap-3 lg:ml-0">
            <LanguageSwitcher locale={locale} label={t.languageLabel} className="hidden sm:flex" />
            <a
              href={site.phoneHref}
              className="hidden items-center gap-2 text-[0.92rem] font-semibold text-ink tabular-nums transition-colors hover:text-brand xl:flex"
            >
              <Phone className="size-4 text-brand" aria-hidden />
              {site.phoneDisplay}
            </a>
            <a
              href={whatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(buttonVariants({ size: "sm" }), "hidden md:inline-flex")}
            >
              {t.contactCta}
            </a>
            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? t.menuClose : t.menuOpen}
              className="grid size-11 place-items-center rounded-control border border-line-strong bg-surface text-ink lg:hidden"
            >
              {open ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label={t.menuOpen}
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-x-0 top-(--header-height) bottom-0 z-50 overflow-y-auto bg-paper lg:hidden"
          >
            <div className="container-axis flex min-h-full flex-col gap-10 py-8">
              <ul className="flex flex-col">
                {links.map((link, index) => (
                  <li key={link.href} className="border-b border-line">
                    <a
                      ref={index === 0 ? firstLinkRef : undefined}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="block py-4 text-2xl font-semibold tracking-tight text-ink"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>

              <div className="mt-auto flex flex-col gap-5">
                <LanguageSwitcher locale={locale} label={t.languageLabel} className="sm:hidden" />
                <a href={site.phoneHref} className="text-lg font-semibold text-ink tabular-nums">
                  {site.phoneDisplay}
                </a>
                <a href={`mailto:${site.email}`} className="text-ink-muted">
                  {site.email}
                </a>
                <a
                  href={whatsappUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(buttonVariants({ size: "lg" }), "w-full")}
                >
                  <MessageCircle className="size-5" aria-hidden />
                  {t.contactCta}
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight, Menu, X } from "lucide-react";

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

/** Sticky header between two hairlines, like the top band of a drawing sheet. Full-screen menu below lg. */
export const SiteHeader = ({ locale, t }: SiteHeaderProps): React.JSX.Element => {
  const [open, setOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

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
    { href: localePath(locale, "#index"), label: t.cabinets },
    { href: localePath(locale, "#order70"), label: t.order70 },
    { href: localePath(locale, "#process"), label: t.process },
    { href: sitePaths.about, label: t.about },
  ];

  return (
    <>
      <a
        href="#main"
        className="fixed top-3 left-3 z-[60] -translate-y-24 bg-ink px-4 py-2 text-sm font-medium text-white focus:translate-y-0"
      >
        {t.skipToContent}
      </a>

      <header className="sticky top-0 z-40 bg-paper">
        <div className="container-axis">
          <div className="flex h-(--header-height) items-center gap-8 border-y border-line">
            <Link href={localePath(locale)} aria-label="AXIS" className="shrink-0">
              <Image src="/brand/axis-logo.png" alt="AXIS" width={2108} height={640} priority className="h-6 w-auto" />
            </Link>

            <nav aria-label="AXIS" className="hidden flex-1 justify-center lg:flex">
              <ul className="flex items-center gap-9">
                {links.map((link) => (
                  <li key={link.href}>
                    <a href={link.href} className="text-sm font-medium text-ink-2 transition-colors hover:text-brand">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="ml-auto flex items-center gap-6 lg:ml-0">
              <LanguageSwitcher locale={locale} label={t.languageLabel} className="hidden sm:flex" />
              <a
                href={whatsappUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(buttonVariants({ variant: "ink", size: "sm" }), "hidden md:inline-flex")}
              >
                {t.contactCta}
                <ArrowRight aria-hidden />
              </a>
              <button
                ref={menuButtonRef}
                type="button"
                onClick={() => setOpen((value) => !value)}
                aria-expanded={open}
                aria-controls="mobile-menu"
                aria-label={open ? t.menuClose : t.menuOpen}
                className="grid size-10 place-items-center border border-line-strong bg-surface text-ink lg:hidden"
              >
                {open ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
              </button>
            </div>
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
              <ul className="flex flex-col border-t border-ink">
                {links.map((link, index) => (
                  <li key={link.href} className="border-b border-line">
                    <a
                      ref={index === 0 ? firstLinkRef : undefined}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-between py-4 text-3xl font-semibold tracking-tight text-ink"
                    >
                      {link.label}
                      <span className="font-mono text-xs text-ink-faint">{String(index + 1).padStart(2, "0")}</span>
                    </a>
                  </li>
                ))}
              </ul>
              <div className="mt-auto flex flex-col gap-5">
                <LanguageSwitcher locale={locale} label={t.languageLabel} className="sm:hidden" />
                <a href={site.phoneHref} className="text-lg font-medium text-ink tabular-nums">
                  {site.phoneDisplay}
                </a>
                <a href={`mailto:${site.email}`} className="text-ink-muted">
                  {site.email}
                </a>
                <a
                  href={whatsappUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(buttonVariants({ size: "lg" }), "w-full justify-between")}
                >
                  {t.contactCta}
                  <ArrowRight aria-hidden />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

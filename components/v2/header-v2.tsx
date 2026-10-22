"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import { ArrowRight, Menu, X } from "lucide-react";

import { LanguagePills } from "@/components/v2/language-pills";
import { softButton } from "@/components/v2/ui/soft-button";
import type { Dictionary } from "@/content/types";
import type { Locale } from "@/lib/i18n";
import { sitePaths } from "@/lib/site";
import { versionPath } from "@/lib/versions";
import { cn } from "@/lib/utils";

interface HeaderV2Props {
  locale: Locale;
  t: Dictionary["nav"];
  menuLabel: string;
}

const focusableSelector = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** Floating white pill header. Below lg the links move into a modal sheet that keeps focus inside. */
export const HeaderV2 = ({ locale, t, menuLabel }: HeaderV2Props): React.JSX.Element => {
  const [open, setOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  const close = useCallback((): void => {
    setOpen(false);
    menuButtonRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    dialogRef.current?.querySelector<HTMLElement>(focusableSelector)?.focus();
    const onKey = (event: globalThis.KeyboardEvent): void => {
      if (event.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      root.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  /** Tab and Shift+Tab cycle inside the open sheet. */
  const trapFocus = (event: KeyboardEvent<HTMLDivElement>): void => {
    if (event.key !== "Tab" || !dialogRef.current) return;
    const nodes = [...dialogRef.current.querySelectorAll<HTMLElement>(focusableSelector)];
    const first = nodes[0];
    const last = nodes[nodes.length - 1];
    if (!first || !last) return;
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const links = [
    { href: versionPath(locale, "v2", "#index"), label: t.cabinets },
    { href: versionPath(locale, "v2", "#order70"), label: t.order70 },
    { href: versionPath(locale, "v2", "#process"), label: t.process },
    { href: sitePaths.about, label: t.about },
  ];

  return (
    <>
      <a
        href="#main"
        className="fixed top-3 left-3 z-[60] -translate-y-24 rounded-full bg-navy px-4 py-2 text-sm font-bold text-white focus:translate-y-0"
      >
        {t.skipToContent}
      </a>

      <header className="sticky top-3 z-40 px-3 sm:px-5">
        <div className="mx-auto flex h-16 max-w-[1240px] items-center justify-between gap-3 rounded-full border-[2.5px] border-navy bg-white pr-2 pl-5 shadow-sticker-sm">
          <Link href={versionPath(locale, "v2")} aria-label="AXIS" className="shrink-0 rounded-full">
            <Image src="/brand/axis-logo.png" alt="AXIS" width={2108} height={640} priority className="h-6 w-auto" />
          </Link>

          <nav aria-label={menuLabel} className="hidden items-center gap-1 lg:flex">
            {links.map((link) => (
              <a key={link.href} href={link.href} className="rounded-full px-3.5 py-2 text-[15px] font-bold transition-colors hover:bg-sky">
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <LanguagePills locale={locale} label={t.languageLabel} className="hidden md:flex" />
            <a href={versionPath(locale, "v2", "#contact")} className={cn(softButton({ variant: "navy" }), "hidden sm:inline-flex")}>
              {t.contactCta}
            </a>
            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setOpen(true)}
              aria-label={t.menuOpen}
              aria-expanded={open}
              className="grid size-11 place-items-center rounded-full border-[2.5px] border-navy bg-sun lg:hidden"
            >
              <Menu aria-hidden className="size-5" />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            key="backdrop"
            className="fixed inset-0 z-50 bg-navy/40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          />
        )}
        {open && (
          <motion.div
            key="sheet"
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={menuLabel}
            onKeyDown={trapFocus}
            className="fixed inset-x-3 top-3 z-50 rounded-card border-[2.5px] border-navy bg-white p-5 shadow-sticker lg:hidden"
            initial={{ opacity: 0, y: -16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 420, damping: 32 }}
          >
            <div className="flex items-center justify-between">
              <Image src="/brand/axis-logo.png" alt="AXIS" width={2108} height={640} className="h-6 w-auto" />
              <button
                type="button"
                onClick={close}
                aria-label={t.menuClose}
                className="grid size-11 place-items-center rounded-full border-[2.5px] border-navy bg-white"
              >
                <X aria-hidden className="size-5" />
              </button>
            </div>
            <ul className="mt-6 grid gap-2">
              {links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between rounded-tile bg-cloud px-4 py-3.5 text-lg font-extrabold transition-colors hover:bg-sky"
                  >
                    {link.label}
                    <ArrowRight aria-hidden className="size-5" />
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
              <LanguagePills locale={locale} label={t.languageLabel} />
              <a
                href={versionPath(locale, "v2", "#contact")}
                onClick={() => setOpen(false)}
                className={softButton({ variant: "primary" })}
              >
                {t.contactCta}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

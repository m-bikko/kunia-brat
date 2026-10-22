"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { whatsappUrl } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * Floating WhatsApp shortcut (kept from the live site, where most leads arrive). It steps aside while
 * the Order No. 70 tool is on screen: the tool has its own WhatsApp button and on phones the shortcut
 * would cover the tool's controls.
 */
export const WhatsappFab = ({
  label,
  variant = "sheet",
}: {
  label: string;
  /** "sheet" — square v1 tile; "soft" — round v2 sticker. */
  variant?: "sheet" | "soft";
}): React.JSX.Element => {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const tool = document.getElementById("order70");
    if (!tool) return;
    const observer = new IntersectionObserver(([entry]) => setHidden(entry?.isIntersecting ?? false));
    observer.observe(tool);
    return () => observer.disconnect();
  }, []);

  return (
    <a
      href={whatsappUrl()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      title={label}
      aria-hidden={hidden || undefined}
      tabIndex={hidden ? -1 : undefined}
      className={cn(
        "fixed right-4 bottom-4 z-30 grid size-14 place-items-center bg-surface transition-[opacity,translate] duration-300 hover:-translate-y-0.5 sm:right-6 sm:bottom-6",
        variant === "sheet"
          ? "border border-line shadow-[0_14px_34px_-14px_rgb(11_18_32/0.45)]"
          : "rounded-full border-[2.5px] border-navy shadow-sticker-sm",
        hidden && "pointer-events-none translate-y-3 opacity-0",
      )}
    >
      <Image src="/icons/whatsapp.svg" alt="" width={34} height={34} unoptimized />
    </a>
  );
};

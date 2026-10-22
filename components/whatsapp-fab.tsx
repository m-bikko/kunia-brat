import Image from "next/image";

import { whatsappUrl } from "@/lib/site";

/** Floating WhatsApp shortcut (kept from the live site, where most leads arrive). */
export const WhatsappFab = ({ label }: { label: string }): React.JSX.Element => (
  <a
    href={whatsappUrl()}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
    title={label}
    className="fixed right-4 bottom-4 z-30 grid size-14 place-items-center border border-line bg-surface shadow-[0_14px_34px_-14px_rgb(11_18_32/0.45)] transition-transform duration-300 hover:-translate-y-0.5 sm:right-6 sm:bottom-6"
  >
    <Image src="/icons/whatsapp.svg" alt="" width={34} height={34} unoptimized />
  </a>
);

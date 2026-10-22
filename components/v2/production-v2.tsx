import Image, { type StaticImageData } from "next/image";
import { ArrowRight } from "lucide-react";

import ranzenStore from "@/assets/images/team/ranzen-store.jpg";
import furnitureWorkshop from "@/assets/images/team/furniture-workshop.webp";
import { Sparkle } from "@/components/v2/art/deco";
import { Sticker } from "@/components/v2/ui/sticker";
import { softButton } from "@/components/v2/ui/soft-button";
import type { Dictionary } from "@/content/types";
import { whatsappUrl } from "@/lib/site";
import { cn } from "@/lib/utils";

interface PhotoCardProps {
  src: StaticImageData;
  alt: string;
  kicker: string;
  title: string;
  text: string;
  sticker?: string;
  tilt: string;
}

/** A real photo in a rounded frame, slightly tilted like a print pinned to a board. */
const PhotoCard = ({ src, alt, kicker, title, text, sticker, tilt }: PhotoCardProps): React.JSX.Element => (
  <figure className={cn("relative rounded-card border-[2.5px] border-navy bg-white p-3 shadow-sticker sm:p-4", tilt)}>
    <div className="relative aspect-[4/3] overflow-clip rounded-tile border-[2.5px] border-navy">
      <Image src={src} alt={alt} fill placeholder="blur" sizes="(min-width: 1024px) 36rem, 92vw" className="object-cover" />
    </div>
    {sticker && (
      <Sticker tone="sun" className="absolute -top-4 right-6 rotate-3 text-base">
        {sticker}
      </Sticker>
    )}
    <figcaption className="px-2 pt-4 pb-2">
      <p className="text-sm font-black tracking-wide text-brand uppercase">{kicker}</p>
      <p className="mt-1 text-2xl font-black">{title}</p>
      <p className="mt-1.5 text-[17px] leading-relaxed font-semibold text-navy-muted">{text}</p>
    </figcaption>
  </figure>
);

/** Production: our own furniture workshop and the Ranzen store, as real photos in sticker frames. */
export const ProductionV2 = ({ t }: { t: Dictionary }): React.JSX.Element => (
  <section id="production" aria-labelledby="production-v2-title" className="mx-auto max-w-[1240px] px-5 pt-20 sm:px-8 lg:pt-28">
    <h2 id="production-v2-title" className="max-w-[20ch] text-[clamp(2.1rem,4.6vw,3.75rem)] leading-[1.02] font-black tracking-[-0.025em]">
      {t.team.title.map((line) => (
        <span key={line} className="block">
          {line}{" "}
        </span>
      ))}
    </h2>
    <div className="relative mt-12 grid gap-10 lg:grid-cols-2 lg:gap-12">
      <Sparkle className="absolute -top-8 left-1/2 hidden size-12 lg:block" />
      <PhotoCard
        src={furnitureWorkshop}
        alt={t.team.workshop.alt}
        kicker={t.team.workshop.kicker}
        title={t.team.workshop.title}
        text={t.team.workshop.text}
        sticker={t.v2.production.sticker}
        tilt="lg:-rotate-1"
      />
      <PhotoCard
        src={ranzenStore}
        alt={t.team.store.alt}
        kicker={t.team.store.kicker}
        title={t.team.store.title}
        text={t.team.store.text}
        tilt="lg:rotate-1 lg:translate-y-8"
      />
    </div>
    <div className="mt-16 flex flex-col gap-5 rounded-card border-[2.5px] border-navy bg-sky p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">
      <p className="text-lg">
        <span className="font-black">{t.team.teamTitle}.</span>{" "}
        <span className="font-semibold text-navy-muted">{t.team.teamText}</span>
      </p>
      <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className={cn(softButton({ variant: "outline" }), "self-start sm:self-auto")}>
        {t.nav.contactCta}
        <ArrowRight aria-hidden />
      </a>
    </div>
  </section>
);

import Image, { type StaticImageData } from "next/image";
import { ArrowRight } from "lucide-react";

import ranzenStore from "@/assets/images/team/ranzen-store.jpg";
import furnitureWorkshop from "@/assets/images/team/furniture-workshop.webp";
import { SheetHeading } from "@/components/sheet";
import { buttonVariants } from "@/components/ui/button";
import type { Dictionary } from "@/content/types";
import { whatsappUrl } from "@/lib/site";
import { cn } from "@/lib/utils";

interface PhotoProps {
  src: StaticImageData;
  alt: string;
  kicker: string;
  title: string;
  text: string;
  aspect: string;
  sizes: string;
}

/** A real photo mounted in a hairline frame, captioned like a site record. */
const Photo = ({ src, alt, kicker, title, text, aspect, sizes }: PhotoProps): React.JSX.Element => (
  <figure>
    <div className="border border-line bg-surface p-2.5">
      <div className={cn("relative overflow-hidden bg-line", aspect)}>
        <Image src={src} alt={alt} fill placeholder="blur" sizes={sizes} className="object-cover" />
      </div>
    </div>
    <figcaption className="mt-4 grid gap-1 sm:grid-cols-[9rem_1fr]">
      <p className="label-mono pt-1.5 text-brand">{kicker}</p>
      <div>
        <p className="text-xl font-semibold tracking-tight text-ink">{title}</p>
        <p className="mt-1 text-ink-muted">{text}</p>
      </div>
    </figcaption>
  </figure>
);

interface ProductionProps {
  t: Dictionary;
  sheet: string;
}

/** The furniture workshop and the Ranzen store: proof that AXIS makes and supplies, not just resells. */
export const Production = ({ t, sheet }: ProductionProps): React.JSX.Element => (
  <section aria-labelledby="production-title" className="border-b border-line py-20 lg:py-28">
    <div className="container-axis">
      <SheetHeading id="production-title" sheet={sheet} title={t.team.title} />
      <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-7">
          <Photo
            src={furnitureWorkshop}
            alt={t.team.workshop.alt}
            kicker={t.team.workshop.kicker}
            title={t.team.workshop.title}
            text={t.team.workshop.text}
            aspect="aspect-[4/3]"
            sizes="(min-width: 1024px) 55vw, 100vw"
          />
        </div>
        <div className="lg:col-span-5 lg:mt-32">
          <Photo
            src={ranzenStore}
            alt={t.team.store.alt}
            kicker={t.team.store.kicker}
            title={t.team.store.title}
            text={t.team.store.text}
            aspect="aspect-[4/5]"
            sizes="(min-width: 1024px) 38vw, 100vw"
          />
        </div>
      </div>
      <div className="mt-14 flex flex-col gap-6 border-t border-ink pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p>
          <span className="font-semibold text-ink">{t.team.teamTitle}.</span>{" "}
          <span className="text-ink-muted">{t.team.teamText}</span>
        </p>
        <a
          href={whatsappUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(buttonVariants({ variant: "outline" }), "self-start sm:self-auto")}
        >
          {t.nav.contactCta}
          <ArrowRight aria-hidden />
        </a>
      </div>
    </div>
  </section>
);

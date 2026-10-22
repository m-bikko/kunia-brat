import { MessageCircle } from "lucide-react";
import Image from "next/image";

import ranzenStore from "@/assets/images/team/ranzen-store.jpg";
import furnitureWorkshop from "@/assets/images/team/furniture-workshop.webp";
import { SectionTitle } from "@/components/section-title";
import { BlurFade } from "@/components/ui/blur-fade";
import { buttonVariants } from "@/components/ui/button";
import type { Dictionary } from "@/content/types";
import { whatsappUrl } from "@/lib/site";
import { cn } from "@/lib/utils";

interface TeamProps {
  t: Dictionary;
}

/** Real photos: the furniture workshop and the Ranzen store, offset like a contact sheet. */
export const Team = ({ t }: TeamProps): React.JSX.Element => {
  const copy = t.team;

  return (
    <section aria-labelledby="team-title" className="py-20 lg:py-28">
      <div className="container-axis">
        <SectionTitle id="team-title" title={copy.title} />

        <div className="mt-12 grid gap-10 lg:mt-16 lg:grid-cols-12 lg:gap-8">
          <BlurFade inView direction="up" offset={16} className="lg:col-span-7">
            <figure>
              <div className="relative aspect-[4/3] overflow-hidden rounded-card bg-muted">
                <Image
                  src={furnitureWorkshop}
                  alt={copy.workshop.alt}
                  fill
                  placeholder="blur"
                  sizes="(min-width: 1024px) 58vw, 100vw"
                  className="object-cover"
                />
              </div>
              <figcaption className="mt-5">
                <p className="text-sm font-semibold text-brand">{copy.workshop.kicker}</p>
                <h3 className="mt-1 text-2xl font-semibold tracking-[-0.02em] text-ink">{copy.workshop.title}</h3>
                <p className="mt-2 max-w-[48ch] text-ink-muted">{copy.workshop.text}</p>
              </figcaption>
            </figure>
          </BlurFade>

          <BlurFade inView direction="up" offset={16} delay={0.1} className="lg:col-span-5 lg:mt-28">
            <figure>
              <div className="relative aspect-[4/5] overflow-hidden rounded-card bg-muted">
                <Image
                  src={ranzenStore}
                  alt={copy.store.alt}
                  fill
                  placeholder="blur"
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover"
                />
              </div>
              <figcaption className="mt-5">
                <p className="text-sm font-semibold text-brand">{copy.store.kicker}</p>
                <h3 className="mt-1 text-2xl font-semibold tracking-[-0.02em] text-ink">{copy.store.title}</h3>
                <p className="mt-2 max-w-[48ch] text-ink-muted">{copy.store.text}</p>
              </figcaption>
            </figure>
          </BlurFade>
        </div>

        <div className="mt-14 flex flex-col gap-6 rounded-card border border-line bg-surface p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div>
            <p className="text-xl font-semibold tracking-[-0.02em] text-ink">{copy.teamTitle}</p>
            <p className="mt-1 text-ink-muted">{copy.teamText}</p>
          </div>
          <a
            href={whatsappUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(buttonVariants({ variant: "outline" }), "self-start sm:self-auto")}
          >
            <MessageCircle aria-hidden />
            {t.nav.contactCta}
          </a>
        </div>
      </div>
    </section>
  );
};

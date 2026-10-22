import Image from "next/image";

import { SectionTitle } from "@/components/section-title";
import { Marquee } from "@/components/ui/marquee";
import { brands } from "@/content/brands";
import type { Dictionary } from "@/content/types";

interface BrandsProps {
  t: Dictionary["brands"];
}

/** Logo marquee. The moving copy is aria-hidden; screen readers get a plain list. */
export const Brands = ({ t }: BrandsProps): React.JSX.Element => (
  <section aria-labelledby="brands-title" className="py-20 lg:py-28">
    <div className="container-axis">
      <SectionTitle id="brands-title" title={t.title} lead={t.text} />
      <ul className="sr-only">
        {brands.map((brand) => (
          <li key={brand.name}>{brand.name}</li>
        ))}
      </ul>
    </div>

    <div
      aria-hidden
      className="relative mt-12 [mask-image:linear-gradient(to_right,transparent,#000_8%,#000_92%,transparent)] lg:mt-16"
    >
      <Marquee pauseOnHover repeat={3} className="[--duration:55s] [--gap:1rem] py-2">
        {brands.map((brand) => (
          <div
            key={brand.name}
            className="flex h-24 w-48 shrink-0 items-center justify-center rounded-control border border-line bg-surface px-7 transition-colors hover:border-line-strong sm:h-28 sm:w-56"
          >
            <Image
              src={brand.logo}
              alt=""
              sizes="160px"
              unoptimized={brand.logo.src.endsWith(".svg")}
              className="max-h-12 w-auto object-contain opacity-75 grayscale transition-[filter,opacity] duration-300 hover:opacity-100 hover:grayscale-0"
            />
          </div>
        ))}
      </Marquee>
    </div>
  </section>
);

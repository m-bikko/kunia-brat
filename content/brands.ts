import type { StaticImageData } from "next/image";

import argLogo from "@/assets/partners/arg.png";
import bgLogo from "@/assets/partners/bg.jpeg";
import fabrianoLogo from "@/assets/partners/fabriano.jpeg";
import gammaLogo from "@/assets/partners/gamma-color.jpeg";
import globusLogo from "@/assets/partners/globus.jpeg";
import kolyubakinoLogo from "@/assets/partners/kolyubakino.jpeg";
import lgLogo from "@/assets/partners/lg.webp";
import prymLogo from "@/assets/partners/prym.jpeg";
import sulpakLogo from "@/assets/partners/sulpak.png";
import technodomLogo from "@/assets/partners/technodom.svg";
import vistaArtistaLogo from "@/assets/partners/vista-artista.jpeg";

/** Manufacturer logos shown in the brands marquee. */
export interface Brand {
  name: string;
  logo: StaticImageData;
}

export const brands: readonly Brand[] = [
  { name: "LG", logo: lgLogo },
  { name: "ARG", logo: argLogo },
  { name: "Technodom", logo: technodomLogo },
  { name: "Sulpak", logo: sulpakLogo },
  { name: "Fabriano", logo: fabrianoLogo },
  { name: "Prym", logo: prymLogo },
  { name: "Vista-Artista", logo: vistaArtistaLogo },
  { name: "Гамма", logo: gammaLogo },
  { name: "BG", logo: bgLogo },
  { name: "Глобус", logo: globusLogo },
  { name: "Колюбакинский игольный завод", logo: kolyubakinoLogo },
];

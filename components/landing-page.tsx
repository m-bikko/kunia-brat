import { JsonLd } from "@/components/json-ld";
import { Brands } from "@/components/sections/brands";
import { Cabinets } from "@/components/sections/cabinets";
import { ContactCta } from "@/components/sections/contact-cta";
import { Faq } from "@/components/sections/faq";
import { G8 } from "@/components/sections/g8";
import { HeroSheet } from "@/components/sections/hero-sheet";
import { Process } from "@/components/sections/process";
import { Showroom, type ShowroomTour } from "@/components/sections/showroom";
import { Stats } from "@/components/sections/stats";
import { Team } from "@/components/sections/team";
import { SheetRuler } from "@/components/sheet";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { WhatsappFab } from "@/components/whatsapp-fab";
import { cabinets, tourCabinetIds } from "@/content/cabinets";
import { getDictionary } from "@/content/dictionaries";
import type { Locale } from "@/lib/i18n";

/** The whole landing for one locale. */
export const LandingPage = ({ locale }: { locale: Locale }): React.JSX.Element => {
  const t = getDictionary(locale);

  const tours: ShowroomTour[] = tourCabinetIds.flatMap((id) => {
    const { tourHref, image } = cabinets[id];
    return tourHref ? [{ id, name: t.cabinets.items[id].name, image, tourHref }] : [];
  });

  return (
    <>
      <JsonLd locale={locale} t={t} />
      <SheetRuler />
      <SiteHeader locale={locale} t={t.nav} />
      <main id="main">
        <HeroSheet locale={locale} t={t} />
        <Stats locale={locale} t={t.stats} />
        <Cabinets t={t} />
        <Showroom t={t.showroom} tours={tours} />
        <Brands t={t.brands} />
        <Process t={t.process} />
        <Team t={t} />
        <Faq t={t} />
        <G8 t={t.g8} />
        <ContactCta t={t.contact} address={t.footer.address} cabinetItems={t.cabinets.items} />
      </main>
      <SiteFooter locale={locale} t={t} />
      <WhatsappFab label={t.whatsappFab} />
    </>
  );
};

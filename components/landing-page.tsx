import { BlueprintIntro } from "@/components/intro/blueprint-intro";
import { JsonLd } from "@/components/json-ld";
import { CabinetIndex } from "@/components/sections/cabinet-index";
import { Closing } from "@/components/sections/closing";
import { FactsSuppliers } from "@/components/sections/facts-suppliers";
import { G8 } from "@/components/sections/g8";
import { HeroSheet } from "@/components/sections/hero-sheet";
import { Notes } from "@/components/sections/notes";
import { Order70Tool } from "@/components/sections/order70-tool";
import { Process } from "@/components/sections/process";
import { Production } from "@/components/sections/production";
import { Stages } from "@/components/sections/stages";
import { SheetRuler, sheetTag } from "@/components/sheet";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { WhatsappFab } from "@/components/whatsapp-fab";
import { getDictionary } from "@/content/dictionaries";
import type { Locale } from "@/lib/i18n";

/**
 * The whole landing for one locale, as a set of drawing sheets: 01 first screen, 02 Order No. 70,
 * 03 index, 04 process, 05 production, 06 brands, 07 notes, 08 closing.
 */
export const LandingPage = ({ locale }: { locale: Locale }): React.JSX.Element => {
  const t = getDictionary(locale);
  const sheet = (n: number): string => sheetTag(t.stamp, n);

  return (
    <>
      <JsonLd locale={locale} t={t} />
      <BlueprintIntro t={t.intro} />
      <SheetRuler />
      <SiteHeader locale={locale} t={t.nav} />
      <main id="main">
        <HeroSheet locale={locale} t={t} />
        <Stages t={t.stages} />
        <Order70Tool t={t.order70} items={t.cabinets.items} sheet={sheet(2)} />
        <CabinetIndex
          copy={t.index}
          items={t.cabinets.items}
          tour={t.cabinets.tour}
          quote={t.cabinets.quote}
          quoteTemplate={t.contact.messageTemplate}
          sheet={sheet(3)}
        />
        <Process t={t.process} sheet={sheet(4)} />
        <Production t={t} sheet={sheet(5)} />
        <FactsSuppliers locale={locale} t={t} sheet={sheet(6)} />
        <Notes t={t} sheet={sheet(7)} />
        <G8 t={t.g8} />
        <Closing t={t.contact} address={t.footer.address} items={t.cabinets.items} sheet={sheet(8)} />
      </main>
      <SiteFooter locale={locale} t={t} />
      <WhatsappFab label={t.whatsappFab} />
    </>
  );
};

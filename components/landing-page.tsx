import { BlueprintIntro } from "@/components/intro/blueprint-intro";
import { JsonLd } from "@/components/json-ld";
import { Brands } from "@/components/sections/brands";
import { CabinetIndex } from "@/components/sections/cabinet-index";
import { ContactCta } from "@/components/sections/contact-cta";
import { Faq } from "@/components/sections/faq";
import { G8 } from "@/components/sections/g8";
import { HeroSheet } from "@/components/sections/hero-sheet";
import { Order70Tool } from "@/components/sections/order70-tool";
import { Process } from "@/components/sections/process";
import { Stages } from "@/components/sections/stages";
import { Stats } from "@/components/sections/stats";
import { Team } from "@/components/sections/team";
import { SheetRuler, sheetTag } from "@/components/sheet";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { WhatsappFab } from "@/components/whatsapp-fab";
import { getDictionary } from "@/content/dictionaries";
import type { Locale } from "@/lib/i18n";

/** The whole landing for one locale. */
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
        <Stats locale={locale} t={t.stats} />
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

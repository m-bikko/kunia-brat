import { IntroScene } from "@/components/intro/intro-scene";
import { IntroStage } from "@/components/intro/intro-stage";
import { CabinetsV2 } from "@/components/v2/cabinets-v2";
import { FooterV2 } from "@/components/v2/footer-v2";
import { HeaderV2 } from "@/components/v2/header-v2";
import { HeroV2 } from "@/components/v2/hero-v2";
import { Order70V2 } from "@/components/v2/order70-v2";
import { ProcessV2 } from "@/components/v2/process-v2";
import { StagesV2 } from "@/components/v2/stages-v2";
import { WhatsappFab } from "@/components/whatsapp-fab";
import { getDictionary } from "@/content/dictionaries";
import { nunito } from "@/lib/fonts-v2";
import type { Locale } from "@/lib/i18n";
import { introPools } from "@/lib/intro";
import { cn } from "@/lib/utils";

/**
 * v2 «Мягкая»: the same story and order of blocks as v1, told with rounded stickers and cartoon art.
 * Lives at /v2, /kk/v2 and /en/v2, closed to indexing.
 */
export const LandingV2 = ({ locale }: { locale: Locale }): React.JSX.Element => {
  const t = getDictionary(locale);

  return (
    <div className={cn(nunito.variable, "v2 min-h-dvh")}>
      <IntroStage version="v2" t={t.intro}>
        {introPools.v2.map((kind) => (
          <IntroScene key={kind} kind={kind} caption={t.intro.captions[kind]} />
        ))}
      </IntroStage>
      <HeaderV2 locale={locale} t={t.nav} menuLabel={t.v2.menuLabel} />
      <main id="main">
        <HeroV2 locale={locale} t={t} />
        <StagesV2 t={t.stages} />
        <Order70V2 locale={locale} t={t.order70} copy={t.v2.order70} items={t.cabinets.items} />
        <CabinetsV2 locale={locale} t={t} />
        <ProcessV2 t={t.process} states={t.v2.process.states} />
      </main>
      <FooterV2 locale={locale} t={t} />
      <WhatsappFab label={t.whatsappFab} variant="soft" />
    </div>
  );
};

import type { ReactNode } from "react";

import { Analytics } from "@/components/analytics";
import { MotionProvider } from "@/components/providers/motion-provider";
import { fontVariables } from "@/lib/fonts";
import type { Locale } from "@/lib/i18n";

/** <html>/<body> shell shared by the Russian root layout and the /kk, /en root layout. */
export const SiteDocument = ({ locale, children }: { locale: Locale; children: ReactNode }): React.JSX.Element => (
  <html lang={locale} className={fontVariables}>
    <body className="min-h-dvh">
      <MotionProvider>{children}</MotionProvider>
      <Analytics />
    </body>
  </html>
);

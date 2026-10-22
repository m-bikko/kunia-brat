import type { ReactNode } from "react";

import { Analytics } from "@/components/analytics";
import { IntroBoot } from "@/components/intro/intro-boot";
import { MotionProvider } from "@/components/providers/motion-provider";
import { fontVariables } from "@/lib/fonts";
import type { Locale } from "@/lib/i18n";

/**
 * <html>/<body> shell shared by both root layouts. `suppressHydrationWarning` on <html> because the
 * intro boot script sets data-intro before React hydrates.
 */
export const SiteDocument = ({ locale, children }: { locale: Locale; children: ReactNode }): React.JSX.Element => (
  <html lang={locale} className={fontVariables} suppressHydrationWarning>
    <body className="min-h-dvh">
      {/* First in <body>: runs before anything below is parsed or painted. */}
      <IntroBoot />
      <MotionProvider>{children}</MotionProvider>
      <Analytics />
    </body>
  </html>
);

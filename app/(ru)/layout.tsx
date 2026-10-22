import "../globals.css";

import { SiteDocument } from "@/components/site-document";
import { buildMetadata } from "@/lib/metadata";

export { viewport } from "@/lib/metadata";

/** Root layout for the Russian landing at "/" (the default locale keeps the live URLs). */
export const metadata = buildMetadata("ru");

const RussianLayout = ({ children }: LayoutProps<"/">): React.JSX.Element => (
  <SiteDocument locale="ru">{children}</SiteDocument>
);

export default RussianLayout;

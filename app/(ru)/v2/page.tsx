import { LandingV2 } from "@/components/v2/landing-v2";
import { buildV2Metadata } from "@/lib/metadata";

export const ensureStatic = "navigation";

export const metadata = buildV2Metadata("ru");

const SoftHomePage = (): React.JSX.Element => <LandingV2 locale="ru" />;

export default SoftHomePage;

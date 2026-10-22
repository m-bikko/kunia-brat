/**
 * Company facts and outbound links shared by every section.
 * Values mirror the live axisgroup.kz site.
 */
export const site = {
  name: "AXIS",
  legalName: "AxisGroup",
  url: "https://axisgroup.kz",
  phoneDisplay: "+7 706 667 75 75",
  phoneHref: "tel:+77066677575",
  whatsappNumber: "77066677575",
  email: "info@axisgroup.kz",
  g8Url: "https://gate-eight.tech/",
} as const;

/** Inner pages of the current site. They are Russian-only for now. */
export const sitePaths = {
  catalog: "/catalog",
  services: "/services",
  about: "/about",
  guide: "/guides/osnashchenie-shkolnogo-kabineta",
  order70: "/guides/prikaz-70-osnashchenie-shkol",
} as const;

/** WhatsApp deep link, optionally with a prefilled message. */
export const whatsappUrl = (text?: string): string => {
  const base = `https://api.whatsapp.com/send?phone=${site.whatsappNumber}`;
  return text ? `${base}&text=${encodeURIComponent(text)}` : base;
};

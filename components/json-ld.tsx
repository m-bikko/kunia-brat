import type { Dictionary } from "@/content/types";
import { localePath, type Locale } from "@/lib/i18n";
import { site } from "@/lib/site";

interface JsonLdProps {
  locale: Locale;
  t: Dictionary;
}

/** Organization + WebSite + FAQPage structured data for the landing. */
export const JsonLd = ({ locale, t }: JsonLdProps): React.JSX.Element => {
  const pageUrl = new URL(localePath(locale), site.url).toString();

  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${site.url}/#organization`,
        name: site.name,
        alternateName: site.legalName,
        url: site.url,
        logo: `${site.url}/brand/axis-logo.png`,
        email: site.email,
        telephone: site.phoneHref.replace("tel:", ""),
        description: t.footer.about,
        address: {
          "@type": "PostalAddress",
          addressLocality: "Almaty",
          addressCountry: "KZ",
          streetAddress: t.footer.address,
        },
        areaServed: { "@type": "Country", name: "Kazakhstan" },
      },
      {
        "@type": "WebSite",
        "@id": `${pageUrl}#website`,
        url: pageUrl,
        name: t.meta.title,
        inLanguage: locale,
        publisher: { "@id": `${site.url}/#organization` },
      },
      {
        "@type": "FAQPage",
        "@id": `${pageUrl}#faq`,
        inLanguage: locale,
        mainEntity: t.faq.items.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
};

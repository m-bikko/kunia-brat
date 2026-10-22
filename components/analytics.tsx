import Script from "next/script";

/**
 * GA4 + Yandex Metrika, production only.
 * IDs come from NEXT_PUBLIC_GA_ID / NEXT_PUBLIC_YM_ID (see .env.example).
 * Both are validated before being inlined so a bad env value cannot inject script.
 */
const gaId = process.env.NEXT_PUBLIC_GA_ID;
const ymId = process.env.NEXT_PUBLIC_YM_ID;

const isValidGaId = (id: string | undefined): id is string => !!id && /^G-[A-Z0-9]+$/.test(id);
const isValidYmId = (id: string | undefined): id is string => !!id && /^\d+$/.test(id);

export const Analytics = (): React.JSX.Element | null => {
  if (process.env.NODE_ENV !== "production") return null;

  return (
    <>
      {isValidGaId(gaId) && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
          <Script id="ga4-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaId}');`}
          </Script>
        </>
      )}
      {isValidYmId(ymId) && (
        <Script id="ym-init" strategy="afterInteractive">
          {`(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};m[i].l=1*new Date();for(var j=0;j<document.scripts.length;j++){if(document.scripts[j].src===r){return;}}k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})(window,document,"script","https://mc.yandex.ru/metrika/tag.js?id=${ymId}","ym");ym(${ymId},"init",{clickmap:true,trackLinks:true,accurateTrackBounce:true});`}
        </Script>
      )}
    </>
  );
};

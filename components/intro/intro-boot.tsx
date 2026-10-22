import { INTRO } from "@/components/intro/timeline";

/**
 * Runs while the HTML is parsed, before the first paint. Plays the intro on the first visit of the
 * session, unless the visitor prefers reduced motion, the browser is automated or the URL has an
 * #anchor. `?intro=1` forces it, `?intro=0` disables it. Failsafe: ends the intro after
 * INTRO.failsafeMs even if the app's JavaScript never loads; the intro component cancels this timer
 * (window.__axisIntroTimer) when it takes over.
 */
const script = `(function(){try{var d=document.documentElement,q=new URLSearchParams(location.search).get("intro");var play=q==="1"||(q!=="0"&&!location.hash&&sessionStorage.getItem("axis-intro")!=="seen"&&!navigator.webdriver&&!matchMedia("(prefers-reduced-motion: reduce)").matches);if(!play)return;d.setAttribute("data-intro","play");sessionStorage.setItem("axis-intro","seen");window.__axisIntroStart=performance.now();window.__axisIntroTimer=setTimeout(function(){d.removeAttribute("data-intro")},${INTRO.failsafeMs})}catch(e){}})();`;

export const IntroBoot = (): React.JSX.Element => <script dangerouslySetInnerHTML={{ __html: script }} />;

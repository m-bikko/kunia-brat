import { INTRO } from "@/components/intro/timeline";
import { introPools, introStorageKeys, pickIntro, versionOfPath } from "@/lib/intro";

/**
 * Runs while the HTML is parsed, before the first paint. On the first visit of the session (per site
 * version) it picks an intro from the version's pool, never the one shown last, and marks
 * <html data-intro="play" data-intro-kind="…">. Skipped for reduced motion, automated browsers and
 * #anchors. `?intro=<kind>` plays that kind, any other non-zero `?intro=` plays a random one, `?intro=0`
 * disables it. Failsafe: ends the intro after INTRO.failsafeMs even if the app's JavaScript never loads;
 * the intro controller cancels this timer (window.__axisIntroTimer) when it takes over.
 */
const script = `(function(){try{var d=document.documentElement,q=new URLSearchParams(location.search).get("intro"),v=(${versionOfPath.toString()})(location.pathname),pool=${JSON.stringify(introPools)}[v],keys=${JSON.stringify(introStorageKeys)}[v];var play=(q!==null&&q!=="0")||(q!=="0"&&!location.hash&&sessionStorage.getItem(keys.session)!=="seen"&&!navigator.webdriver&&!matchMedia("(prefers-reduced-motion: reduce)").matches);if(!play||!pool.length)return;var last=null;try{last=localStorage.getItem(keys.last)}catch(e){}var kind=pool.indexOf(q)>=0?q:(${pickIntro.toString()})(pool,last,Math.random());d.setAttribute("data-intro","play");d.setAttribute("data-intro-kind",kind);window.__axisIntroStart=performance.now();window.__axisIntroTimer=setTimeout(function(){d.removeAttribute("data-intro")},${INTRO.failsafeMs});try{sessionStorage.setItem(keys.session,"seen");localStorage.setItem(keys.last,kind)}catch(e){}}catch(e){}})();`;

export const IntroBoot = (): React.JSX.Element => <script dangerouslySetInnerHTML={{ __html: script }} />;

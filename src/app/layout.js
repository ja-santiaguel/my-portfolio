// Imports
import { Archivo, Bodoni_Moda } from "next/font/google";
import "@/styles/globals.css";
import { pageMetadata, siteUrl } from "@/lib/metadata";
// Components
import Header from "@/components/Header";
import BackToTop from "@/components/BackToTop";
import Cursor from "@/components/Cursor";
import PageTransition, { NavigationGate } from "@/components/PageTransition";
import ViewTrigger from "@/components/ViewTrigger";
import ScrollTimelineFallback from "@/components/ScrollTimelineFallback";

// The display face, self-hosted by next/font (2026-10-28 ship-check; it was
// a render-blocking Google Fonts stylesheet). Archivo replaced Oswald
// (2026-11-02, Jonathan): the variable font covers every weight and width;
// CSS sets it ExtraCondensed through --font-archivo (globals.css
// --font-display). Bodoni Moda italic (2026-11-02, Jonathan; Instrument Serif
// before) is the second face of the mixed display letters
// (lib/serifLetters.js): variable, with its optical-size axis, so display
// sizes get the high-contrast cut.
const bodoniModa = Bodoni_Moda({
  subsets: ["latin"],
  style: "italic",
  axes: ["opsz"],
  display: "swap",
  variable: "--font-serif-face",
});
const archivo = Archivo({ subsets: ["latin"], display: "swap", variable: "--font-archivo", axes: ["wdth"] });

export const metadata = {
  metadataBase: new URL(siteUrl),
  ...pageMetadata({
    path: "/",
    title: "Jonathan Andrew | UX/UI Designer & Frontend Developer",
    description:
      "Portfolio of Jonathan Andrew Santiaguel, a UX/UI designer and frontend developer in Greater Vancouver, BC, designing and building websites and apps from research to launch.",
  }),
};

// Marks the page as running JavaScript (html[data-js], so the serif letters can
// wait hidden until they are fitted), and decides before first paint whether
// the home page opens with the montage:
// every full load (or refresh) of "/", never with reduced motion. Navigating
// back to "/" inside the site does not replay it.
const introScript = `try{document.documentElement.dataset.js="";if(location.pathname==="/"&&!location.hash&&!matchMedia("(prefers-reduced-motion: reduce)").matches){document.documentElement.dataset.intro="playing"}}catch(e){}`;

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${archivo.variable} ${bodoniModa.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: introScript }} />
        <link
          rel="icon"
          href="/favicon-light.svg"
          type="image/svg+xml"
          media="(prefers-color-scheme: light)"
        />
        <link
          rel="icon"
          href="/favicon-dark.svg"
          type="image/svg+xml"
          media="(prefers-color-scheme: dark)"
        />
      </head>
      <body className="antialiased">
        <Header />
        <NavigationGate>{children}</NavigationGate>
        <BackToTop />
        <Cursor />
        <PageTransition />
        <ViewTrigger />
        <ScrollTimelineFallback />
      </body>
    </html>
  );
}

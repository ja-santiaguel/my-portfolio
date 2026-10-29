// Imports
import { Oswald } from "next/font/google";
import "@/styles/globals.css";
import { pageMetadata, siteUrl } from "@/lib/metadata";
// Components
import Header from "@/components/Header";
import BackToTop from "@/components/BackToTop";
import Cursor from "@/components/Cursor";
import PageTransition, { NavigationGate } from "@/components/PageTransition";
import ViewTrigger from "@/components/ViewTrigger";

// The display face, self-hosted by next/font (2026-10-28 ship-check; it was
// a render-blocking Google Fonts stylesheet). The variable font covers every
// weight; CSS uses it through --font-oswald (globals.css --font-display).
const oswald = Oswald({ subsets: ["latin"], display: "swap", variable: "--font-oswald" });

export const metadata = {
  metadataBase: new URL(siteUrl),
  ...pageMetadata({
    path: "/",
    title: "Jonathan Andrew | UX/UI Designer & Frontend Developer",
    description:
      "Portfolio of Jonathan Andrew Santiaguel, a UX/UI designer and frontend developer in Greater Vancouver, BC, designing and building websites and apps from research to launch.",
  }),
};

// Decides before first paint whether the home page opens with the montage:
// every full load (or refresh) of "/", never with reduced motion. Navigating
// back to "/" inside the site does not replay it.
const introScript = `try{if(location.pathname==="/"&&!location.hash&&!matchMedia("(prefers-reduced-motion: reduce)").matches){document.documentElement.dataset.intro="playing"}}catch(e){}`;

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={oswald.variable} suppressHydrationWarning>
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
      </body>
    </html>
  );
}

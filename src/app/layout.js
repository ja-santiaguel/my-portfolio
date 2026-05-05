// Imports
import "@/styles/globals.css";
// Components
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SlidingText from "@/components/SlidingText";

export const metadata = {
  title: "(WIP) Jonathan Andrew - Digital Designer",
  description:
    "Portfolio of Jonathan Andrew, a Digital Designer based in Greater Vancouver, British Columbia.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="icon"
          href="/favicon-light.svg"
          type="image/svgxml"
          media="(prefers-color-scheme: light)"
        />
        <link
          rel="icon"
          href="/favicon-dark.svg"
          type="image/svgxml"
          media="(prefers-color-scheme: dark)"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=My+Soul&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Libre+Barcode+39+Text&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Geologica:wght,CRSV@100..900,1&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Oswald:wght@200..700&display=swap"
          rel="stylesheet"
        ></link>
      </head>
      <body className="antialiased">
        <SlidingText />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}

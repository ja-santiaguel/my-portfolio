// Per-page metadata (2026-10-28 ship-check): the title and description, plus
// the canonical URL, Open Graph and Twitter tags built from them, so a shared
// link always shows the page's own title over the site's preview image.

export const siteUrl = "https://www.jasantiaguel.com";

const image = {
  url: "/og.png",
  width: 1200,
  height: 630,
  alt: "Jonathan Andrew, UX/UI Designer & Frontend Developer",
};

export function pageMetadata({ path, title, description }) {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: "Jonathan Andrew",
      locale: "en_CA",
      url: path,
      title,
      description,
      images: [image],
    },
    twitter: { card: "summary_large_image", title, description, images: [image.url] },
  };
}

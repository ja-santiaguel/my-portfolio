import { projects } from "@/content/projects";
import { siteUrl } from "@/lib/metadata";

// Every public page: home, About and each project with a page.
export default function sitemap() {
  const paths = ["/", "/about", ...projects.filter((p) => p.href).map((p) => p.href)];
  return paths.map((path) => ({ url: `${siteUrl}${path === "/" ? "" : path}` }));
}

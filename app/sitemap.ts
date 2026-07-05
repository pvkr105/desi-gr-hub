import type { MetadataRoute } from "next";
import { site } from "@/data/site";
import { groups } from "@/data/groups";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/groups",
    "/guidelines",
    "/safety",
    "/faq",
    "/announcements",
    "/newcomers",
    "/businesses",
    "/contact",
  ];
  const now = new Date();

  const staticEntries = routes.map((path) => ({
    url: `${site.url}${path}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  const groupEntries = groups.map((g) => ({
    url: `${site.url}/groups/${g.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticEntries, ...groupEntries];
}

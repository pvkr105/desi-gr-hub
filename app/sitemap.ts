import type { MetadataRoute } from "next";
import { site } from "@/data/site";
import { groups } from "@/data/groups";
import { listQuestionIdsForSitemap } from "@/lib/queries";

// Revalidate daily so newly-posted questions appear in the sitemap.
export const revalidate = 86400;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes = [
    "",
    "/community",
    "/community/questions",
    "/community/housing",
    "/community/marketplace",
    "/groups",
    "/guidelines",
    "/safety",
    "/faq",
    "/announcements",
    "/events",
    "/newcomers",
    "/businesses",
    "/currency",
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

  // Q&A detail pages are indexable (listings are noindex). Empty until Supabase is configured.
  const questions = await listQuestionIdsForSitemap();
  const questionEntries = questions.map((q) => ({
    url: `${site.url}/community/questions/${q.id}`,
    lastModified: new Date(q.created_at),
    changeFrequency: "weekly" as const,
    priority: 0.5,
  }));

  return [...staticEntries, ...groupEntries, ...questionEntries];
}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { listPosts } from "@/lib/queries";
import { SEGMENT_TO_TYPE, TYPE_META, CATEGORIES } from "@/lib/community";
import { communityDisclaimer } from "@/data/safety";
import { PageHeader } from "@/components/PageHeader";
import { PostCard } from "@/components/community/PostCard";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ type: string }>;
}): Promise<Metadata> {
  const { type } = await params;
  const postType = SEGMENT_TO_TYPE[type];
  if (!postType) return {};
  const meta = TYPE_META[postType];
  return {
    title: meta.label,
    description: meta.blurb,
    alternates: { canonical: `/community/${type}` },
  };
}

export default async function CommunityTypePage({
  params,
  searchParams,
}: {
  params: Promise<{ type: string }>;
  searchParams: Promise<{ category?: string; sort?: string }>;
}) {
  const { type } = await params;
  const postType = SEGMENT_TO_TYPE[type];
  if (!postType) notFound();

  const { category, sort } = await searchParams;
  const meta = TYPE_META[postType];
  const posts = await listPosts(postType, {
    category,
    sort: sort === "top" ? "top" : "new",
  });

  const pill = "inline-flex min-h-11 items-center rounded-full px-4 text-sm";
  const active = "bg-bg-soft text-saffron font-semibold";
  const idle = "text-muted border border-line";

  return (
    <>
      <PageHeader title={`${meta.emoji} ${meta.label}`} intro={meta.blurb} />

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <Link
          href={`/community/new?type=${type}`}
          className="glass inline-flex min-h-11 items-center rounded-xl border-line px-4 text-sm font-semibold"
        >
          ＋ New post
        </Link>
        <div className="flex gap-2">
          <Link
            href={`/community/${type}?sort=new${category ? `&category=${category}` : ""}`}
            className={`${pill} ${sort !== "top" ? active : idle}`}
          >
            Newest
          </Link>
          <Link
            href={`/community/${type}?sort=top${category ? `&category=${category}` : ""}`}
            className={`${pill} ${sort === "top" ? active : idle}`}
          >
            Top
          </Link>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        <Link
          href={`/community/${type}${sort === "top" ? "?sort=top" : ""}`}
          className={`${pill} ${!category ? active : idle}`}
        >
          All
        </Link>
        {CATEGORIES[postType].map((c) => (
          <Link
            key={c}
            href={`/community/${type}?category=${encodeURIComponent(c)}${sort === "top" ? "&sort=top" : ""}`}
            className={`${pill} ${category === c ? active : idle}`}
          >
            {c}
          </Link>
        ))}
      </div>

      {posts.length === 0 ? (
        <div className="glass rounded-2xl p-8 text-center text-muted">
          Nothing here yet. Be the first to post a {meta.noun}.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {posts.map((p) => (
            <PostCard key={p.id} post={p} />
          ))}
        </div>
      )}

      <div className="glass mt-8 rounded-2xl border-line p-4 text-xs text-muted">
        {communityDisclaimer}
      </div>
    </>
  );
}

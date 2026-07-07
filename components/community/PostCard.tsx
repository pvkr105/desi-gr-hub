import Link from "next/link";
import type { Post } from "@/lib/types";
import { TYPE_TO_SEGMENT, formatPrice, timeAgo } from "@/lib/community";

// Fully-tappable post card, styled after GroupCard. Shows vote score for
// questions, price/location for listings.
export function PostCard({ post }: { post: Post }) {
  const href = `/community/${TYPE_TO_SEGMENT[post.type]}/${post.id}`;
  const price = post.type === "question" ? null : formatPrice(post.price);

  return (
    <div className="glass group relative flex flex-col gap-2 rounded-2xl p-5 transition-transform hover:-translate-y-0.5">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-display text-lg font-bold">
          <Link href={href} className="after:absolute after:inset-0">
            {post.title}
          </Link>
        </h3>
        {post.type === "question" && (
          <span className="shrink-0 text-sm text-muted" aria-label={`${post.score} votes`}>
            ▲ {post.score}
          </span>
        )}
      </div>

      {price && <p className="gradient-text text-xl font-bold">{price}</p>}

      <div className="mt-auto flex flex-wrap items-center gap-2 pt-1 text-xs text-muted">
        {post.category && (
          <span className="rounded-full border border-line px-2.5 py-0.5">{post.category}</span>
        )}
        {post.location && <span>{post.location}</span>}
        <span>{timeAgo(post.created_at)}</span>
        <span>· {post.author?.display_name ?? "Member"}</span>
      </div>
    </div>
  );
}

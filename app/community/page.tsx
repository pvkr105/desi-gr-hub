import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { TYPE_META, TYPE_TO_SEGMENT } from "@/lib/community";
import { communityDisclaimer } from "@/data/safety";
import type { PostType } from "@/lib/types";

export const metadata: Metadata = {
  title: "Community Board",
  description:
    "The Desi GR Hub community board for Grand Rapids and West Michigan: ask questions, find housing and roommates, and buy or sell in the local Indian & South Asian community.",
  alternates: { canonical: "/community" },
};

const ORDER: PostType[] = ["question", "housing", "marketplace"];

export default function CommunityPage() {
  return (
    <>
      <PageHeader
        title="Community Board"
        intro="Ask the community, find a room or roommate, and buy or sell locally. Free for everyone in Grand Rapids & West Michigan. Sign in to post."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        {ORDER.map((t) => {
          const m = TYPE_META[t];
          return (
            <Link
              key={t}
              href={`/community/${TYPE_TO_SEGMENT[t]}`}
              className="glass rounded-2xl p-6 transition-transform hover:-translate-y-0.5"
            >
              <div className="text-3xl" aria-hidden>
                {m.emoji}
              </div>
              <h2 className="mt-3 font-display text-xl font-bold">{m.label}</h2>
              <p className="mt-2 text-sm text-muted">{m.blurb}</p>
              <span className="mt-3 inline-block text-sm text-saffron">Open →</span>
            </Link>
          );
        })}
      </div>

      <div className="glass mt-8 rounded-2xl p-5">
        <p className="text-sm text-muted">{communityDisclaimer}</p>
      </div>

      <p className="mt-6 text-sm text-muted">
        Want to post?{" "}
        <Link href="/account?next=/community" className="text-saffron underline underline-offset-2">
          Sign in
        </Link>{" "}
        with Google or your email, it&apos;s free.
      </p>
    </>
  );
}

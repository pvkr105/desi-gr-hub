import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/queries";
import { SEGMENT_TO_TYPE, TYPE_TO_SEGMENT, TYPE_META } from "@/lib/community";
import type { PostType } from "@/lib/types";
import { PageHeader } from "@/components/PageHeader";
import { PostForm } from "@/components/community/PostForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "New post",
  robots: { index: false },
};

const ORDER: PostType[] = ["question", "housing", "marketplace"];

export default async function NewPostPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; error?: string }>;
}) {
  const { type: segParam, error } = await searchParams;
  const seg = segParam ?? "questions";
  const postType = SEGMENT_TO_TYPE[seg] ?? "question";

  const user = await getCurrentUser();
  if (!user) redirect("/account?next=/community/new");

  const pill = "inline-flex min-h-11 items-center rounded-full px-4 text-sm";
  const active = "bg-bg-soft text-saffron font-semibold";
  const idle = "text-muted border border-line";

  return (
    <>
      <PageHeader
        title="Create a post"
        intro="Share with the Desi GR Hub community across Grand Rapids and West Michigan."
      />

      <div className="mb-6 flex flex-wrap gap-2">
        {ORDER.map((t) => {
          const s = TYPE_TO_SEGMENT[t];
          return (
            <Link
              key={t}
              href={`/community/new?type=${s}`}
              className={`${pill} ${postType === t ? active : idle}`}
            >
              {TYPE_META[t].emoji} {TYPE_META[t].label}
            </Link>
          );
        })}
      </div>

      {error && (
        <p className="glass mb-6 rounded-2xl border-saffron/60 p-4 text-sm text-saffron">
          ⚠️ {error.slice(0, 200)}
        </p>
      )}

      <PostForm type={postType} />
    </>
  );
}

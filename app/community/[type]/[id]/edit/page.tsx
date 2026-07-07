import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getPost, getCurrentUser } from "@/lib/queries";
import { SEGMENT_TO_TYPE, TYPE_TO_SEGMENT, canEdit } from "@/lib/community";
import { PageHeader } from "@/components/PageHeader";
import { PostForm } from "@/components/community/PostForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Edit post",
  robots: { index: false },
};

export default async function EditPostPage({
  params,
  searchParams,
}: {
  params: Promise<{ type: string; id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { type, id } = await params;
  const { error } = await searchParams;
  if (!SEGMENT_TO_TYPE[type]) notFound();

  const post = await getPost(id);
  if (!post || TYPE_TO_SEGMENT[post.type] !== type) notFound();

  const user = await getCurrentUser();
  const path = `/community/${type}/${post.id}`;
  if (!user) redirect(`/account?next=${path}/edit`);
  if (user.id !== post.author_id) redirect(path);

  if (!canEdit(post.created_at)) {
    return (
      <div className="glass rounded-2xl p-5">
        <p className="text-sm">
          The 24-hour editing window has closed. Please delete and repost.
        </p>
        <Link
          href={path}
          className="mt-4 inline-flex min-h-11 items-center rounded-full border border-line px-5 text-sm font-medium hover:border-saffron"
        >
          Back to the post
        </Link>
      </div>
    );
  }

  return (
    <>
      <PageHeader title="Edit post" />
      {error && (
        <p className="glass mb-6 rounded-2xl border-saffron/60 p-4 text-sm text-saffron">
          ⚠️ {error.slice(0, 200)}
        </p>
      )}
      <PostForm type={post.type} post={post} />
    </>
  );
}

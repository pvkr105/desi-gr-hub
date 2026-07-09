import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPost, getCurrentUser, listAnswers, getMyVotes } from "@/lib/queries";
import Link from "next/link";
import { SEGMENT_TO_TYPE, TYPE_TO_SEGMENT, TYPE_META, formatPrice, timeAgo, canEdit } from "@/lib/community";
import { closePost, deletePost } from "@/app/community/actions";
import type { Post } from "@/lib/types";
import { JsonLd } from "@/components/JsonLd";
import { VoteButtons } from "@/components/community/VoteButtons";
import { ReportButton } from "@/components/community/ReportButton";
import { AnswerList } from "@/components/community/AnswerList";
import { AnswerForm } from "@/components/community/AnswerForm";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ type: string; id: string }>;
}): Promise<Metadata> {
  const { type, id } = await params;
  const post = await getPost(id);
  if (!post || TYPE_TO_SEGMENT[post.type] !== type) return {};
  if (post.type !== "question") {
    return { title: post.title, robots: { index: false } };
  }
  return {
    title: post.title,
    description: post.body.slice(0, 150),
    alternates: { canonical: `/community/${type}/${post.id}` },
  };
}

export default async function PostDetailPage({
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
  const canVote = !!user;
  const canReport = !!user;
  const isOwner = user?.id === post.author_id;
  const isAdmin = !!user?.profile?.is_admin;
  const currentPath = `/community/${type}/${post.id}`;

  const meta = TYPE_META[post.type];

  return (
    <article>
      <div className="mb-2 text-sm text-muted">{meta.emoji} {meta.label}</div>
      <h1 className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl">
        {post.title}
      </h1>
      <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-muted">
        <span>{post.author?.display_name ?? "Community member"}</span>
        <span aria-hidden>·</span>
        <time dateTime={post.created_at}>{timeAgo(post.created_at)}</time>
        {post.category && (
          <span className="rounded-full bg-bg-soft px-3 py-0.5 text-xs text-saffron">
            {post.category}
          </span>
        )}
        {post.status === "closed" && (
          <span className="rounded-full border border-line px-3 py-0.5 text-xs">Closed</span>
        )}
      </div>

      {post.type !== "question" && (
        <div className="mt-4 flex flex-wrap items-center gap-4">
          {formatPrice(post.price) && (
            <span className="gradient-text font-display text-2xl font-bold">
              {formatPrice(post.price)}
            </span>
          )}
          {post.location && <span className="text-sm text-muted">📍 {post.location}</span>}
        </div>
      )}

      <p className="mt-4 whitespace-pre-wrap leading-relaxed">{post.body}</p>

      {post.image_urls?.length > 0 && (
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {post.image_urls.map((url) => (
            <a key={url} href={url} target="_blank" rel="noopener noreferrer">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" loading="lazy" className="w-full rounded-xl" />
            </a>
          ))}
        </div>
      )}

      {error && (
        <p className="glass mt-6 rounded-2xl border-saffron/60 p-4 text-sm text-saffron">
          ⚠️ {error.slice(0, 200)}
        </p>
      )}

      {post.type === "question" ? (
        <QuestionThread post={post} canVote={canVote} canReport={canReport} path={currentPath} />
      ) : (
        <div className="glass mt-6 rounded-2xl p-5">
          <h2 className="font-display text-lg font-bold">Contact</h2>
          {user ? (
            <>
              {post.contact ? (
                post.contact.startsWith("http") ? (
                  <a
                    href={post.contact}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass mt-3 inline-flex min-h-11 items-center rounded-xl border-line px-4 text-sm font-semibold"
                  >
                    Contact the poster
                  </a>
                ) : (
                  <p className="mt-3 whitespace-pre-wrap text-sm">{post.contact}</p>
                )
              ) : (
                <p className="mt-3 text-sm text-muted">No contact info provided.</p>
              )}
            </>
          ) : (
            <p className="mt-3 text-sm text-muted">
              <Link
                href={`/account?next=${encodeURIComponent(currentPath)}`}
                className="text-saffron underline underline-offset-2"
              >
                Sign in
              </Link>{" "}
              to see contact info
            </p>
          )}
          {post.expires_at && (
            <p className="mt-4 text-xs text-muted">
              Listing expires {new Date(post.expires_at).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          )}
        </div>
      )}

      <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-line pt-6">
        <ReportButton
          targetType="post"
          targetId={post.id}
          path={currentPath}
          canReport={canReport}
        />
        {isOwner && canEdit(post.created_at) && (
          <Link
            href={`${currentPath}/edit`}
            className="inline-flex min-h-11 items-center rounded-xl border border-line px-4 text-sm font-medium text-muted hover:border-saffron"
          >
            Edit
          </Link>
        )}
        {(isOwner || isAdmin) && post.status !== "closed" && (
          <form action={closePost}>
            <input type="hidden" name="id" value={post.id} />
            <input type="hidden" name="path" value={currentPath} />
            <button
              type="submit"
              className="inline-flex min-h-11 items-center rounded-xl border border-line px-4 text-sm font-medium text-muted"
            >
              Mark as closed
            </button>
          </form>
        )}
        {(isOwner || isAdmin) && (
          <form action={deletePost}>
            <input type="hidden" name="id" value={post.id} />
            <input type="hidden" name="type" value={post.type} />
            <input type="hidden" name="path" value={currentPath} />
            <button
              type="submit"
              className="inline-flex min-h-11 items-center rounded-xl border border-line px-4 text-sm font-medium text-muted"
            >
              Delete
            </button>
          </form>
        )}
      </div>
    </article>
  );
}

// The Q&A thread: post vote, answers, answer form, and QAPage JSON-LD —
// one component so answers are fetched once and shared.
async function QuestionThread({
  post,
  canVote,
  canReport,
  path,
}: {
  post: Post;
  canVote: boolean;
  canReport: boolean;
  path: string;
}) {
  const [postVotes, answers] = await Promise.all([
    getMyVotes("post", [post.id]),
    listAnswers(post.id),
  ]);
  const answerVotes = await getMyVotes(
    "answer",
    answers.map((a) => a.id),
  );

  const suggested = answers.map((a) => ({
    "@type": "Answer",
    text: a.body,
    upvoteCount: a.score,
    dateCreated: a.created_at,
    author: { "@type": "Person", name: a.author?.display_name ?? "Community member" },
  }));
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "QAPage",
    mainEntity: {
      "@type": "Question",
      name: post.title,
      text: post.body,
      answerCount: answers.length,
      ...(suggested.length > 0
        ? { acceptedAnswer: suggested[0], suggestedAnswer: suggested }
        : {}),
    },
  };

  return (
    <>
      <div className="mt-6">
        <VoteButtons
          targetType="post"
          targetId={post.id}
          score={post.score}
          myVote={postVotes[post.id]}
          path={path}
          canVote={canVote}
        />
      </div>
      <AnswerList
        answers={answers}
        myVotes={answerVotes}
        canVote={canVote}
        canReport={canReport}
        postId={post.id}
      />
      <AnswerForm postId={post.id} canPost={canVote} />
      <JsonLd data={jsonLd} />
    </>
  );
}

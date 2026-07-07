import Link from "next/link";
import { addAnswer } from "@/app/community/actions";

// Answer composer for question detail pages. Signed-out members see a prompt.
export function AnswerForm({ postId, canPost }: { postId: string; canPost: boolean }) {
  if (!canPost) {
    return (
      <div className="glass rounded-2xl p-5 text-sm text-muted">
        <Link
          href={`/account?next=/community/questions/${postId}`}
          className="font-semibold text-saffron hover:underline"
        >
          Sign in to answer
        </Link>
      </div>
    );
  }

  return (
    <form action={addAnswer} className="flex flex-col gap-3">
      <input type="hidden" name="post_id" value={postId} />
      <label htmlFor="answer-body" className="text-sm font-medium">
        Your answer
      </label>
      <textarea
        id="answer-body"
        name="body"
        required
        rows={4}
        className="rounded-xl border border-line bg-bg-soft p-3 text-sm"
        placeholder="Share what you know…"
      />
      <button
        type="submit"
        className="inline-flex min-h-11 items-center justify-center self-start rounded-full border border-line px-5 text-sm font-semibold hover:border-saffron"
      >
        Post answer
      </button>
    </form>
  );
}

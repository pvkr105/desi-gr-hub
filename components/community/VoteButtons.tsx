import Link from "next/link";
import { castVote } from "@/app/community/actions";

type Props = {
  targetType: "post" | "answer";
  targetId: string;
  score: number;
  myVote?: number;
  path: string;
  canVote: boolean;
};

// Up/score/down column. Each arrow is its own form posting to castVote (toggle
// handled server-side). Logged-out visitors get links to /account instead.
export function VoteButtons({ targetType, targetId, score, myVote, path, canVote }: Props) {
  const arrow =
    "inline-flex min-h-11 min-w-11 items-center justify-center rounded-full text-lg leading-none hover:bg-bg-soft";

  if (!canVote) {
    return (
      <div className="flex flex-col items-center">
        <Link href="/account" aria-label="Sign in to vote" className={`${arrow} text-muted`}>
          ▲
        </Link>
        <span className="text-sm font-semibold tabular-nums">{score}</span>
        <Link href="/account" aria-label="Sign in to vote" className={`${arrow} text-muted`}>
          ▼
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <VoteForm
        targetType={targetType}
        targetId={targetId}
        value="1"
        path={path}
        label="Upvote"
        symbol="▲"
        className={`${arrow} ${myVote === 1 ? "text-saffron" : "text-muted"}`}
      />
      <span className="text-sm font-semibold tabular-nums">{score}</span>
      <VoteForm
        targetType={targetType}
        targetId={targetId}
        value="-1"
        path={path}
        label="Downvote"
        symbol="▼"
        className={`${arrow} ${myVote === -1 ? "text-saffron" : "text-muted"}`}
      />
    </div>
  );
}

function VoteForm({
  targetType,
  targetId,
  value,
  path,
  label,
  symbol,
  className,
}: {
  targetType: string;
  targetId: string;
  value: string;
  path: string;
  label: string;
  symbol: string;
  className: string;
}) {
  return (
    <form action={castVote}>
      <input type="hidden" name="target_type" value={targetType} />
      <input type="hidden" name="target_id" value={targetId} />
      <input type="hidden" name="value" value={value} />
      <input type="hidden" name="path" value={path} />
      <button type="submit" aria-label={label} className={className}>
        {symbol}
      </button>
    </form>
  );
}

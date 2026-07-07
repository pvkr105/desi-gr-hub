import type { Answer } from "@/lib/types";
import { timeAgo } from "@/lib/community";
import { VoteButtons } from "./VoteButtons";
import { ReportButton } from "./ReportButton";

type Props = {
  answers: Answer[];
  myVotes: Record<string, number>;
  canVote: boolean;
  canReport: boolean;
  postId: string;
};

export function AnswerList({ answers, myVotes, canVote, canReport, postId }: Props) {
  const path = `/community/questions/${postId}`;

  return (
    <section className="flex flex-col gap-4">
      <h2 className="font-display text-xl font-bold">
        {answers.length} {answers.length === 1 ? "answer" : "answers"}
      </h2>

      {answers.map((a) => (
        <div key={a.id} className="glass flex gap-4 rounded-2xl p-5">
          <VoteButtons
            targetType="answer"
            targetId={a.id}
            score={a.score}
            myVote={myVotes[a.id]}
            path={path}
            canVote={canVote}
          />
          <div className="flex flex-1 flex-col gap-2">
            <p className="whitespace-pre-wrap text-sm">{a.body}</p>
            <div className="flex flex-wrap items-center gap-3 text-xs text-muted">
              <span>{a.author?.display_name ?? "Member"}</span>
              <span>{timeAgo(a.created_at)}</span>
              <ReportButton targetType="answer" targetId={a.id} path={path} canReport={canReport} />
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}

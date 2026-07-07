"use client";

import { useActionState } from "react";
import Link from "next/link";
import { reportAndAck } from "@/app/community/actions";

type Props = {
  targetType: "post" | "answer";
  targetId: string;
  path: string;
  canReport: boolean;
};

// Minimal "Report" control — a one-click form (no reason needed). Logged-out
// visitors get a link to /account. Shows "Reported ✓" after submitting.
export function ReportButton({ targetType, targetId, path, canReport }: Props) {
  const [state, formAction, pending] = useActionState(reportAndAck, { done: false });

  if (!canReport) {
    return (
      <Link href="/account" className="text-xs text-red-500 transition-colors hover:text-red-400">
        Report
      </Link>
    );
  }

  if (state.done) {
    return <span className="text-xs text-muted">Reported ✓</span>;
  }

  return (
    <form action={formAction}>
      <input type="hidden" name="target_type" value={targetType} />
      <input type="hidden" name="target_id" value={targetId} />
      <input type="hidden" name="path" value={path} />
      <button
        type="submit"
        disabled={pending}
        className="text-xs text-red-500 transition-colors hover:text-red-400 disabled:opacity-50"
      >
        Report
      </button>
    </form>
  );
}

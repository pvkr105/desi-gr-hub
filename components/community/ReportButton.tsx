import Link from "next/link";
import { reportContent } from "@/app/community/actions";

type Props = {
  targetType: "post" | "answer";
  targetId: string;
  path: string;
  canReport: boolean;
};

// Minimal "Report" control — a one-click form (no reason needed). Logged-out
// visitors get a link to /account.
export function ReportButton({ targetType, targetId, path, canReport }: Props) {
  if (!canReport) {
    return (
      <Link href="/account" className="text-xs text-muted hover:text-ink">
        Report
      </Link>
    );
  }

  return (
    <form action={reportContent}>
      <input type="hidden" name="target_type" value={targetType} />
      <input type="hidden" name="target_id" value={targetId} />
      <input type="hidden" name="path" value={path} />
      <button type="submit" className="text-xs text-muted hover:text-ink">
        Report
      </button>
    </form>
  );
}

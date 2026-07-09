import type { Metadata } from "next";
import Link from "next/link";
import { getCurrentUser, listOpenReports } from "@/lib/queries";
import { timeAgo } from "@/lib/community";
import { PageHeader } from "@/components/PageHeader";
import { moderateReports, updateNotifyPreference } from "@/app/admin-actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Reports",
  robots: { index: false },
};

const btnCls = "min-h-11 rounded-full border border-line px-4 text-sm font-medium hover:border-saffron";
const checkCls = "h-5 w-5 rounded border border-line cursor-pointer accent-saffron";

export default async function AdminPage() {
  const user = await getCurrentUser();
  const isAdmin = !!user?.profile?.is_admin;
  const canModerate = isAdmin || user?.profile?.can_moderate_reports;

  if (!canModerate) {
    return (
      <>
        <PageHeader title="Not authorized" intro="" />
        <p className="text-sm text-muted">
          You don't have permission to access this page.{" "}
          <Link href="/" className="text-saffron underline underline-offset-2">
            Go home
          </Link>
        </p>
      </>
    );
  }

  const reports = await listOpenReports();

  return (
    <>
      <PageHeader title="Moderation" intro="Review and manage reported content." />

      {/* Notification preference */}
      <div className="glass mb-6 rounded-2xl p-5">
        <form action={updateNotifyPreference} className="flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="notify_on_report"
              defaultChecked={user?.profile?.notify_on_report ?? false}
              className={checkCls}
            />
            <span className="text-sm">Email me when a new report is filed</span>
          </label>
          <button type="submit" className={btnCls}>
            Save preference
          </button>
        </form>
      </div>

      {/* Team management link (admin only) */}
      {isAdmin && (
        <div className="mb-6">
          <Link
            href="/admin/team"
            className="inline-flex min-h-11 items-center rounded-full border border-line px-4 text-sm font-medium hover:border-saffron"
          >
            Manage team
          </Link>
        </div>
      )}

      {/* Reports list */}
      {reports.length === 0 ? (
        <div className="glass rounded-2xl p-8 text-center">
          <p className="text-sm text-muted">No open reports yet. Check back soon!</p>
        </div>
      ) : (
        <form action={moderateReports} className="space-y-4">
          <div className="glass space-y-3 rounded-2xl p-5">
            {reports.map((group) => (
              <label key={`${group.target_type}:${group.target_id}`} className="flex gap-3 rounded-lg border border-line p-3 cursor-pointer hover:border-saffron">
                <input
                  type="checkbox"
                  name="targets"
                  value={`${group.target_type}:${group.target_id}`}
                  className={checkCls}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium">{group.count} report{group.count !== 1 ? "s" : ""}</span>
                    <span className="text-xs text-muted">on {group.target_type}</span>
                    <span className="text-xs text-muted">{timeAgo(group.latest_at)}</span>
                  </div>

                  {group.reasons.length > 0 && (
                    <div className="mt-1 text-xs text-muted">
                      <div>Reasons: {group.reasons.join("; ") || "none provided"}</div>
                    </div>
                  )}

                  {group.target && (
                    <div className="mt-2 text-sm">
                      {group.target_type === "post" ? (() => {
                        const post = group.target as any;
                        let segment = "questions";
                        if (post.type === "housing") segment = "housing";
                        else if (post.type === "marketplace") segment = "marketplace";
                        return (
                          <Link href={`/community/${segment}/${post.id}`} className="truncate text-saffron hover:underline">
                            {post.title}
                          </Link>
                        );
                      })() : (
                        <Link
                          href={`/community/questions/${(group.target as any).post_id}`}
                          className="truncate text-saffron hover:underline"
                        >
                          {(group.target as any).body}
                        </Link>
                      )}
                    </div>
                  )}
                  {!group.target && (
                    <div className="mt-2 text-xs text-muted italic">Content already removed</div>
                  )}
                </div>
              </label>
            ))}
          </div>

          {/* Bulk actions */}
          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              name="action"
              value="dismiss"
              className={`${btnCls} text-muted hover:text-ink`}
            >
              Dismiss reports
            </button>
            <button
              type="submit"
              name="action"
              value="close"
              className={`${btnCls} text-amber-600 hover:border-amber-500`}
            >
              Close posts
            </button>
            <button
              type="submit"
              name="action"
              value="delete"
              className={`${btnCls} text-red-500 hover:border-red-500`}
            >
              Delete content
            </button>
          </div>
        </form>
      )}
    </>
  );
}

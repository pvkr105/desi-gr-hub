import type { Metadata } from "next";
import Link from "next/link";
import { getCurrentUser, listModerators } from "@/lib/queries";
import { PageHeader } from "@/components/PageHeader";
import { promoteUser, updateTeamMember } from "@/app/admin-actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Manage team",
  robots: { index: false },
};

const inputCls =
  "min-h-11 w-full bg-bg-soft border border-line rounded-xl px-3 focus:border-saffron transition-colors outline-none";
const btnCls = "min-h-11 rounded-full border border-line px-4 text-sm font-medium hover:border-saffron";
const checkCls = "h-5 w-5 rounded border border-line cursor-pointer accent-saffron";

export default async function TeamPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const user = await getCurrentUser();

  if (!user?.profile?.is_admin) {
    return (
      <>
        <PageHeader title="Not authorized" intro="" />
        <p className="text-sm text-muted">
          Only admins can manage the team.{" "}
          <Link href="/" className="text-saffron underline underline-offset-2">
            Go home
          </Link>
        </p>
      </>
    );
  }

  const moderators = await listModerators();

  return (
    <>
      <PageHeader title="Manage team" intro="Add admins and moderators, manage their permissions." />

      {error && (
        <p className="glass mb-6 rounded-2xl border-red-300/60 p-4 text-sm text-red-600">
          ⚠️ {error}
        </p>
      )}

      {/* Add new team member */}
      <form action={promoteUser} className="glass mb-8 rounded-2xl p-5">
        <h2 className="mb-3 font-display text-lg font-bold">Add admin or moderator</h2>
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium">Email (must have signed in once)</label>
            <input
              type="email"
              name="email"
              placeholder="user@example.com"
              required
              className={inputCls}
            />
          </div>
          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" name="is_admin" className={checkCls} />
              <span className="text-sm">Full admin (can manage team and all content)</span>
            </label>
          </div>
          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" name="can_moderate_reports" className={checkCls} />
              <span className="text-sm">Moderator (can review reports and moderate content)</span>
            </label>
          </div>
          <button type="submit" className={`${btnCls} mt-4`}>
            Add to team
          </button>
        </div>
      </form>

      {/* Existing team members */}
      <div className="glass rounded-2xl p-5">
        <h2 className="mb-4 font-display text-lg font-bold">Team members</h2>
        {moderators.length === 0 ? (
          <p className="text-sm text-muted">No admins or moderators yet.</p>
        ) : (
          <div className="space-y-3">
            {moderators.map((mod) => {
              const isCurrentUser = mod.id === user!.id;
              return (
                <div
                  key={mod.id}
                  className="flex items-center justify-between gap-3 rounded-lg border border-line p-3"
                >
                  <div className="min-w-0">
                    <div className="text-sm font-medium">
                      {mod.display_name || mod.id.slice(0, 8)}
                      {isCurrentUser && " (you)"}
                    </div>
                  </div>

                  {isCurrentUser ? (
                    <div className="text-xs text-muted">
                      {mod.is_admin && "Admin"}
                      {!mod.is_admin && mod.can_moderate_reports && "Moderator"}
                    </div>
                  ) : (
                    <form action={updateTeamMember} className="flex items-center gap-2">
                      <input type="hidden" name="id" value={mod.id} />
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          name="is_admin"
                          defaultChecked={mod.is_admin}
                          className={checkCls}
                        />
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          name="can_moderate_reports"
                          defaultChecked={mod.can_moderate_reports}
                          className={checkCls}
                        />
                      </label>
                      <button type="submit" className={btnCls}>
                        Save
                      </button>
                    </form>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}

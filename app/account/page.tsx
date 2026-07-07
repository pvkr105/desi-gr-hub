import type { Metadata } from "next";
import Link from "next/link";
import { getCurrentUser } from "@/lib/queries";
import { signOut } from "@/app/community/actions";
import { PageHeader } from "@/components/PageHeader";
import { AuthButtons } from "@/components/community/AuthButtons";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Account",
  robots: { index: false },
};

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  const user = await getCurrentUser();

  if (!user) {
    return (
      <>
        <PageHeader
          title="Sign in"
          intro="Sign in to post questions, list housing, and sell in the marketplace on the community board. It only takes a moment."
        />
        <div className="glass rounded-2xl p-5">
          <AuthButtons next={next} />
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader title="Your account" intro="Manage your community board presence." />
      <div className="glass rounded-2xl p-5">
        <dl className="space-y-3 text-sm">
          {user.profile?.display_name && (
            <div>
              <dt className="text-muted">Display name</dt>
              <dd className="font-medium">{user.profile.display_name}</dd>
            </div>
          )}
          {user.email && (
            <div>
              <dt className="text-muted">Email</dt>
              <dd className="font-medium">{user.email}</dd>
            </div>
          )}
          {user.profile?.is_admin && (
            <p className="text-saffron">You have admin access to moderate the community board.</p>
          )}
        </dl>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Link
            href="/community"
            className="glass inline-flex min-h-11 items-center rounded-xl border-line px-4 text-sm font-medium"
          >
            Go to the community board
          </Link>
          <form action={signOut}>
            <button
              type="submit"
              className="inline-flex min-h-11 items-center rounded-xl border border-line px-4 text-sm font-medium text-muted"
            >
              Sign out
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

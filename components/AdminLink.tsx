import Link from "next/link";
import { getCurrentUser } from "@/lib/queries";

// Server component: shows admin/mod dashboard link if user has either role.
export async function AdminLink() {
  const user = await getCurrentUser();
  const canAccess = user?.profile?.is_admin || user?.profile?.can_moderate_reports;

  if (!canAccess) return null;

  return (
    <Link
      href="/admin"
      className="inline-flex min-h-11 items-center rounded-full border border-line px-4 text-sm font-medium text-saffron hover:border-saffron"
    >
      Dashboard
    </Link>
  );
}

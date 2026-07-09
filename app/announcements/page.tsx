import type { Metadata } from "next";
import { listAnnouncements, getCurrentUser } from "@/lib/queries";
import { PageHeader } from "@/components/PageHeader";
import { AnnouncementAdmin } from "@/components/AnnouncementAdmin";

export const metadata: Metadata = {
  title: "Announcements",
  description:
    "Latest announcements and updates from the Desi GR Hub community in Grand Rapids and West Michigan.",
  alternates: { canonical: "/announcements" },
};

export const revalidate = 300;

const fmt = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

export default async function AnnouncementsPage() {
  const announcements = await listAnnouncements();
  const user = await getCurrentUser();
  const isAdmin = !!user?.profile?.is_admin;

  return (
    <>
      <PageHeader
        title="Announcements"
        intro="Official updates from the Desi GR Hub admins, newest first."
      />

      {isAdmin && <AnnouncementAdmin announcements={announcements} />}

      {announcements.length === 0 ? (
        <p className="text-muted">No announcements yet, check back soon!</p>
      ) : (
        <div className="space-y-4">
          {announcements.map((a) => (
            <article key={a.id} className="glass rounded-2xl p-5">
              <time dateTime={a.date} className="text-xs text-muted">
                {fmt.format(new Date(a.date))}
              </time>
              <h2 className="mt-1 font-display text-lg font-bold">{a.title}</h2>
              <p className="mt-2 text-sm text-muted">{a.body}</p>
            </article>
          ))}
        </div>
      )}
    </>
  );
}

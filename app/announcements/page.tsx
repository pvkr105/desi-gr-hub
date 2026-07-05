import type { Metadata } from "next";
import { announcements } from "@/data/announcements";
import { PageHeader } from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "Announcements",
  description:
    "Latest announcements and updates from the Desi GR Hub community in Grand Rapids and West Michigan.",
  alternates: { canonical: "/announcements" },
};

const fmt = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

export default function AnnouncementsPage() {
  return (
    <>
      <PageHeader
        title="Announcements"
        intro="Official updates from the Desi GR Hub admins, newest first."
      />
      <div className="space-y-4">
        {announcements.map((a) => (
          <article key={a.date + a.title} className="glass rounded-2xl p-5">
            <time dateTime={a.date} className="text-xs text-muted">
              {fmt.format(new Date(a.date))}
            </time>
            <h2 className="mt-1 font-display text-lg font-bold">{a.title}</h2>
            <p className="mt-2 text-sm text-muted">{a.body}</p>
          </article>
        ))}
      </div>
    </>
  );
}

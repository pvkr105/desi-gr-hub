import type { Metadata } from "next";
import { events } from "@/data/events";
import { site } from "@/data/site";
import { PageHeader } from "@/components/PageHeader";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Events & Meetups",
  description:
    "Upcoming Indian & South Asian community events and meetups in Grand Rapids and West Michigan, hosted by Desi GR Hub.",
  alternates: { canonical: "/events" },
};

const fmt = new Intl.DateTimeFormat("en-US", {
  weekday: "short",
  year: "numeric",
  month: "long",
  day: "numeric",
});

export default function EventsPage() {
  // ponytail: "now" is fixed at build time; fine because the site rebuilds
  // periodically and events are prepended by hand. Upgrade to a client clock
  // only if stale upcoming/past splitting ever becomes a real problem.
  const now = new Date();
  const upcoming = events.filter((e) => new Date(e.date) >= now);
  const past = events.filter((e) => new Date(e.date) < now);

  const eventsJsonLd = upcoming.map((e) => ({
    "@context": "https://schema.org",
    "@type": "Event",
    name: e.title,
    startDate: e.date,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: {
      "@type": "Place",
      name: e.location,
      address: e.location,
    },
    description: e.description,
    organizer: { "@type": "Organization", name: site.name, url: site.url },
    ...(e.rsvpUrl ? { url: e.rsvpUrl } : {}),
  }));

  return (
    <>
      {eventsJsonLd.map((data, i) => (
        <JsonLd key={i} data={data} />
      ))}

      <PageHeader
        title="Events & Meetups"
        intro="Community gatherings across Grand Rapids and West Michigan, potlucks, meet-and-greets, festivals, and more. Newest first."
      />

      {upcoming.length > 0 && (
        <section>
          <h2 className="mb-4 font-display text-xl font-bold">Upcoming</h2>
          <div className="space-y-4">
            {upcoming.map((e) => (
              <EventCard key={e.date + e.title} event={e} />
            ))}
          </div>
        </section>
      )}

      {past.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-4 font-display text-xl font-bold text-muted">Past events</h2>
          <div className="space-y-4 opacity-70">
            {past.map((e) => (
              <EventCard key={e.date + e.title} event={e} />
            ))}
          </div>
        </section>
      )}

      {events.length === 0 && (
        <p className="text-muted">No events scheduled yet, check back soon!</p>
      )}
    </>
  );
}

function EventCard({ event: e }: { event: (typeof events)[number] }) {
  return (
    <article className="glass rounded-2xl p-5">
      <time dateTime={e.date} className="text-xs text-muted">
        {fmt.format(new Date(e.date))}
        {e.time ? ` · ${e.time}` : ""}
      </time>
      <h3 className="mt-1 font-display text-lg font-bold">{e.title}</h3>
      <p className="mt-1 text-sm text-saffron">
        {e.mapUrl ? (
          <a href={e.mapUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">
            📍 {e.location}
          </a>
        ) : (
          <span>📍 {e.location}</span>
        )}
      </p>
      <p className="mt-2 text-sm text-muted">{e.description}</p>
      {e.rsvpUrl && (
        <a
          href={e.rsvpUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex min-h-11 items-center rounded-full border border-line px-4 text-sm font-medium hover:border-saffron"
        >
          RSVP / details →
        </a>
      )}
    </article>
  );
}

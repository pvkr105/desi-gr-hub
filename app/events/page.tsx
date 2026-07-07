import type { Metadata } from "next";
import { listEvents, getCurrentUser } from "@/lib/queries";
import type { EventRow } from "@/lib/types";
import { site } from "@/data/site";
import { PageHeader } from "@/components/PageHeader";
import { JsonLd } from "@/components/JsonLd";
import { EventAdmin } from "@/components/EventAdmin";
import { ContributeBanner } from "@/components/ContributeBanner";

export const metadata: Metadata = {
  title: "Events & Meetups",
  description:
    "Upcoming Indian & South Asian community events and meetups in Grand Rapids and West Michigan, hosted by Desi GR Hub.",
  alternates: { canonical: "/events" },
};

// Content is DB-backed and admin-edited; revalidate periodically.
export const revalidate = 300;

const fmt = new Intl.DateTimeFormat("en-US", {
  weekday: "short",
  year: "numeric",
  month: "long",
  day: "numeric",
});

// ponytail: day-granularity split via ISO date strings (yyyy-mm-dd sorts
// lexicographically). event_date has no time component, so string compare is
// the whole comparison — no Date/timezone math needed.
function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export default async function EventsPage() {
  const events = await listEvents();
  const user = await getCurrentUser();
  const isAdmin = !!user?.profile?.is_admin;

  const today = todayISO();
  const happeningToday = events.filter((e) => e.event_date === today);
  const upcoming = events.filter((e) => e.event_date > today);
  const past = events.filter((e) => e.event_date < today);

  const jsonLdEvents = [...happeningToday, ...upcoming].map((e) => ({
    "@context": "https://schema.org",
    "@type": "Event",
    name: e.title,
    startDate: e.event_date,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: {
      "@type": "Place",
      name: e.location,
      address: e.location,
    },
    description: e.description,
    organizer: { "@type": "Organization", name: site.name, url: site.url },
    ...(e.rsvp_url ? { url: e.rsvp_url } : {}),
  }));

  return (
    <>
      {jsonLdEvents.map((data, i) => (
        <JsonLd key={i} data={data} />
      ))}

      <PageHeader
        title="Events & Meetups"
        intro="Community gatherings across Grand Rapids and West Michigan, potlucks, meet-and-greets, festivals, and more. Newest first."
      />

      {isAdmin && <EventAdmin events={events} />}

      {happeningToday.length > 0 && (
        <section>
          <h2 className="mb-4 font-display text-xl font-bold text-saffron">
            Happening today
          </h2>
          <div className="space-y-4">
            {happeningToday.map((e) => (
              <EventCard key={e.id} event={e} highlight />
            ))}
          </div>
        </section>
      )}

      {upcoming.length > 0 && (
        <section className={happeningToday.length > 0 ? "mt-10" : ""}>
          <h2 className="mb-4 font-display text-xl font-bold">Upcoming</h2>
          <div className="space-y-4">
            {upcoming.map((e) => (
              <EventCard key={e.id} event={e} />
            ))}
          </div>
        </section>
      )}

      {past.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-4 font-display text-xl font-bold text-muted">Past events</h2>
          <div className="space-y-4 opacity-70">
            {past.map((e) => (
              <EventCard key={e.id} event={e} />
            ))}
          </div>
        </section>
      )}

      {events.length === 0 && (
        <p className="text-muted">No events scheduled yet, check back soon!</p>
      )}

      <ContributeBanner />
    </>
  );
}

function EventCard({ event: e, highlight }: { event: EventRow; highlight?: boolean }) {
  return (
    <article
      className={`glass rounded-2xl p-5${highlight ? " border border-saffron" : ""}`}
    >
      <time dateTime={e.event_date} className="text-xs text-muted">
        {fmt.format(new Date(e.event_date))}
        {e.event_time ? ` · ${e.event_time}` : ""}
      </time>
      <h3 className="mt-1 font-display text-lg font-bold">{e.title}</h3>
      <p className="mt-1 text-sm text-saffron">
        {e.map_url ? (
          <a
            href={e.map_url}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2"
          >
            📍 {e.location}
          </a>
        ) : (
          <span>📍 {e.location}</span>
        )}
      </p>
      <p className="mt-2 text-sm text-muted">{e.description}</p>
      {e.rsvp_url && (
        <a
          href={e.rsvp_url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex min-h-11 items-center rounded-full border border-line px-4 text-sm font-medium hover:border-saffron transition-colors"
        >
          RSVP / details →
        </a>
      )}
    </article>
  );
}

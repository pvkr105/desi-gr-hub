import Link from "next/link";
import { groups } from "@/data/groups";
import { site } from "@/data/site";
import { GroupCard } from "@/components/GroupCard";
import { JoinButton } from "@/components/JoinButton";
import { JsonLd } from "@/components/JsonLd";
import { ForexIndicator } from "@/components/ForexIndicator";
import { TYPE_META, TYPE_TO_SEGMENT } from "@/lib/community";
import type { PostType } from "@/lib/types";

const boardTypes: PostType[] = ["question", "housing", "marketplace"];

const steps = [
  {
    n: "1",
    title: "Join the hub",
    body: "Tap Join to open Desi GR Hub in WhatsApp and join the main community.",
  },
  {
    n: "2",
    title: "Pick your groups",
    body: "Add the WhatsApp groups you need for rides, accommodation, and more.",
  },
  {
    n: "3",
    title: "Use the board",
    body: "No WhatsApp required, ask questions, find housing & roommates, and buy or sell right here on the Community Board.",
  },
];

export default function HomePage() {
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    url: site.url,
    description: site.description,
    areaServed: "Grand Rapids, Michigan, United States",
    sameAs: [site.mainHubUrl],
  };
  const siteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: site.url,
  };

  return (
    <>
      <JsonLd data={orgJsonLd} />
      <JsonLd data={siteJsonLd} />

      {/* Hero */}
      <section className="py-8 sm:py-14">
        <p className="mb-3 inline-block rounded-full border border-line px-3 py-1 text-xs text-muted">
          Grand Rapids &amp; West Michigan
        </p>
        <h1 className="font-display text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
          The{" "}
          <span className="gradient-text">
            Indian &amp; South Asian community
          </span>{" "}
          in Grand Rapids, Michigan
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted">
          Desi GR Hub is a free community for desi folks in Grand Rapids and
          West Michigan. Find carpools, housing and roommates, buy &amp; sell,
          and get everyday questions answered.
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <JoinButton href={site.mainHubUrl}>Join the Community</JoinButton>
          <Link
            href="/groups"
            className="min-h-11 rounded-full border border-line px-5 py-2.5 text-sm font-medium transition-colors hover:border-saffron hover:text-saffron"
          >
            Browse groups
          </Link>
        </div>
        <div className="mt-6">
          <ForexIndicator />
        </div>
        <p className="mt-6 max-w-2xl text-sm text-muted">{site.mainHubBlurb}</p>
      </section>

      {/* Community Board — surfaced above groups so visitors notice it immediately */}
      <section className="py-8">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl font-bold">Community Board</h2>
            <p className="mt-1 text-muted">
              Ask questions, find housing &amp; roommates, and buy or sell, free
              for everyone in GR.
            </p>
          </div>
          <Link
            href="/community"
            className="hidden shrink-0 text-sm text-saffron transition-colors hover:text-saffron/80 sm:inline"
          >
            Open the board →
          </Link>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {boardTypes.map((t) => {
            const m = TYPE_META[t];
            return (
              <Link
                key={t}
                href={`/community/${TYPE_TO_SEGMENT[t]}`}
                className="glass rounded-2xl p-5 transition-transform hover:-translate-y-0.5"
              >
                <div className="text-2xl" aria-hidden>
                  {m.emoji}
                </div>
                <h3 className="mt-2 font-display font-bold">{m.label}</h3>
                <p className="mt-1 text-sm text-muted">{m.blurb}</p>
                <span className="mt-3 inline-block text-sm text-saffron">
                  Open →
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Groups */}
      <section className="py-8">
        <h2 className="font-display text-2xl font-bold">Community groups</h2>
        <p className="mt-1 text-muted">
          Six focused WhatsApp groups, join the ones you need.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {groups.map((g) => (
            <GroupCard key={g.slug} group={g} />
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="py-8">
        <h2 className="font-display text-2xl font-bold">How it works</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {steps.map((s) => (
            <div key={s.n} className="glass rounded-2xl p-5">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-linear-to-br from-saffron to-violet font-bold text-black">
                {s.n}
              </span>
              <h3 className="mt-3 font-display font-bold">{s.title}</h3>
              <p className="mt-1 text-sm text-muted">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Teasers */}
      <section className="grid gap-4 py-8 sm:grid-cols-2">
        <Link
          href="/newcomers"
          className="glass rounded-2xl p-6 transition-transform hover:-translate-y-0.5"
        >
          <h3 className="font-display text-xl font-bold">
            🧭 New to Grand Rapids?
          </h3>
          <p className="mt-2 text-sm text-muted">
            Start here, desi groceries, temples, banking &amp; SSN basics,
            getting around, and more.
          </p>
          <span className="mt-3 inline-block text-sm text-saffron">
            Read the Newcomer&apos;s Guide →
          </span>
        </Link>
        <Link
          href="/businesses"
          className="glass rounded-2xl p-6 transition-transform hover:-translate-y-0.5"
        >
          <h3 className="font-display text-xl font-bold">
            🛍️ Community businesses
          </h3>
          <p className="mt-2 text-sm text-muted">
            A curated directory of desi-owned businesses serving West Michigan.
          </p>
          <span className="mt-3 inline-block text-sm text-saffron">
            Browse the directory →
          </span>
        </Link>
      </section>

      {/* Safety note */}
      <section className="py-8">
        <div className="glass rounded-2xl p-6">
          <p className="text-sm text-muted">
            Desi GR Hub is community-run and unofficial. Please participate at
            your own discretion and verify people and listings before any
            arrangement.{" "}
            <Link
              href="/safety"
              className="text-saffron underline underline-offset-2 transition-colors hover:text-saffron/80"
            >
              Read our safety &amp; disclaimers →
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}

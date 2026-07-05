import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { groups, getGroup } from "@/data/groups";
import { site } from "@/data/site";
import { JoinButton } from "@/components/JoinButton";
import { CopyLinkButton } from "@/components/CopyLinkButton";
import { QrCode } from "@/components/QrCode";
import { JsonLd } from "@/components/JsonLd";

type Params = Promise<{ slug: string }>;

// Prerender every group page at build time.
export function generateStaticParams() {
  return groups.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const group = getGroup(slug);
  if (!group) return {};
  const title = `${group.name}: ${group.tagline}`;
  return {
    title,
    description: `${group.description} ${group.seoBlurb}`,
    alternates: { canonical: `/groups/${group.slug}` },
    openGraph: { title: `${group.name} · ${site.name}`, description: group.seoBlurb },
  };
}

export default async function GroupDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  const group = getGroup(slug);
  if (!group) notFound();

  const joinHref = group.joinUrl ?? site.mainHubUrl;
  const hasDirectLink = Boolean(group.joinUrl);
  const shareText = `Join ${group.name} in Desi GR Hub, ${group.tagline}: ${joinHref}`;
  const shareHref = `https://wa.me/?text=${encodeURIComponent(shareText)}`;

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Groups", item: `${site.url}/groups` },
      { "@type": "ListItem", position: 2, name: group.name, item: `${site.url}/groups/${group.slug}` },
    ],
  };

  return (
    <article>
      <JsonLd data={breadcrumb} />

      <nav className="mb-6 text-sm text-muted" aria-label="Breadcrumb">
        <Link href="/groups" className="hover:text-ink">
          Groups
        </Link>{" "}
        <span aria-hidden="true">/</span> <span className="text-ink">{group.name}</span>
      </nav>

      <div className="flex items-start gap-4">
        <span className="text-5xl" aria-hidden="true">
          {group.emoji}
        </span>
        <div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
            {group.name}
          </h1>
          <p className="mt-1 text-muted">{group.tagline}</p>
        </div>
      </div>

      <p className="mt-6 max-w-2xl text-lg">{group.description}</p>
      <p className="mt-3 max-w-2xl text-muted">{group.seoBlurb}</p>

      {/* Actions + QR */}
      <div className="mt-8 grid gap-6 sm:grid-cols-[1fr_auto] sm:items-center">
        <div className="flex flex-wrap items-center gap-3">
          <JoinButton href={joinHref}>
            {hasDirectLink ? "Join Group" : "Join via the main hub"}
          </JoinButton>
          <a
            href={shareHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line px-4 text-sm font-medium hover:border-saffron"
          >
            Share via WhatsApp
          </a>
          <CopyLinkButton url={joinHref} />
        </div>
        <QrCode value={joinHref} label={hasDirectLink ? "Scan to join" : "Scan to open the hub"} />
      </div>

      {!hasDirectLink && (
        <p className="mt-4 text-sm text-muted">
          This group doesn&apos;t have a public invite link yet, join the main community hub and
          you&apos;ll be able to add it from there.
        </p>
      )}

      {/* Guidelines */}
      <section className="mt-10">
        <h2 className="font-display text-xl font-bold">Group guidelines</h2>
        <ul className="mt-3 space-y-2">
          {group.guidelines.map((g) => (
            <li key={g} className="flex gap-2 text-muted">
              <span aria-hidden="true" className="text-saffron">
                •
              </span>
              <span>{g}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Disclaimers */}
      <section className="mt-8">
        <div className="glass rounded-2xl p-5">
          <h2 className="font-display text-lg font-bold">Please note</h2>
          <ul className="mt-2 space-y-2 text-sm text-muted">
            {group.disclaimers.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
          <Link href="/safety" className="mt-3 inline-block text-sm text-saffron underline underline-offset-2">
            Full safety &amp; disclaimers →
          </Link>
        </div>
      </section>
    </article>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { listNewcomerSections } from "@/lib/queries";
import { getCurrentUser } from "@/lib/queries";
import { PageHeader } from "@/components/PageHeader";
import { NewcomerAdmin } from "@/components/NewcomerAdmin";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "New to Grand Rapids? A Desi Newcomer's Guide",
  description:
    "A newcomer's guide to Grand Rapids for Indian and South Asian arrivals: desi grocery stores and restaurants, temples, banking & SSN basics, phone plans, and getting around West Michigan.",
  alternates: { canonical: "/newcomers" },
};

export default async function NewcomersPage() {
  const sections = await listNewcomerSections();
  const user = await getCurrentUser();
  const isAdmin = !!user?.profile?.is_admin;

  return (
    <>
      <PageHeader
        title="New to Grand Rapids? Start Here"
        intro="A practical starting guide for desi newcomers to Grand Rapids and West Michigan, groceries, community spaces, the paperwork basics, and getting around."
      />

      {isAdmin && <NewcomerAdmin sections={sections} />}

      {sections.length === 0 ? (
        <p className="text-muted">The guide is being put together. Check back soon.</p>
      ) : (
        <>
          {/* On-page contents */}
          <nav aria-label="Guide sections" className="mb-8 flex flex-wrap gap-2">
            {sections.map((s) => (
              <a
                key={s.id}
                href={`#${s.slug}`}
                className="rounded-full border border-line px-3 py-1.5 text-sm text-muted hover:border-saffron hover:text-ink transition-colors"
              >
                {s.title}
              </a>
            ))}
          </nav>

          <div className="space-y-10">
            {sections.map((s) => (
              <section key={s.id} id={s.slug} className="scroll-mt-24">
                <h2 className="font-display text-2xl font-bold">{s.title}</h2>
                <p className="mt-1 text-muted">{s.intro}</p>
                <div className="mt-4 space-y-3">
                  {s.entries.map((e) => (
                    <div key={e.id} className="glass rounded-2xl p-5">
                      <h3 className="font-semibold">{e.name}</h3>
                      <p className="mt-1 text-sm text-muted">{e.detail}</p>
                      {e.url &&
                        (e.url.startsWith("http") ? (
                          // External (map, restaurant, temple) opens in a new tab.
                          <a
                            href={e.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 inline-block text-sm text-saffron underline underline-offset-2 hover:text-saffron transition-colors"
                          >
                            Learn more →
                          </a>
                        ) : (
                          <Link
                            href={e.url}
                            className="mt-2 inline-block text-sm text-saffron underline underline-offset-2 hover:text-saffron transition-colors"
                          >
                            Learn more →
                          </Link>
                        ))}
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </>
      )}

      <p className="mt-10 text-sm text-muted">
        Still have questions? Ask in the{" "}
        <Link href="/groups/community-qa" className="text-saffron underline underline-offset-2">
          Community Q&amp;A group
        </Link>
        . People who&apos;ve been there are happy to help.
      </p>
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { newcomerSections } from "@/data/newcomers";
import { PageHeader } from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "New to Grand Rapids? A Desi Newcomer's Guide",
  description:
    "A newcomer's guide to Grand Rapids for Indian and South Asian arrivals: desi grocery stores and restaurants, temples, banking & SSN basics, phone plans, and getting around West Michigan.",
  alternates: { canonical: "/newcomers" },
};

export default function NewcomersPage() {
  return (
    <>
      <PageHeader
        title="New to Grand Rapids? Start Here"
        intro="A practical starting guide for desi newcomers to Grand Rapids and West Michigan, groceries, community spaces, the paperwork basics, and getting around."
      />

      {/* On-page contents */}
      <nav aria-label="Guide sections" className="mb-8 flex flex-wrap gap-2">
        {newcomerSections.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className="rounded-full border border-line px-3 py-1.5 text-sm text-muted hover:border-saffron hover:text-ink"
          >
            {s.title}
          </a>
        ))}
      </nav>

      <div className="space-y-10">
        {newcomerSections.map((s) => (
          <section key={s.id} id={s.id} className="scroll-mt-24">
            <h2 className="font-display text-2xl font-bold">{s.title}</h2>
            <p className="mt-1 text-muted">{s.intro}</p>
            <div className="mt-4 space-y-3">
              {s.entries.map((e) => (
                <div key={e.name} className="glass rounded-2xl p-5">
                  <h3 className="font-semibold">{e.name}</h3>
                  <p className="mt-1 text-sm text-muted">{e.detail}</p>
                  {e.url && (
                    <Link
                      href={e.url}
                      className="mt-2 inline-block text-sm text-saffron underline underline-offset-2"
                    >
                      Learn more →
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

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

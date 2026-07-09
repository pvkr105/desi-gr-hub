import type { Metadata } from "next";
import { listFaqs, getCurrentUser } from "@/lib/queries";
import { PageHeader } from "@/components/PageHeader";
import { JsonLd } from "@/components/JsonLd";
import { FaqAdmin } from "@/components/FaqAdmin";

export const metadata: Metadata = {
  title: "FAQ: Joining, Rides, Housing & More",
  description:
    "Frequently asked questions about the Desi GR Hub community in Grand Rapids: how to join, which group for rides vs housing vs selling, safety tips, and listing your business.",
  alternates: { canonical: "/faq" },
};

export const revalidate = 300;

export default async function FaqPage() {
  const faqs = await listFaqs();
  const user = await getCurrentUser();
  const isAdmin = !!user?.profile?.is_admin;

  // FAQPage structured data, can earn rich results in Google.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <PageHeader
        title="Frequently Asked Questions"
        intro="Everything you need to know about joining and using the Desi GR Hub community in Grand Rapids and West Michigan."
      />

      {isAdmin && <FaqAdmin faqs={faqs} />}

      {faqs.length === 0 ? (
        <p className="text-muted">No FAQs yet, check back soon!</p>
      ) : (
        <div className="space-y-3">
          {faqs.map((f) => (
            <details key={f.id} className="glass group rounded-2xl px-5">
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-3 py-4 font-medium">
                {f.question}
                <span
                  aria-hidden="true"
                  className="shrink-0 text-saffron transition-transform group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="pb-4 text-sm text-muted">{f.answer}</p>
            </details>
          ))}
        </div>
      )}
    </>
  );
}

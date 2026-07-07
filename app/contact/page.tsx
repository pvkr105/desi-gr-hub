import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/PageHeader";
import { ContactForm } from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact: Suggestions, Reports & Business Listings",
  description:
    "Get in touch with the Desi GR Hub admins: suggest a new group, report an issue, or request a business listing for the Grand Rapids desi community.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <PageHeader
        title="Contact Us"
        intro="Suggest a new group, report an issue, request a business listing, or just say hello. Messages go straight to the admins."
      />
      <Suspense fallback={<div className="glass h-96 max-w-xl rounded-2xl" />}>
        <ContactForm />
      </Suspense>

      <div className="glass mt-8 max-w-xl rounded-2xl p-6">
        <h2 className="font-display text-lg font-bold">🛠️ Open source</h2>
        <p className="mt-2 text-sm text-muted">
          Desi GR Hub is open source — fork it and run one for your own community.
        </p>
        <div className="mt-4 flex flex-wrap gap-4 text-sm font-medium">
          <a
            href="https://github.com/pvkr105/desi-gr-hub"
            target="_blank"
            rel="noopener noreferrer"
            className="text-saffron transition-colors hover:text-saffron/80"
          >
            View on GitHub →
          </a>
          <a
            href="https://github.com/pvkr105/desi-gr-hub"
            target="_blank"
            rel="noopener noreferrer"
            className="text-saffron transition-colors hover:text-saffron/80"
          >
            ⭐ Star us on GitHub
          </a>
        </div>
      </div>
    </>
  );
}

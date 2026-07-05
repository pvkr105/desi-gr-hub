import type { Metadata } from "next";
import Link from "next/link";
import { disclaimers } from "@/data/safety";
import { PageHeader } from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "Safety & Disclaimers",
  description:
    "Important safety information and disclaimers for the Desi GR Hub community, rides, accommodation, marketplace, and Q&A in Grand Rapids and West Michigan.",
  alternates: { canonical: "/safety" },
};

export default function SafetyPage() {
  return (
    <>
      <PageHeader
        title="Safety & Disclaimers"
        intro="Desi GR Hub is a community-run, volunteer-moderated space. Please read and keep these in mind whenever you use the groups."
      />
      <ul className="space-y-3">
        {disclaimers.map((d) => (
          <li key={d} className="glass flex gap-3 rounded-2xl p-4 text-sm text-muted">
            <span aria-hidden="true" className="text-saffron">
              ⚠
            </span>
            <span>{d}</span>
          </li>
        ))}
      </ul>
      <p className="mt-6 text-sm text-muted">
        Have a safety concern or want to report something?{" "}
        <Link href="/contact" className="text-saffron underline underline-offset-2">
          Contact the admins →
        </Link>
      </p>
    </>
  );
}

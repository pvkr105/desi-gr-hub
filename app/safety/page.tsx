import type { Metadata } from "next";
import Link from "next/link";
import { listSafetyDisclaimers, getCurrentUser } from "@/lib/queries";
import { PageHeader } from "@/components/PageHeader";
import { SafetyDisclaimerAdmin } from "@/components/SafetyDisclaimerAdmin";

export const metadata: Metadata = {
  title: "Safety & Disclaimers",
  description:
    "Important safety information and disclaimers for the Desi GR Hub community, rides, accommodation, marketplace, and Q&A in Grand Rapids and West Michigan.",
  alternates: { canonical: "/safety" },
};

export const revalidate = 300;

export default async function SafetyPage() {
  const disclaimers = await listSafetyDisclaimers();
  const user = await getCurrentUser();
  const isAdmin = !!user?.profile?.is_admin;

  return (
    <>
      <PageHeader
        title="Safety & Disclaimers"
        intro="Desi GR Hub is a community-run, volunteer-moderated space. Please read and keep these in mind whenever you use the groups."
      />

      {isAdmin && <SafetyDisclaimerAdmin disclaimers={disclaimers} />}

      {disclaimers.length === 0 ? (
        <p className="text-muted">No disclaimers yet, check back soon!</p>
      ) : (
        <ul className="space-y-3">
          {disclaimers.map((d) => (
            <li key={d.id} className="glass flex gap-3 rounded-2xl p-4 text-sm text-muted">
              <span aria-hidden="true" className="text-saffron">
                ⚠
              </span>
              <span>{d.text}</span>
            </li>
          ))}
        </ul>
      )}
      <p className="mt-6 text-sm text-muted">
        Have a safety concern or want to report something?{" "}
        <Link href="/contact" className="text-saffron underline underline-offset-2">
          Contact the admins →
        </Link>
      </p>
    </>
  );
}

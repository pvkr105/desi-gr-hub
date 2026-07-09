import type { Metadata } from "next";
import { listGuidelines, getCurrentUser } from "@/lib/queries";
import { PageHeader } from "@/components/PageHeader";
import { GuidelineAdmin } from "@/components/GuidelineAdmin";

export const metadata: Metadata = {
  title: "Community Guidelines",
  description:
    "The six guidelines that keep Desi GR Hub, the Indian and South Asian community in Grand Rapids, welcoming, safe, and useful for everyone.",
  alternates: { canonical: "/guidelines" },
};

export const revalidate = 300;

export default async function GuidelinesPage() {
  const guidelines = await listGuidelines();
  const user = await getCurrentUser();
  const isAdmin = !!user?.profile?.is_admin;

  return (
    <>
      <PageHeader
        title="Community Guidelines"
        intro="A few simple rules keep Desi GR Hub friendly and useful for everyone. By joining, you agree to follow them."
      />

      {isAdmin && <GuidelineAdmin guidelines={guidelines} />}

      {guidelines.length === 0 ? (
        <p className="text-muted">No guidelines yet, check back soon!</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {guidelines.map((g, i) => (
            <div key={g.id} className="glass rounded-2xl p-5">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-br from-saffron to-violet text-sm font-bold text-black">
                  {i + 1}
                </span>
                <h2 className="font-display font-bold">{g.title}</h2>
              </div>
              <p className="mt-2 text-sm text-muted">{g.detail}</p>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

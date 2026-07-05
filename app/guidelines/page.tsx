import type { Metadata } from "next";
import { guidelines } from "@/data/guidelines";
import { PageHeader } from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "Community Guidelines",
  description:
    "The six guidelines that keep Desi GR Hub, the Indian and South Asian community in Grand Rapids, welcoming, safe, and useful for everyone.",
  alternates: { canonical: "/guidelines" },
};

export default function GuidelinesPage() {
  return (
    <>
      <PageHeader
        title="Community Guidelines"
        intro="A few simple rules keep Desi GR Hub friendly and useful for everyone. By joining, you agree to follow them."
      />
      <div className="grid gap-4 sm:grid-cols-2">
        {guidelines.map((g, i) => (
          <div key={g.title} className="glass rounded-2xl p-5">
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
    </>
  );
}

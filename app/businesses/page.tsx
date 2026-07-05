import type { Metadata } from "next";
import Link from "next/link";
import { businesses } from "@/data/businesses";
import { getGroup } from "@/data/groups";
import { PageHeader } from "@/components/PageHeader";
import { BusinessCard } from "@/components/BusinessCard";
import { JoinButton } from "@/components/JoinButton";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Community Business Directory: Desi Businesses in West Michigan",
  description:
    "A community-curated directory of desi-owned businesses serving Grand Rapids and West Michigan, food, services, real estate, and more. Want your business listed? Get in touch.",
  alternates: { canonical: "/businesses" },
};

export default function BusinessesPage() {
  const promo = getGroup("gr-promotions-marketplace");
  return (
    <>
      <PageHeader
        title="Community Business Directory"
        intro="A curated list of desi-owned businesses serving Grand Rapids and West Michigan. Listings are community-curated and admin-approved, they are not endorsed or vetted."
      />

      <div className="grid gap-4 sm:grid-cols-2">
        {businesses.map((b) => (
          <BusinessCard key={b.name} business={b} />
        ))}
      </div>

      {/* Get listed CTA */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="glass rounded-2xl p-6">
          <h2 className="font-display text-xl font-bold">Want your business listed?</h2>
          <p className="mt-2 text-sm text-muted">
            We feature desi-owned businesses serving the community. Submit yours and an admin will
            review it.
          </p>
          <Link
            href="/contact?category=list-business"
            className="mt-4 inline-flex min-h-11 items-center rounded-full border border-line px-4 text-sm font-medium hover:border-saffron"
          >
            List my business →
          </Link>
        </div>
        <div className="glass rounded-2xl p-6">
          <h2 className="font-display text-xl font-bold">Day-to-day ads &amp; promos</h2>
          <p className="mt-2 text-sm text-muted">
            For everyday promotions, sales, and marketplace posts, join{" "}
            {promo ? promo.name : "GR Promotions & Marketplace"}, the one group for business content.
          </p>
          <div className="mt-4">
            <JoinButton href={promo?.joinUrl ?? site.mainHubUrl}>
              Join {promo ? promo.name : "the Marketplace"}
            </JoinButton>
          </div>
        </div>
      </div>
    </>
  );
}

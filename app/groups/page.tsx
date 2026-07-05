import type { Metadata } from "next";
import { groups } from "@/data/groups";
import { GroupCard } from "@/components/GroupCard";
import { PageHeader } from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "Community Groups: Rides, Housing, Marketplace & Q&A in Grand Rapids",
  description:
    "Browse the Desi GR Hub WhatsApp groups for the Indian community in Grand Rapids, MI: carpools, housing and roommates, buy & sell, Kalamazoo rides, and community Q&A.",
  alternates: { canonical: "/groups" },
};

export default function GroupsPage() {
  return (
    <>
      <PageHeader
        title="Community Groups"
        intro="Six focused WhatsApp groups for desi folks in Grand Rapids and West Michigan. Tap a group to see full details, guidelines, and a scannable QR code, or join straight from a card."
      />
      <div className="grid gap-4 sm:grid-cols-2">
        {groups.map((g) => (
          <GroupCard key={g.slug} group={g} />
        ))}
      </div>
    </>
  );
}

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
    </>
  );
}

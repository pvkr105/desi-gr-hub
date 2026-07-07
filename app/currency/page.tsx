import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { CurrencyConverter } from "@/components/CurrencyConverter";

export const metadata: Metadata = {
  title: "USD to INR Currency Converter",
  description:
    "Free USD to INR currency converter for the Grand Rapids desi community. Convert US dollars to Indian rupees and 200+ other currencies with daily-updated rates.",
  alternates: { canonical: "/currency" },
};

export default function CurrencyPage() {
  return (
    <>
      <PageHeader
        title="Currency Converter"
        intro="Convert US dollars to Indian rupees, and between 200+ world currencies, with rates updated daily. Handy for sending money home, comparing prices, or planning a trip."
      />

      <CurrencyConverter />

      {/* Static SEO copy, renders without JavaScript so the page ranks for
          "USD to INR" searches from the Grand Rapids desi community. */}
      <section className="mt-8 space-y-3 text-sm text-muted">
        <p>
          Members of the Desi GR Hub community in Grand Rapids and West Michigan regularly
          send money to family in India, shop across borders, and track the USD to INR
          exchange rate. This converter uses free, daily-updated reference rates so you can
          quickly check the US dollar to Indian rupee rate without leaving the site.
        </p>
        <p>
          Rates shown are daily reference rates for general guidance only. Banks, remittance
          services, and money-transfer apps apply their own rates and fees, so always confirm
          the final amount with your provider before sending money.
        </p>
      </section>
    </>
  );
}

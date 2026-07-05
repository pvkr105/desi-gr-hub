import type { Business } from "@/lib/types";

// COMMUNITY BUSINESS DIRECTORY, curated by admins.
// ⚠️ ADMIN: These are sample placeholder listings. Replace with real, approved
// businesses. New listings come in via the contact form ("List my business").

export const businesses: Business[] = [
  {
    name: "Sample Tiffin Service",
    category: "Food",
    description:
      "Home-style Indian tiffin and meal prep, delivered around Grand Rapids. (Sample listing, replace with a real business.)",
    contactUrl: "https://wa.me/",
    contactLabel: "Message on WhatsApp",
  },
  {
    name: "Sample Immigration & Tax Help",
    category: "Services",
    description:
      "Community member offering tax filing and paperwork help for students and newcomers. (Sample listing, replace with a real business.)",
    contactUrl: "https://wa.me/",
    contactLabel: "Message on WhatsApp",
  },
  {
    name: "Sample Realtor",
    category: "Real Estate",
    description:
      "Helping desi families buy and rent homes across West Michigan. (Sample listing, replace with a real business.)",
    contactUrl: "https://wa.me/",
    contactLabel: "Message on WhatsApp",
  },
];

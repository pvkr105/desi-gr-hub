import type { GuideSection } from "@/lib/types";

// NEWCOMER'S GUIDE, PLACEHOLDER CONTENT.
// ⚠️ ADMIN: These entries are plausible placeholders to review and replace with
// real, verified local recommendations before sharing widely. Edit freely, the
// page renders whatever is in this array.

export const newcomerSections: GuideSection[] = [
  {
    id: "groceries-restaurants",
    title: "Desi Groceries & Restaurants",
    intro:
      "Where to find Indian and South Asian groceries, spices, and food in Grand Rapids and West Michigan.",
    entries: [
      {
        name: "Indian grocery stores",
        detail:
          "Grand Rapids has several South Asian grocery stores stocking spices, lentils, fresh produce, and frozen favorites. Ask in Community Q&A for the current favorites near you.",
      },
      {
        name: "Desi restaurants",
        detail:
          "From North Indian to South Indian and Indo-Chinese, a handful of desi restaurants serve the GR area. Members are happy to share recommendations.",
      },
    ],
  },
  {
    id: "temples-community",
    title: "Temples & Community Spaces",
    intro:
      "Places of worship and cultural spaces that bring the community together.",
    entries: [
      {
        name: "Temples & places of worship",
        detail:
          "West Michigan has Hindu temples and multi-faith spaces that host festivals and weekly gatherings. Ask the community for timings and directions.",
      },
      {
        name: "Cultural & student associations",
        detail:
          "Local universities and cultural groups organize Diwali, Holi, and other celebrations open to the community.",
      },
    ],
  },
  {
    id: "settling-in",
    title: "Banking, SSN & Phone-Plan Basics",
    intro:
      "The practical first steps for newcomers settling into the United States.",
    entries: [
      {
        name: "Social Security Number (SSN)",
        detail:
          "If you're eligible, apply at a local Social Security office. Bring your passport, visa, and required documents, check the current requirements before you go.",
      },
      {
        name: "Opening a bank account",
        detail:
          "Most major banks and local credit unions can open an account with your passport and proof of address. Ask about student and newcomer accounts.",
      },
      {
        name: "Phone plans",
        detail:
          "Prepaid and postpaid plans are widely available. Many newcomers start with a prepaid SIM and switch once they have an SSN and credit history.",
      },
    ],
  },
  {
    id: "getting-around",
    title: "Getting Around",
    intro:
      "Transit options and community rides for getting around Grand Rapids and West Michigan.",
    entries: [
      {
        name: "Public transit (The Rapid)",
        detail:
          "Grand Rapids is served by The Rapid bus system, with routes covering downtown, campuses, and major corridors.",
      },
      {
        name: "Community carpools",
        detail:
          "For trips transit doesn't cover, the GR Rides & Help and Kalamazoo Rides groups connect you with members going your way.",
        url: "/groups/gr-rides-help",
      },
    ],
  },
  {
    id: "useful-links",
    title: "Useful Links",
    intro: "Handy starting points as you settle in.",
    entries: [
      {
        name: "Newcomer questions",
        detail:
          "The Community Q&A group is the fastest way to get answers from people who've been there.",
        url: "/groups/community-qa",
      },
      {
        name: "Community guidelines",
        detail: "Read how the community works before you dive in.",
        url: "/guidelines",
      },
    ],
  },
];

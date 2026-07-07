import type { Event } from "@/lib/types";

// Newest first. To add one: prepend an object with an ISO date.
export const events: Event[] = [
  {
    date: "2026-08-15",
    time: "5:00 PM",
    title: "India Independence Day Potluck 🇮🇳",
    location: "Riverside Park, Grand Rapids, MI",
    mapUrl: "https://maps.google.com/?q=Riverside+Park+Grand+Rapids+MI",
    description:
      "Celebrate India's Independence Day with the Desi GR Hub community. Bring a dish to share, meet fellow desis, and enjoy an evening by the river. Families welcome.",
  },
  {
    date: "2026-06-21",
    time: "4:00 PM",
    title: "Summer Newcomers Meet & Greet",
    location: "Downtown Market, Grand Rapids, MI",
    mapUrl: "https://maps.google.com/?q=Downtown+Market+Grand+Rapids+MI",
    description:
      "A casual get-together to welcome folks new to Grand Rapids. Ask questions about housing, groceries, jobs, and settling in, and connect with people who've been here a while.",
  },
];

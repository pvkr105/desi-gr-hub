import type { Group } from "@/lib/types";
import { site } from "./site";

// The six community groups. To add a group: append an object here, no component
// changes needed. `joinUrl: null` renders a "Join via the main hub" button.

export const groups: Group[] = [
  {
    slug: "announcements",
    name: "Announcements",
    emoji: "📢",
    tagline: "Official updates from the admins",
    description:
      "The Announcements group carries official community updates from the Desi GR Hub admins, new groups, events, safety notices, and important news. It's WhatsApp's built-in community announcement group, so you're added automatically when you join the main hub.",
    // Announcements is the community's built-in announcement group, join via the main hub.
    joinUrl: site.mainHubUrl,
    guidelines: [
      "Admin-only posting keeps this channel signal, not noise.",
      "Watch here for new groups and community-wide notices.",
    ],
    disclaimers: [
      "Announcements reflect admin communications only and are not professional advice.",
    ],
    seoBlurb:
      "Stay in the loop with official updates for the Indian and South Asian community in Grand Rapids, Michigan.",
  },
  {
    slug: "gr-rides-help",
    name: "GR Rides & Help",
    emoji: "🚗",
    tagline: "Carpool & rideshare help in Grand Rapids",
    description:
      "An unofficial, community-driven carpooling and rideshare help group for Grand Rapids. Find others going your way, share costs, and get help when you're stuck or need a last-minute ride. This is neighbors helping neighbors, not a paid service.",
    joinUrl: "https://chat.whatsapp.com/KOnL1XFC09QExUHXCWB28s",
    guidelines: [
      "Communicate with respect and be clear about pickup times and locations.",
      "Stick to agreed times; notify others promptly if your plans change.",
      "Prioritize safety, only ride with people you're comfortable with.",
      "Limited solicitation only; duplicates and excessive promos are removed.",
    ],
    disclaimers: [
      "This is NOT an official rideshare service and is not affiliated with any company.",
      "Rides are arranged between members at their own discretion and risk.",
    ],
    seoBlurb:
      "Looking to carpool in Grand Rapids or split a ride to the airport, campus, or work? This is the desi carpool group for GR.",
  },
  {
    slug: "gr-accommodation-hub",
    name: "GR Accommodation Hub",
    emoji: "🏠",
    tagline: "Housing & roommates in Grand Rapids, MI",
    description:
      "Connects people seeking or offering accommodation primarily in Grand Rapids, MI and across the state, apartments, sublets, and roommates. Whether you're new in town or have a room to fill, post here to find your match.",
    joinUrl: "https://chat.whatsapp.com/Bd3FHGuSwl0DsxUafNwM7Y",
    guidelines: [
      "Accommodation posts only, no ads or unrelated solicitation.",
      "Respect and courtesy toward everyone; protect your privacy.",
      "Verify listings and individuals before making any agreement.",
      "Report suspected scams to the admins right away.",
    ],
    disclaimers: [
      "Admins do not vet or endorse listings, and accept no liability for arrangements.",
      "Always verify accommodation listings and individuals before making agreements.",
    ],
    seoBlurb:
      "Searching for housing or roommates in Grand Rapids, MI? Desi students and newcomers use this group to find apartments and roommates across West Michigan.",
  },
  {
    slug: "kalamazoo-rides",
    name: "Kalamazoo Rides",
    emoji: "🚙",
    tagline: "Carpool & rideshare help in Kalamazoo",
    description:
      "The same idea as GR Rides & Help, but for Kalamazoo: carpooling, rideshares, and urgent-situation help. Coordinate trips, share costs, and lend a hand to fellow community members in the Kalamazoo area.",
    joinUrl: "https://chat.whatsapp.com/JEB8gbse653ED0cwZ8B786",
    guidelines: [
      "Communicate with respect and be clear about pickup times and locations.",
      "Stick to agreed times; notify others promptly if your plans change.",
      "Prioritize safety, only ride with people you're comfortable with.",
      "Limited solicitation only; duplicates and excessive promos are removed.",
    ],
    disclaimers: [
      "This is NOT an official rideshare service and is not affiliated with any company.",
      "Rides are arranged between members at their own discretion and risk.",
    ],
    seoBlurb:
      "The Kalamazoo Indian community carpool group, find rides and offer seats around Kalamazoo and West Michigan.",
  },
  {
    slug: "gr-promotions-marketplace",
    name: "GR Promotions & Marketplace",
    emoji: "🛒",
    tagline: "The only place for ads, promos & selling",
    description:
      "The one group for ads, promotions, and business content, offer services, promote your business, or sell items. Keeping all commercial posts here keeps the other groups clean and useful.",
    joinUrl: "https://chat.whatsapp.com/L3XWDGr5RNqDF1DgR8DdZG",
    guidelines: [
      "Stay relevant, this is the place for promotions and marketplace posts.",
      "No spam or repetitive posting.",
      "Be honest; misleading content leads to removal or a ban.",
      "Respect other members' businesses and never pressure anyone to buy.",
    ],
    disclaimers: [
      "Admins are not liable for any transactions, do your own due diligence.",
    ],
    seoBlurb:
      "Buy, sell, and promote within the desi community in Grand Rapids, the community marketplace for West Michigan.",
  },
  {
    slug: "community-qa",
    name: "Community Q&A",
    emoji: "💬",
    tagline: "Ask & answer anything",
    description:
      "Ask and answer questions on any topic, settling into Grand Rapids, local recommendations, paperwork, or everyday life. Ask freely, share what you know, and keep it respectful.",
    joinUrl: "https://chat.whatsapp.com/HAjvMifY0SDBoKkDYo81fq",
    guidelines: [
      "Ask freely and share knowledge generously.",
      "Stay respectful; no spam or self-promotion.",
      "Protect privacy and share accurate information.",
    ],
    disclaimers: [
      "Answers are personal opinions, not professional legal, medical, or financial advice.",
    ],
    seoBlurb:
      "Questions about life in Grand Rapids as an Indian or South Asian newcomer? Ask the community here.",
  },
];

export function getGroup(slug: string): Group | undefined {
  return groups.find((g) => g.slug === slug);
}

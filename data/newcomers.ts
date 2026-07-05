import type { GuideSection } from "@/lib/types";

// NEWCOMER'S GUIDE.
// Real Grand Rapids / West Michigan places, gathered from public listings.
// ⚠️ ADMIN: hours, phone numbers, and businesses change. Re-check details
// periodically and add community favorites as the group suggests them.

export const newcomerSections: GuideSection[] = [
  {
    id: "groceries-restaurants",
    title: "Desi Groceries & Restaurants",
    intro:
      "Where to find Indian and South Asian groceries, spices, and food around Grand Rapids.",
    entries: [
      {
        name: "India Market",
        detail:
          "Indian grocery store on 28th St SE stocking fresh vegetables, flours, lentils, spices, and frozen foods. 5773 28th St SE, Grand Rapids, MI 49546. (616) 855-1141.",
        url: "https://indiamarketgr.com/",
      },
      {
        name: "Indian Masala",
        detail:
          "Authentic, mostly North Indian restaurant right next to India Market. A popular first stop for newcomers. 5769 28th St SE, Grand Rapids, MI 49546.",
        url: "https://www.indianmasalagr.us/",
      },
      {
        name: "Pind Indian Cuisine",
        detail:
          "Well-loved downtown spot known for its naan and cozy atmosphere. 241 Fulton St W, Grand Rapids, MI 49504. (616) 805-4767.",
        url: "https://pindindiancuisinegr.com/",
      },
      {
        name: "Madras Indian Grill",
        detail:
          "South Indian cuisine known for dosas and biryani. 2030 28th St SE, Grand Rapids, MI 49508.",
        url: "https://madrasindiangrill.com/",
      },
      {
        name: "Roti Indian Kitchen",
        detail:
          "Newer spot on 28th St praised for authentic North Indian dishes. 5070 28th St SE, Suite C, Grand Rapids, MI 49512.",
        url: "https://rotigr.us/",
      },
      {
        name: "Curry Leaf",
        detail:
          "Indian stall inside the Grand Rapids Downtown Market, great for a quick downtown bite. 435 Ionia Ave SW, Grand Rapids, MI 49503.",
        url: "https://www.downtownmarketgr.com/market-hall/curry-leaf",
      },
      {
        name: "Mithu Sri Lankan & Indian Cuisine",
        detail:
          "Sri Lankan and Indian dishes, a community favorite for something a little different. 4309 Kalamazoo Ave SE, Grand Rapids, MI 49508.",
        url: "https://www.mithusrilankanandindiancuisine.com/",
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
        name: "West Michigan Hindu Temple",
        detail:
          "The area's Hindu temple and cultural center, hosting festivals and weekly gatherings. 4870 Whitneyville Ave SE, Ada, MI 49301. (616) 868-9909.",
        url: "http://www.westmichiganhindutemple.org/",
      },
      {
        name: "Cultural & student associations",
        detail:
          "Grand Valley State University, Michigan State, and local cultural groups organize Diwali, Holi, and Garba/Navratri events that are often open to the community. Watch the Announcements group for dates.",
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
        name: "The Rapid (public transit)",
        detail:
          "Grand Rapids' bus system covers downtown, Kentwood, Wyoming, Walker, the airport, and GVSU's Allendale campus (Laker Line). Students at local colleges (GVSU, GRCC, and others) ride free with a valid student ID. Otherwise fare is about $1.75 per ride with a daily cap around $5.25. Check routes and live times at ridetherapid.org.",
        url: "https://www.ridetherapid.org/",
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

// Free, no-key daily FX rates from fawazahmed0/currency-api.
// ponytail: single provider + its own CDN fallback. No multi-provider
// abstraction until one is actually needed.
const PRIMARY = (base: string) =>
  `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${base}.json`;
const FALLBACK = (base: string) =>
  `https://latest.currency-api.pages.dev/v1/currencies/${base}.json`;

export type Rates = { date: string; base: string; rates: Record<string, number> };

/** Fetch the rate table for a base currency (lowercase code, e.g. "usd"). */
export async function fetchRates(base = "usd"): Promise<Rates | null> {
  for (const url of [PRIMARY(base), FALLBACK(base)]) {
    try {
      // no-store: skip the browser cache so a returning visitor gets today's
      // rates, not yesterday's cached copy.
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) continue;
      const data = await res.json();
      const rates = data?.[base];
      if (rates && typeof rates === "object") {
        return { date: data.date, base, rates };
      }
    } catch {
      // try next url
    }
  }
  return null;
}

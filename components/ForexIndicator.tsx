"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchRates } from "@/lib/rates";

// Compact "$1 = ₹__" chip for the homepage hero. Client island; links to the
// full /currency calculator.
export function ForexIndicator() {
  const [inr, setInr] = useState<number | null>(null);
  const [date, setDate] = useState<string>("");

  useEffect(() => {
    fetchRates("usd").then((r) => {
      if (r?.rates.inr) {
        setInr(r.rates.inr);
        setDate(r.date);
      }
    });
  }, []);

  if (!inr) return null;

  return (
    <Link
      href="/currency"
      className="inline-flex min-h-11 flex-col justify-center rounded-2xl border border-line px-4 py-1.5 hover:border-saffron"
    >
      <span className="text-sm font-semibold">
        $1 = <span className="gradient-text">₹{inr.toFixed(2)}</span>
      </span>
      <span className="text-[11px] text-muted">USD → INR · updated {date} · convert →</span>
    </Link>
  );
}

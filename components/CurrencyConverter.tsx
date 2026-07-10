"use client";

import { useEffect, useMemo, useState } from "react";
import { fetchRates } from "@/lib/rates";

// Full any-to-any converter. Fetches the USD-based rate table once and
// converts locally: amount * (rate[to] / rate[from]), since every rate is
// quoted per 1 USD.
const names = new Intl.DisplayNames(["en"], { type: "currency" });

function label(code: string): string {
  const up = code.toUpperCase();
  try {
    const name = names.of(up);
    return name && name !== up ? `${up} — ${name}` : up;
  } catch {
    return up;
  }
}

function format(amount: number, code: string): string {
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: code.toUpperCase() }).format(amount);
  } catch {
    // Non-ISO codes (e.g. crypto) — plain number + code.
    return `${amount.toLocaleString("en-US", { maximumFractionDigits: 4 })} ${code.toUpperCase()}`;
  }
}

export function CurrencyConverter() {
  const [rates, setRates] = useState<Record<string, number> | null>(null);
  const [date, setDate] = useState("");
  const [failed, setFailed] = useState(false);
  const [amount, setAmount] = useState("1");
  const [from, setFrom] = useState("usd");
  const [to, setTo] = useState("inr");

  useEffect(() => {
    const load = () => {
      fetchRates("usd").then((r) => {
        if (r) {
          setRates({ usd: 1, ...r.rates });
          setDate(r.date);
        } else {
          setFailed(true);
        }
      });
    };
    load();
    const interval = setInterval(load, 24 * 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const codes = useMemo(() => (rates ? Object.keys(rates).sort() : []), [rates]);

  const result = useMemo(() => {
    if (!rates) return null;
    const amt = parseFloat(amount);
    if (!isFinite(amt) || !rates[from] || !rates[to]) return null;
    return amt * (rates[to] / rates[from]);
  }, [rates, amount, from, to]);

  function swap() {
    setFrom(to);
    setTo(from);
  }

  if (failed) {
    return (
      <p className="glass rounded-2xl p-5 text-sm text-muted">
        Live rates are unavailable right now. Please try again later.
      </p>
    );
  }

  const selectCls =
    "min-h-11 w-full rounded-xl border border-line bg-bg-soft px-3 text-sm focus:border-saffron";

  return (
    <div className="glass rounded-2xl p-5">
      <label className="block text-sm font-medium" htmlFor="amount">
        Amount
      </label>
      <input
        id="amount"
        type="number"
        inputMode="decimal"
        min="0"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="mt-1 min-h-11 w-full rounded-xl border border-line bg-bg-soft px-3 text-lg focus:border-saffron"
      />

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-end">
        <div>
          <label className="block text-sm font-medium" htmlFor="from">
            From
          </label>
          <select id="from" value={from} onChange={(e) => setFrom(e.target.value)} className={`mt-1 ${selectCls}`} disabled={!rates}>
            {codes.map((c) => (
              <option key={c} value={c}>
                {label(c)}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={swap}
          className="mx-auto inline-flex min-h-11 items-center justify-center rounded-full border border-line px-3 hover:border-saffron"
          aria-label="Swap currencies"
        >
          ⇅
        </button>

        <div>
          <label className="block text-sm font-medium" htmlFor="to">
            To
          </label>
          <select id="to" value={to} onChange={(e) => setTo(e.target.value)} className={`mt-1 ${selectCls}`} disabled={!rates}>
            {codes.map((c) => (
              <option key={c} value={c}>
                {label(c)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-5 rounded-xl border border-line p-4">
        {result === null ? (
          <p className="text-muted">{rates ? "Enter an amount." : "Loading rates…"}</p>
        ) : (
          <p className="font-display text-2xl font-bold">
            {format(parseFloat(amount) || 0, from)} = <span className="gradient-text">{format(result, to)}</span>
          </p>
        )}
      </div>

      {date && (
        <p className="mt-3 text-xs text-muted">Rates updated {date} · for reference only, not for trading.</p>
      )}
    </div>
  );
}

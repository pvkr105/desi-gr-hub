"use client";

import type { SafetyDisclaimerRow } from "@/lib/types";
import { createSafetyDisclaimer, updateSafetyDisclaimer, deleteSafetyDisclaimer } from "@/app/admin-actions";

const input = "min-h-11 w-full bg-bg-soft border border-line rounded-xl px-3";
const btn = "min-h-11 rounded-full border border-line px-4 text-sm hover:border-saffron transition-colors";

export function SafetyDisclaimerAdmin({ disclaimers }: { disclaimers: SafetyDisclaimerRow[] }) {
  return (
    <section className="glass mb-8 rounded-2xl p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-display text-lg font-bold">Manage safety disclaimers</h2>
        <details>
          <summary className="cursor-pointer text-sm text-muted hover:text-saffron transition-colors">
            ＋ Add disclaimer
          </summary>
          <form action={createSafetyDisclaimer} className="mt-3 space-y-2">
            <textarea name="text" placeholder="Disclaimer text" rows={2} required className={`${input} py-2`} />
            <input type="number" name="sort_order" placeholder="Sort order" defaultValue={disclaimers.length} className={input} />
            <button type="submit" className={btn}>
              Add disclaimer
            </button>
          </form>
        </details>
      </div>

      {disclaimers.length > 0 && (
        <ul className="mt-5 space-y-3">
          {disclaimers.map((d) => (
            <li key={d.id} className="rounded-lg border border-line p-3 text-sm">
              <span aria-hidden="true" className="text-saffron">
                ⚠
              </span>
              {" "}
              {d.text}
              <details className="mt-2">
                <summary className="cursor-pointer text-xs text-muted hover:text-saffron transition-colors">
                  Edit or delete
                </summary>
                <form action={updateSafetyDisclaimer} className="mt-2 space-y-2">
                  <input type="hidden" name="id" value={d.id} />
                  <textarea name="text" defaultValue={d.text} rows={2} required className={`${input} py-2`} />
                  <input type="number" name="sort_order" defaultValue={d.sort_order} className={input} />
                  <button type="submit" className={btn}>
                    Save
                  </button>
                </form>
              </details>
              <form action={deleteSafetyDisclaimer} className="mt-2">
                <input type="hidden" name="id" value={d.id} />
                <button type="submit" className={`${btn} text-red-500 hover:border-red-500 text-xs`}>
                  Delete
                </button>
              </form>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

"use client";

import type { GuidelineRow } from "@/lib/types";
import { createGuideline, updateGuideline, deleteGuideline } from "@/app/admin-actions";

const input = "min-h-11 w-full bg-bg-soft border border-line rounded-xl px-3";
const btn = "min-h-11 rounded-full border border-line px-4 text-sm hover:border-saffron transition-colors";

export function GuidelineAdmin({ guidelines }: { guidelines: GuidelineRow[] }) {
  return (
    <section className="glass mb-8 rounded-2xl p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-display text-lg font-bold">Manage guidelines</h2>
        <details>
          <summary className="cursor-pointer text-sm text-muted hover:text-saffron transition-colors">
            ＋ Add guideline
          </summary>
          <form action={createGuideline} className="mt-3 space-y-2">
            <input name="title" placeholder="Title" required className={input} />
            <textarea name="detail" placeholder="Detail" rows={3} required className={`${input} py-2`} />
            <input type="number" name="sort_order" placeholder="Sort order" defaultValue={guidelines.length} className={input} />
            <button type="submit" className={btn}>
              Add guideline
            </button>
          </form>
        </details>
      </div>

      {guidelines.length > 0 && (
        <ul className="mt-5 space-y-3">
          {guidelines.map((g) => (
            <li key={g.id} className="rounded-lg border border-line p-3">
              <div className="font-medium">{g.title}</div>
              <details className="mt-2">
                <summary className="cursor-pointer text-sm text-muted hover:text-saffron transition-colors">
                  Edit or delete
                </summary>
                <form action={updateGuideline} className="mt-2 space-y-2">
                  <input type="hidden" name="id" value={g.id} />
                  <input name="title" defaultValue={g.title} required className={input} />
                  <textarea name="detail" defaultValue={g.detail} rows={3} required className={`${input} py-2`} />
                  <input type="number" name="sort_order" defaultValue={g.sort_order} className={input} />
                  <button type="submit" className={btn}>
                    Save
                  </button>
                </form>
              </details>
              <form action={deleteGuideline} className="mt-2">
                <input type="hidden" name="id" value={g.id} />
                <button type="submit" className={`${btn} text-red-500 hover:border-red-500`}>
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

"use client";

import type { BusinessRow, BusinessCategory } from "@/lib/types";
import { createBusiness, updateBusiness, deleteBusiness } from "@/app/admin-actions";

const input = "min-h-11 w-full bg-bg-soft border border-line rounded-xl px-3";
const btn = "min-h-11 rounded-full border border-line px-4 text-sm hover:border-saffron transition-colors";
const categories: BusinessCategory[] = ["Food", "Services", "Real Estate", "Retail", "Health", "Other"];

export function BusinessAdmin({ businesses }: { businesses: BusinessRow[] }) {
  return (
    <section className="glass mb-8 rounded-2xl p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-display text-lg font-bold">Manage businesses</h2>
        <details>
          <summary className="cursor-pointer text-sm text-muted hover:text-saffron transition-colors">
            ＋ Add business
          </summary>
          <form action={createBusiness} className="mt-3 space-y-2">
            <input name="name" placeholder="Business name" required className={input} />
            <select name="category" required defaultValue="Food" className={input}>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <textarea name="description" placeholder="Description" rows={2} required className={`${input} py-2`} />
            <input name="contact_url" placeholder="Contact URL (e.g. wa.me/...)" required className={input} />
            <input name="contact_label" placeholder="Contact label (e.g. Message on WhatsApp)" required className={input} />
            <button type="submit" className={btn}>
              Add business
            </button>
          </form>
        </details>
      </div>

      {businesses.length > 0 && (
        <ul className="mt-5 space-y-3">
          {businesses.map((b) => (
            <li key={b.id} className="rounded-lg border border-line p-3">
              <div className="font-medium">{b.name}</div>
              <div className="text-xs text-muted">{b.category}</div>
              <details className="mt-2">
                <summary className="cursor-pointer text-sm text-muted hover:text-saffron transition-colors">
                  Edit or delete
                </summary>
                <form action={updateBusiness} className="mt-2 space-y-2">
                  <input type="hidden" name="id" value={b.id} />
                  <input name="name" defaultValue={b.name} required className={input} />
                  <select name="category" defaultValue={b.category} required className={input}>
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  <textarea name="description" defaultValue={b.description} rows={2} required className={`${input} py-2`} />
                  <input name="contact_url" defaultValue={b.contact_url} required className={input} />
                  <input name="contact_label" defaultValue={b.contact_label} required className={input} />
                  <button type="submit" className={btn}>
                    Save
                  </button>
                </form>
              </details>
              <form action={deleteBusiness} className="mt-2">
                <input type="hidden" name="id" value={b.id} />
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

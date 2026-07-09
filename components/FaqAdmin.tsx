"use client";

import type { FaqRow } from "@/lib/types";
import { createFaq, updateFaq, deleteFaq } from "@/app/admin-actions";

const input = "min-h-11 w-full bg-bg-soft border border-line rounded-xl px-3";
const btn = "min-h-11 rounded-full border border-line px-4 text-sm hover:border-saffron transition-colors";

export function FaqAdmin({ faqs }: { faqs: FaqRow[] }) {
  return (
    <section className="glass mb-8 rounded-2xl p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-display text-lg font-bold">Manage FAQs</h2>
        <details>
          <summary className="cursor-pointer text-sm text-muted hover:text-saffron transition-colors">
            ＋ Add FAQ
          </summary>
          <form action={createFaq} className="mt-3 space-y-2">
            <input name="question" placeholder="Question" required className={input} />
            <textarea name="answer" placeholder="Answer" rows={3} required className={`${input} py-2`} />
            <input type="number" name="sort_order" placeholder="Sort order" defaultValue={faqs.length} className={input} />
            <button type="submit" className={btn}>
              Add FAQ
            </button>
          </form>
        </details>
      </div>

      {faqs.length > 0 && (
        <ul className="mt-5 space-y-3">
          {faqs.map((f) => (
            <li key={f.id} className="rounded-lg border border-line p-3">
              <div className="font-medium">{f.question}</div>
              <details className="mt-2">
                <summary className="cursor-pointer text-sm text-muted hover:text-saffron transition-colors">
                  Edit or delete
                </summary>
                <form action={updateFaq} className="mt-2 space-y-2">
                  <input type="hidden" name="id" value={f.id} />
                  <input name="question" defaultValue={f.question} required className={input} />
                  <textarea name="answer" defaultValue={f.answer} rows={3} required className={`${input} py-2`} />
                  <input type="number" name="sort_order" defaultValue={f.sort_order} className={input} />
                  <button type="submit" className={btn}>
                    Save
                  </button>
                </form>
              </details>
              <form action={deleteFaq} className="mt-2">
                <input type="hidden" name="id" value={f.id} />
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

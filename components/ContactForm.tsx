"use client";

import { useForm, ValidationError } from "@formspree/react";
import { useSearchParams } from "next/navigation";
import { site } from "@/data/site";

const categories = [
  { value: "suggestion", label: "Suggestion" },
  { value: "report", label: "Report an issue" },
  { value: "list-business", label: "List my business" },
  { value: "other", label: "Other" },
];

const inputClass =
  "mt-1 min-h-11 w-full rounded-xl border border-line bg-bg-soft px-3 text-ink";

// AJAX submit via Formspree, inline success + validation, no page redirect.
// Client-side, which also lets us preselect the category from ?category=.
export function ContactForm() {
  const [state, handleSubmit] = useForm(site.formspreeId);
  const param = useSearchParams().get("category");
  const selected = categories.some((c) => c.value === param) ? param! : "suggestion";

  if (state.succeeded) {
    return (
      <div className="glass max-w-xl rounded-2xl p-6">
        <h2 className="font-display text-xl font-bold">Thanks, message sent! 🎉</h2>
        <p className="mt-2 text-sm text-muted">
          We&apos;ve received your message and an admin will get back to you if needed.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium">
          Name
        </label>
        <input id="name" name="name" type="text" required autoComplete="name" className={inputClass} />
        <ValidationError prefix="Name" field="name" errors={state.errors} className="mt-1 text-sm text-magenta" />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium">
          Email <span className="text-muted">(optional)</span>
        </label>
        <input id="email" name="email" type="email" autoComplete="email" className={inputClass} />
        <ValidationError prefix="Email" field="email" errors={state.errors} className="mt-1 text-sm text-magenta" />
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium">
          Category
        </label>
        <select id="category" name="category" defaultValue={selected} className={inputClass}>
          {categories.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium">
          Message
        </label>
        <textarea id="message" name="message" required rows={5} className="mt-1 w-full rounded-xl border border-line bg-bg-soft px-3 py-2 text-ink" />
        <ValidationError prefix="Message" field="message" errors={state.errors} className="mt-1 text-sm text-magenta" />
      </div>

      <ValidationError errors={state.errors} className="text-sm text-magenta" />

      <button
        type="submit"
        disabled={state.submitting}
        className="inline-flex min-h-11 items-center rounded-full bg-linear-to-r from-saffron to-violet px-6 font-semibold text-black transition-transform active:scale-[0.98] disabled:opacity-60"
      >
        {state.submitting ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}

"use client";

import type { NewcomerSectionRow, NewcomerEntryRow } from "@/lib/types";
import {
  createSection,
  updateSection,
  deleteSection,
  createEntry,
  updateEntry,
  deleteEntry,
} from "@/app/admin-actions";

// ponytail: native <details> for edit/add toggles instead of useState — no JS state to manage.
const input = "min-h-11 w-full bg-bg-soft border border-line rounded-xl px-3";
const btn =
  "min-h-11 rounded-full border border-line px-4 text-sm hover:border-saffron transition-colors";

function EntryFields(e?: NewcomerEntryRow) {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      <input name="name" placeholder="Name" defaultValue={e?.name} required className={input} />
      <input
        name="url"
        placeholder="URL (optional)"
        defaultValue={e?.url ?? ""}
        className={input}
      />
      <textarea
        name="detail"
        placeholder="Detail"
        defaultValue={e?.detail}
        required
        className={`${input} sm:col-span-2 py-2`}
      />
      <input
        name="sort_order"
        type="number"
        placeholder="Sort order"
        defaultValue={e?.sort_order ?? 0}
        className={input}
      />
    </div>
  );
}

export function NewcomerAdmin({ sections }: { sections: NewcomerSectionRow[] }) {
  return (
    <div className="glass mb-10 space-y-6 rounded-2xl p-5">
      <h2 className="font-display text-xl font-bold text-saffron">Manage guide</h2>

      {/* Add section */}
      <details>
        <summary className="cursor-pointer text-sm text-muted hover:text-saffron transition-colors">
          ＋ Add section
        </summary>
        <form action={createSection} className="mt-3 grid gap-2 sm:grid-cols-2">
          <input name="title" placeholder="Title" required className={input} />
          <input name="slug" placeholder="Slug (auto if blank)" className={input} />
          <textarea name="intro" placeholder="Intro" className={`${input} sm:col-span-2 py-2`} />
          <input
            name="sort_order"
            type="number"
            placeholder="Sort order"
            defaultValue={0}
            className={input}
          />
          <div className="sm:col-span-2">
            <button type="submit" className={btn}>
              Add section
            </button>
          </div>
        </form>
      </details>

      {/* Existing sections */}
      {sections.map((s) => (
        <div key={s.id} className="border-t border-line pt-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold">{s.title}</span>
            <span className="text-xs text-muted">/{s.slug}</span>
          </div>

          {/* Edit section */}
          <details className="mt-2">
            <summary className="cursor-pointer text-sm text-muted hover:text-saffron transition-colors">
              Edit section
            </summary>
            <form action={updateSection} className="mt-3 grid gap-2 sm:grid-cols-2">
              <input type="hidden" name="id" value={s.id} />
              <input name="title" defaultValue={s.title} required className={input} />
              <input
                name="sort_order"
                type="number"
                defaultValue={s.sort_order}
                className={input}
              />
              <textarea
                name="intro"
                defaultValue={s.intro}
                className={`${input} sm:col-span-2 py-2`}
              />
              <div className="flex gap-2 sm:col-span-2">
                <button type="submit" className={btn}>
                  Save section
                </button>
              </div>
            </form>
          </details>
          <form action={deleteSection} className="mt-2">
            <input type="hidden" name="id" value={s.id} />
            <button type="submit" className={btn}>
              Delete section
            </button>
          </form>

          {/* Entries */}
          <div className="mt-3 space-y-3 pl-3">
            {s.entries.map((e) => (
              <div key={e.id} className="rounded-xl border border-line p-3">
                <div className="text-sm font-medium">{e.name}</div>
                <details className="mt-1">
                  <summary className="cursor-pointer text-xs text-muted hover:text-saffron transition-colors">
                    Edit entry
                  </summary>
                  <form action={updateEntry} className="mt-2 space-y-2">
                    <input type="hidden" name="id" value={e.id} />
                    {EntryFields(e)}
                    <button type="submit" className={btn}>
                      Save entry
                    </button>
                  </form>
                </details>
                <form action={deleteEntry} className="mt-2">
                  <input type="hidden" name="id" value={e.id} />
                  <button type="submit" className={btn}>
                    Delete entry
                  </button>
                </form>
              </div>
            ))}

            {/* Add entry */}
            <details>
              <summary className="cursor-pointer text-sm text-muted hover:text-saffron transition-colors">
                ＋ Add entry
              </summary>
              <form action={createEntry} className="mt-2 space-y-2">
                <input type="hidden" name="section_id" value={s.id} />
                {EntryFields()}
                <button type="submit" className={btn}>
                  Add entry
                </button>
              </form>
            </details>
          </div>
        </div>
      ))}
    </div>
  );
}

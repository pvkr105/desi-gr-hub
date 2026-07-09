"use client";

import type { AnnouncementRow } from "@/lib/types";
import { createAnnouncement, updateAnnouncement, deleteAnnouncement } from "@/app/admin-actions";

const input = "min-h-11 w-full bg-bg-soft border border-line rounded-xl px-3";
const btn = "min-h-11 rounded-full border border-line px-4 text-sm hover:border-saffron transition-colors";

export function AnnouncementAdmin({ announcements }: { announcements: AnnouncementRow[] }) {
  return (
    <section className="glass mb-8 rounded-2xl p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-display text-lg font-bold">Manage announcements</h2>
        <details>
          <summary className="cursor-pointer text-sm text-muted hover:text-saffron transition-colors">
            ＋ Add announcement
          </summary>
          <form action={createAnnouncement} className="mt-3 space-y-2">
            <input type="date" name="date" required className={input} />
            <input name="title" placeholder="Title" required className={input} />
            <textarea name="body" placeholder="Body" rows={3} required className={`${input} py-2`} />
            <button type="submit" className={btn}>
              Add announcement
            </button>
          </form>
        </details>
      </div>

      {announcements.length > 0 && (
        <ul className="mt-5 space-y-3">
          {announcements.map((a) => (
            <li key={a.id} className="rounded-lg border border-line p-3">
              <div className="text-xs text-muted">{a.date}</div>
              <div className="mt-1 font-medium">{a.title}</div>
              <details className="mt-2">
                <summary className="cursor-pointer text-sm text-muted hover:text-saffron transition-colors">
                  Edit or delete
                </summary>
                <form action={updateAnnouncement} className="mt-2 space-y-2">
                  <input type="hidden" name="id" value={a.id} />
                  <input type="date" name="date" defaultValue={a.date} required className={input} />
                  <input name="title" defaultValue={a.title} required className={input} />
                  <textarea name="body" defaultValue={a.body} rows={3} required className={`${input} py-2`} />
                  <button type="submit" className={btn}>
                    Save
                  </button>
                </form>
              </details>
              <form action={deleteAnnouncement} className="mt-2">
                <input type="hidden" name="id" value={a.id} />
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

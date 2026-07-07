"use client";

import { useState } from "react";
import type { EventRow } from "@/lib/types";
import { createEvent, updateEvent, deleteEvent } from "@/app/admin-actions";

const inputCls =
  "min-h-11 w-full bg-bg-soft border border-line rounded-xl px-3 focus:border-saffron transition-colors outline-none";
const btnCls =
  "min-h-11 inline-flex items-center rounded-full border border-line px-4 text-sm font-medium hover:border-saffron transition-colors";

// Shared field inputs for both add + edit forms. `e` prefills for editing.
function EventFields({ e }: { e?: EventRow }) {
  return (
    <div className="space-y-3">
      <input name="title" placeholder="Title" required defaultValue={e?.title} className={inputCls} />
      <textarea
        name="description"
        placeholder="Description"
        rows={3}
        defaultValue={e?.description}
        className={`${inputCls} py-2`}
      />
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="date"
          name="event_date"
          required
          defaultValue={e?.event_date}
          className={inputCls}
        />
        <input
          name="event_time"
          placeholder="Time (e.g. 5:00 PM)"
          defaultValue={e?.event_time ?? ""}
          className={inputCls}
        />
      </div>
      <input name="location" placeholder="Location" defaultValue={e?.location} className={inputCls} />
      <input name="map_url" placeholder="Map URL (optional)" defaultValue={e?.map_url ?? ""} className={inputCls} />
      <input name="rsvp_url" placeholder="RSVP URL (optional)" defaultValue={e?.rsvp_url ?? ""} className={inputCls} />
    </div>
  );
}

function EventRowAdmin({ e }: { e: EventRow }) {
  const [editing, setEditing] = useState(false);

  return (
    <li className="glass rounded-2xl p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate font-medium">{e.title}</p>
          <p className="text-xs text-muted">
            {e.event_date}
            {e.event_time ? ` · ${e.event_time}` : ""}
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <button type="button" onClick={() => setEditing((v) => !v)} className={btnCls}>
            {editing ? "Cancel" : "Edit"}
          </button>
          <form
            action={deleteEvent}
            onSubmit={(ev) => {
              if (!confirm(`Delete "${e.title}"?`)) ev.preventDefault();
            }}
          >
            <input type="hidden" name="id" value={e.id} />
            <button type="submit" className={`${btnCls} text-red-500 hover:border-red-500`}>
              Delete
            </button>
          </form>
        </div>
      </div>

      {editing && (
        <form action={updateEvent} className="mt-4">
          <input type="hidden" name="id" value={e.id} />
          <EventFields e={e} />
          <button type="submit" className={`${btnCls} mt-3`}>
            Save changes
          </button>
        </form>
      )}
    </li>
  );
}

export function EventAdmin({ events }: { events: EventRow[] }) {
  const [adding, setAdding] = useState(false);

  return (
    <section className="glass mb-8 rounded-2xl p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-display text-lg font-bold">Manage events</h2>
        <button type="button" onClick={() => setAdding((v) => !v)} className={btnCls}>
          {adding ? "Close" : "＋ Add event"}
        </button>
      </div>

      {adding && (
        <form action={createEvent} className="mt-4">
          <EventFields />
          <button type="submit" className={`${btnCls} mt-3`}>
            Create event
          </button>
        </form>
      )}

      {events.length > 0 && (
        <ul className="mt-5 space-y-3">
          {events.map((e) => (
            <EventRowAdmin key={e.id} e={e} />
          ))}
        </ul>
      )}
    </section>
  );
}

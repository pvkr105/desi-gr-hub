// Skeleton while community pages fetch from the database — Supabase free tier
// cold-starts can take a few seconds, so don't leave a blank screen.
export default function Loading() {
  return (
    <div className="animate-pulse" aria-label="Loading">
      <div className="h-9 w-2/3 rounded-xl bg-bg-soft" />
      <div className="mt-3 h-4 w-1/2 rounded bg-bg-soft" />
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="glass h-36 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}

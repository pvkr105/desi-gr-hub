import type { Business } from "@/lib/types";

export function BusinessCard({ business }: { business: Business }) {
  const external = business.contactUrl.startsWith("http");
  return (
    <div className="glass flex flex-col gap-3 rounded-2xl p-5">
      <div className="flex items-center gap-3">
        {/* Logo placeholder, initials on a gradient chip. */}
        <span
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-saffron to-violet text-sm font-bold text-black"
          aria-hidden="true"
        >
          {business.name.slice(0, 2).toUpperCase()}
        </span>
        <div>
          <h3 className="font-display font-bold leading-tight">{business.name}</h3>
          <span className="mt-0.5 inline-block rounded-full border border-line px-2 py-0.5 text-xs text-muted">
            {business.category}
          </span>
        </div>
      </div>
      <p className="text-sm text-muted">{business.description}</p>
      <a
        href={business.contactUrl}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        className="mt-auto inline-flex min-h-11 w-fit items-center rounded-full border border-line px-4 text-sm font-medium hover:border-saffron"
      >
        {business.contactLabel}
      </a>
    </div>
  );
}

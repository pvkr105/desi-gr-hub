import Link from "next/link";
import type { Group } from "@/lib/types";
import { JoinButton } from "./JoinButton";
import { site } from "@/data/site";

// Fully-tappable card: the stretched link (after:absolute inset) makes the whole
// card open the detail page, while the Join button sits above it (relative z-10).
export function GroupCard({ group }: { group: Group }) {
  const joinHref = group.joinUrl ?? site.mainHubUrl;
  return (
    <div className="glass group relative flex flex-col gap-3 rounded-2xl p-5 transition-transform hover:-translate-y-0.5">
      <div className="flex items-start gap-3">
        <span className="text-3xl" aria-hidden="true">
          {group.emoji}
        </span>
        <div>
          <h3 className="font-display text-lg font-bold">
            <Link href={`/groups/${group.slug}`} className="after:absolute after:inset-0">
              {group.name}
            </Link>
          </h3>
          <p className="text-sm text-muted">{group.tagline}</p>
        </div>
      </div>
      <div className="relative z-10 mt-auto flex items-center gap-3 pt-1">
        <JoinButton href={joinHref}>Join Group</JoinButton>
        <Link
          href={`/groups/${group.slug}`}
          className="text-xs text-muted hover:text-ink"
        >
          Details →
        </Link>
      </div>
    </div>
  );
}

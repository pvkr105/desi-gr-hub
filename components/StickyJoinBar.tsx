import { JoinButton } from "./JoinButton";
import { site } from "@/data/site";

// Thumb-reachable join CTA fixed to the bottom on mobile only. Hidden on md+.
export function StickyJoinBar() {
  return (
    <div className="glass fixed inset-x-0 bottom-0 z-40 border-t px-4 py-3 md:hidden">
      <JoinButton href={site.mainHubUrl} full>
        Join the Community
      </JoinButton>
    </div>
  );
}

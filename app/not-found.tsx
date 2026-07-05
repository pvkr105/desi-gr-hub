import Link from "next/link";
import { JoinButton } from "@/components/JoinButton";
import { site } from "@/data/site";

export default function NotFound() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
      <p className="font-display text-6xl font-extrabold gradient-text">404</p>
      <h1 className="mt-4 font-display text-2xl font-bold">Page not found</h1>
      <p className="mt-2 max-w-md text-muted">
        That page doesn&apos;t exist. Head back home or jump into the community.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="min-h-11 rounded-full border border-line px-5 py-2.5 text-sm font-medium hover:border-saffron"
        >
          Go home
        </Link>
        <JoinButton href={site.mainHubUrl} />
      </div>
    </div>
  );
}

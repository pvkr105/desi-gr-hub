import type { PostType } from "@/lib/types";
import { CATEGORIES } from "@/lib/community";
import { createPost } from "@/app/community/actions";
import { communityDisclaimer } from "@/data/safety";

const field =
  "min-h-11 rounded-xl border border-line bg-bg-soft px-4 text-sm";

// New-post composer. Listing types (housing/marketplace) get price + location.
export function PostForm({ type }: { type: PostType }) {
  const isListing = type === "housing" || type === "marketplace";

  return (
    <form action={createPost} className="flex flex-col gap-5">
      <input type="hidden" name="type" value={type} />

      <div className="flex flex-col gap-2">
        <label htmlFor="post-title" className="text-sm font-medium">
          Title
        </label>
        <input
          id="post-title"
          name="title"
          required
          maxLength={160}
          className={field}
          placeholder="Keep it short and clear"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="post-category" className="text-sm font-medium">
          Category
        </label>
        <select id="post-category" name="category" className={field}>
          {CATEGORIES[type].map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {isListing && (
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label htmlFor="post-price" className="text-sm font-medium">
              Price / rent (USD)
            </label>
            <input
              id="post-price"
              name="price"
              type="number"
              min="0"
              className={field}
              placeholder="0"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="post-location" className="text-sm font-medium">
              Location
            </label>
            <input
              id="post-location"
              name="location"
              className={field}
              placeholder="Neighborhood / area"
            />
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <label htmlFor="post-body" className="text-sm font-medium">
          Details
        </label>
        <textarea
          id="post-body"
          name="body"
          required
          rows={6}
          className="rounded-xl border border-line bg-bg-soft p-3 text-sm"
          placeholder="Everything the community needs to know"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="post-contact" className="text-sm font-medium">
          How to reach you
        </label>
        <input
          id="post-contact"
          name="contact"
          className={field}
          placeholder="WhatsApp link, phone, or 'reply in the group'"
        />
      </div>

      <p className="glass rounded-2xl p-4 text-xs text-muted">{communityDisclaimer}</p>

      <button
        type="submit"
        className="inline-flex min-h-11 items-center justify-center self-start rounded-full border border-line px-6 text-sm font-semibold hover:border-saffron"
      >
        Post
      </button>
    </form>
  );
}

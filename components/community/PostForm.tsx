"use client";

import { useRef, useState } from "react";
import type { Post, PostType } from "@/lib/types";
import { CATEGORIES, EXPIRY_OPTIONS, DEFAULT_EXPIRY_DAYS, MAX_IMAGES } from "@/lib/community";
import { createPost, editPost } from "@/app/community/actions";
import { compressImage } from "@/lib/image";
import { createClient } from "@/lib/supabase/client";
import { communityDisclaimer } from "@/data/safety";

const field = "min-h-11 rounded-xl border border-line bg-bg-soft px-4 text-sm";

// New/edit post composer. `post` present = edit mode (editPost, prefilled);
// absent = create mode (createPost). Listings get price + location; the expiry
// duration is only offered on create (editing never resets the window).
export function PostForm({ type, post }: { type: PostType; post?: Post }) {
  const isListing = type === "housing" || type === "marketplace";
  const isEdit = !!post;

  const formRef = useRef<HTMLFormElement>(null);
  const [images, setImages] = useState<string[]>(post?.image_urls ?? []);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  async function onFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    e.target.value = ""; // allow re-selecting the same file
    if (files.length === 0) return;

    const room = MAX_IMAGES - images.length;
    if (room <= 0) {
      setUploadError(`You can add up to ${MAX_IMAGES} images.`);
      return;
    }

    setUploadError(null);
    setUploading(true);
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setUploadError("Please sign in again to upload images.");
        return;
      }

      const uploaded: string[] = [];
      for (const file of files.slice(0, room)) {
        const blob = await compressImage(file, { maxDim: 1600, quality: 0.82 });
        const path = `${user.id}/${crypto.randomUUID()}.webp`;
        const { error } = await supabase.storage
          .from("post-images")
          .upload(path, blob, { contentType: "image/webp" });
        if (error) {
          setUploadError("An image failed to upload. Please try again.");
          continue;
        }
        uploaded.push(supabase.storage.from("post-images").getPublicUrl(path).data.publicUrl);
      }
      if (uploaded.length) setImages((prev) => [...prev, ...uploaded].slice(0, MAX_IMAGES));
    } finally {
      setUploading(false);
    }
  }

  function removeImage(url: string) {
    setImages((prev) => prev.filter((u) => u !== url));
  }

  const mode = isEdit ? editPost : createPost;

  return (
    <>
      <form ref={formRef} action={mode} className="flex flex-col gap-5">
        <input type="hidden" name="type" value={type} />
        {isEdit && <input type="hidden" name="id" value={post.id} />}
        <input type="hidden" name="image_urls" value={JSON.stringify(images)} />

        <div className="flex flex-col gap-2">
          <label htmlFor="post-title" className="text-sm font-medium">
            Title
          </label>
          <input
            id="post-title"
            name="title"
            required
            maxLength={160}
            defaultValue={post?.title ?? ""}
            className={field}
            placeholder="Keep it short and clear"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="post-category" className="text-sm font-medium">
            Category
          </label>
          <select
            id="post-category"
            name="category"
            required
            defaultValue={post?.category ?? ""}
            className={field}
          >
            <option value="" disabled>
              Pick a category
            </option>
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
                required
                defaultValue={post?.price ?? ""}
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
                required
                defaultValue={post?.location ?? ""}
                className={field}
                placeholder="Neighborhood / area"
              />
            </div>
            {!isEdit && (
              <div className="flex flex-col gap-2">
                <label htmlFor="post-duration" className="text-sm font-medium">
                  Keep this listing up for
                </label>
                <select
                  id="post-duration"
                  name="duration"
                  defaultValue={String(DEFAULT_EXPIRY_DAYS)}
                  className={field}
                >
                  {EXPIRY_OPTIONS.map((d) => (
                    <option key={d} value={d}>
                      {d} days
                    </option>
                  ))}
                </select>
                <p className="text-xs text-muted">It’ll disappear automatically after this.</p>
              </div>
            )}
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
            maxLength={8000}
            rows={6}
            defaultValue={post?.body ?? ""}
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
            required={type !== "question"}
            defaultValue={post?.contact ?? ""}
            className={field}
            placeholder="WhatsApp link, phone, or 'reply in the group'"
          />
        </div>

        {/* Images */}
        <div className="flex flex-col gap-2">
          <label htmlFor="post-images" className="text-sm font-medium">
            Photos <span className="text-muted">(up to {MAX_IMAGES}, optional)</span>
          </label>
          {images.length > 0 && (
            <div className="grid grid-cols-4 gap-2">
              {images.map((url) => (
                <div key={url} className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={url}
                    alt=""
                    loading="lazy"
                    className="h-20 w-full rounded-xl object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(url)}
                    aria-label="Remove image"
                    className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full border border-line bg-bg-soft text-sm hover:border-saffron"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
          {images.length < MAX_IMAGES && (
            <input
              id="post-images"
              type="file"
              accept="image/*"
              multiple
              onChange={onFiles}
              disabled={uploading}
              className="text-sm text-muted file:mr-3 file:min-h-11 file:rounded-full file:border file:border-line file:bg-bg-soft file:px-4 file:text-sm hover:file:border-saffron"
            />
          )}
          {uploading && <p className="text-xs text-muted">Uploading…</p>}
          {uploadError && <p className="text-xs text-saffron">{uploadError}</p>}
        </div>

        <p className="glass rounded-2xl p-4 text-xs text-muted">{communityDisclaimer}</p>

        <button
          type="button"
          onClick={() => {
            if (formRef.current?.checkValidity()) {
              setShowModal(true);
            } else {
              formRef.current?.reportValidity();
            }
          }}
          disabled={uploading}
          className="inline-flex min-h-11 items-center justify-center self-start rounded-full border border-line px-6 text-sm font-semibold hover:border-saffron disabled:opacity-50"
        >
          {isEdit ? "Save changes" : "Post"}
        </button>
      </form>

      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="pledge-title"
            className="glass w-full max-w-md rounded-2xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="pledge-title" className="font-display text-lg font-bold">
              Before you post
            </h2>
            <p className="mt-3 text-sm">
              Your post must be honest and accurate to the best of your knowledge. No scams or
              misleading content.
            </p>
            <p className="mt-3 rounded-xl bg-bg-soft p-3 text-xs text-muted">{communityDisclaimer}</p>
            <div className="mt-5 flex flex-wrap justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="inline-flex min-h-11 items-center rounded-full border border-line px-5 text-sm font-medium hover:border-saffron"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowModal(false);
                  formRef.current?.requestSubmit();
                }}
                className="inline-flex min-h-11 items-center rounded-full bg-green-500 px-5 text-sm font-semibold text-black"
              >
                I acknowledge
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

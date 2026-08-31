"use client";

import type { PortfolioItem } from "@/generated/prisma/client";
import { useActionState, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { savePortfolioAction } from "@/app/admin/actions";
import { SubmitButton } from "@/components/admin/submit-button";

export function PortfolioForm({ item }: { item?: PortfolioItem }) {
  const actionWithId = savePortfolioAction.bind(null, item?.id ?? null);
  const [state, action] = useActionState(actionWithId, { message: "" });
  const [preview, setPreview] = useState<string | null>(null);

  return (
    <form className="editorForm" action={action}>
      <div className="editorGrid">
        <div className="editorFields">
          <div className="fieldRow">
            <label>Title<input name="title" defaultValue={item?.title} required maxLength={80} placeholder="e.g. Midnight Botanica" /></label>
            <label>Style<input name="style" defaultValue={item?.style} required maxLength={50} placeholder="Blackwork" /></label>
          </div>
          <label>Image alt text<span>Describe the work for search engines and screen readers.</span><input name="altText" defaultValue={item?.altText} required maxLength={160} placeholder="Blackwork raven tattoo on an upper arm" /></label>
          <label>Description<textarea name="description" defaultValue={item?.description ?? ""} maxLength={320} rows={5} placeholder="A short story behind this piece…" /></label>
          <div className="fieldRow fieldRow--short">
            <label>Display order<input name="sortOrder" type="number" defaultValue={item?.sortOrder ?? 0} min={0} max={999} required /></label>
            <label className="checkboxField"><input name="featured" type="checkbox" defaultChecked={item?.featured} /><span><b>Featured work</b><small>Add a curated badge.</small></span></label>
          </div>
        </div>
        <div className="imageField">
          <label>Artwork image<span>{item ? "Leave empty to keep the current image." : "JPG, PNG, WebP, or AVIF · max 8 MB"}</span></label>
          <label className="imageDrop">
            {(preview || item?.imageUrl) ? <Image src={preview ?? item!.imageUrl} alt="Artwork preview" fill unoptimized={Boolean(preview)} /> : <div><b>＋</b><strong>Choose an image</strong><span>or drop it here</span></div>}
            <input name="image" type="file" accept="image/jpeg,image/png,image/webp,image/avif" required={!item} onChange={(event) => { const file = event.target.files?.[0]; if (file) setPreview(URL.createObjectURL(file)); }} />
            {(preview || item?.imageUrl) && <span className="replaceImage">Replace image</span>}
          </label>
        </div>
      </div>
      {state.message && <p className="formError" role="alert">{state.message}</p>}
      <div className="editorActions"><Link className="adminButton" href="/admin/portfolio">Cancel</Link><SubmitButton>{item ? "Save changes" : "Publish artwork"}</SubmitButton></div>
    </form>
  );
}

"use client";

import type { PriceItem } from "@/generated/prisma/client";
import { useActionState } from "react";
import Link from "next/link";
import { savePriceAction } from "@/app/admin/actions";
import { SubmitButton } from "@/components/admin/submit-button";

export function PriceForm({ item }: { item?: PriceItem }) {
  const actionWithId = savePriceAction.bind(null, item?.id ?? null);
  const [state, action] = useActionState(actionWithId, { message: "" });

  return (
    <form className="editorForm editorForm--narrow" action={action}>
      <div className="editorFields">
        <div className="fieldRow">
          <label>Service name<input name="serviceName" defaultValue={item?.serviceName} required maxLength={80} placeholder="Fine Line" /></label>
          <label>Category<input name="category" defaultValue={item?.category} required maxLength={50} placeholder="Tattoo" /></label>
        </div>
        <div className="fieldRow">
          <label>Price in IDR<span>Use 0 for complimentary services.</span><input name="price" type="number" defaultValue={item?.price ?? 0} required min={0} max={999999999} /></label>
          <label>Duration<input name="duration" defaultValue={item?.duration ?? ""} maxLength={80} placeholder="2–3 hours" /></label>
        </div>
        <label>Description<textarea name="description" defaultValue={item?.description ?? ""} maxLength={320} rows={5} placeholder="What is included in this service?" /></label>
        <div className="fieldRow fieldRow--short">
          <label>Display order<input name="sortOrder" type="number" defaultValue={item?.sortOrder ?? 0} min={0} max={999} required /></label>
          <label className="checkboxField"><input name="featured" type="checkbox" defaultChecked={item?.featured} /><span><b>Most requested</b><small>Highlight this service.</small></span></label>
        </div>
      </div>
      {state.message && <p className="formError" role="alert">{state.message}</p>}
      <div className="editorActions"><Link className="adminButton" href="/admin/prices">Cancel</Link><SubmitButton>{item ? "Save changes" : "Publish price"}</SubmitButton></div>
    </form>
  );
}

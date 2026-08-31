"use client";

import { useFormStatus } from "react-dom";
import { Trash } from "@/components/icons";

export function DeleteButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return <button className="iconButton iconButton--danger" type="submit" disabled={pending} aria-label={`Delete ${label}`} onClick={(event) => { if (!window.confirm(`Delete “${label}”? This cannot be undone.`)) event.preventDefault(); }}>{pending ? <span className="spinner" /> : <Trash />}</button>;
}

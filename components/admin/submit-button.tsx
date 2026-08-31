"use client";

import { useFormStatus } from "react-dom";

export function SubmitButton({ children = "Save changes" }: { children?: React.ReactNode }) {
  const { pending } = useFormStatus();
  return <button className="adminButton adminButton--primary" type="submit" disabled={pending}>{pending ? <><span className="spinner" /> Saving…</> : children}</button>;
}

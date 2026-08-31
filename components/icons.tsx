import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

export function ArrowUpRight(props: IconProps) {
  return <svg viewBox="0 0 24 24" aria-hidden="true" {...props}><path d="M7 17 17 7M8 7h9v9" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

export function ArrowRight(props: IconProps) {
  return <svg viewBox="0 0 24 24" aria-hidden="true" {...props}><path d="M5 12h14m-5-5 5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

export function Instagram(props: IconProps) {
  return <svg viewBox="0 0 24 24" aria-hidden="true" {...props}><rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="1.6" /><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.6" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" /></svg>;
}

export function Menu(props: IconProps) {
  return <svg viewBox="0 0 24 24" aria-hidden="true" {...props}><path d="M4 8h16M4 16h16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>;
}

export function Close(props: IconProps) {
  return <svg viewBox="0 0 24 24" aria-hidden="true" {...props}><path d="m6 6 12 12M18 6 6 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>;
}

export function Plus(props: IconProps) {
  return <svg viewBox="0 0 24 24" aria-hidden="true" {...props}><path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></svg>;
}

export function Edit(props: IconProps) {
  return <svg viewBox="0 0 24 24" aria-hidden="true" {...props}><path d="m14.5 5.5 4 4M4 20l4.5-1 10-10a2.8 2.8 0 0 0-4-4l-10 10L4 20Z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /></svg>;
}

export function Trash(props: IconProps) {
  return <svg viewBox="0 0 24 24" aria-hidden="true" {...props}><path d="M5 7h14M9 7V4h6v3m2 0-1 13H8L7 7m3 4v5m4-5v5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

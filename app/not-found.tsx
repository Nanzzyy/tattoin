import Link from "next/link";

export default function NotFound() {
  return <main className="notFound"><span>404</span><h1>This mark<br /><em>doesn’t exist.</em></h1><p>The page you’re looking for has moved or was never inked.</p><Link className="button button--light" href="/">Return home</Link></main>;
}

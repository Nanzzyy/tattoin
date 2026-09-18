import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/login-form";
import { getCurrentAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  if (await getCurrentAdmin()) redirect("/admin");

  return (
    <main className="loginPage">
      <div className="loginVisual">
        <Image src="/images/hero-studio.png" alt="" fill priority sizes="(max-width: 800px) 0px, 50vw" />
        <div className="loginVisualShade" />
        <div className="loginQuote"><p>“Good work takes time.<br />So does good <em>management.</em>”</p><span>Tattoin studio system</span></div>
      </div>
      <section className="loginPanel">
        <Link className="loginBrand" href="/"><span>T</span><div>TATTOIN<small>Studio CMS</small></div></Link>
        <div className="loginBox"><p className="adminEyebrow">Private access</p><h1>Welcome<br /><em>back.</em></h1><p>Manage the work, pricing, and details shown on your studio website.</p><LoginForm /></div>
        <small className="loginSecure">● Secure, encrypted session</small>
      </section>
    </main>
  );
}

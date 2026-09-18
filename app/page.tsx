import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Instagram } from "@/components/icons";
import { SiteHeader } from "@/components/site-header";
import { formatIDR } from "@/lib/format";
import { getPublicContent } from "@/lib/site-content";

export const dynamic = "force-dynamic";

const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "6281234567890";
const bookingUrl = `https://wa.me/${whatsapp}?text=${encodeURIComponent("Hi Tattoin, I'd like to book a tattoo consultation.")}`;

const approach = [
  { number: "01", title: "Listen", text: "We begin with your story, references, placement, and the feeling you want the work to carry." },
  { number: "02", title: "Draw", text: "Every custom piece is built for your anatomy—never copied, never pulled from a template." },
  { number: "03", title: "Ink", text: "A focused, unhurried session with sterile practice, clear communication, and considered aftercare." },
];

export default async function Home() {
  const [portfolio, prices] = await getPublicContent();

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "TattooParlor",
    name: "Tattoin Studio",
    image: `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/images/hero-studio.png`,
    description: "Private custom tattoo studio specialising in blackwork, fine-line, Japanese, and ornamental work.",
    priceRange: "Rp750.000–Rp4.500.000",
    address: { "@type": "PostalAddress", addressLocality: "Canggu", addressRegion: "Bali", addressCountry: "ID" },
    areaServed: "Bali",
    sameAs: ["https://instagram.com"],
  };

  return (
    <>
      <SiteHeader />
      <main id="main-content">
        <section className="hero" aria-labelledby="hero-title">
          <Image className="heroImage" src="/images/hero-studio.png" alt="Tattoo artist creating a fine-line piece in a dark private studio" fill priority sizes="100vw" />
          <div className="heroShade" />
          <div className="heroGrain" />
          <div className="heroContent">
            <p className="eyebrow heroEyebrow"><span /> Private tattoo atelier · Bali</p>
            <h1 id="hero-title">Stories made<br /><em>permanent.</em></h1>
            <div className="heroBottom">
              <p>Custom tattooing shaped around your story, your body, and your rhythm.</p>
              <a className="button button--light" href={bookingUrl} target="_blank" rel="noreferrer">Start your piece <ArrowUpRight /></a>
            </div>
          </div>
          <div className="heroSideNote" aria-hidden="true">Scroll to discover <span>↓</span></div>
          <div className="heroProof"><strong>10+</strong><span>Years of<br />dedicated craft</span><div /><strong>480</strong><span>Stories made<br />permanent</span></div>
        </section>

        <div className="ticker" aria-hidden="true">
          <div><span>Fine line</span><b>✦</b><span>Blackwork</span><b>✦</b><span>Japanese</span><b>✦</b><span>Ornamental</span><b>✦</b><span>Custom only</span><b>✦</b><span>Fine line</span><b>✦</b><span>Blackwork</span><b>✦</b><span>Japanese</span><b>✦</b></div>
        </div>

        <section className="section section--work" id="work" aria-labelledby="work-title">
          <div className="sectionIntro reveal">
            <p className="eyebrow"><span /> Selected work · 2024—26</p>
            <div>
              <h2 id="work-title">Ink with<br /><em>intention.</em></h2>
              <p>Each piece begins as a conversation and ends as something that could belong to no one else.</p>
            </div>
          </div>

          <div className="portfolioGrid">
            {portfolio.map((item, index) => (
              <article className={`portfolioCard reveal portfolioCard--${index % 5}`} key={item.id} style={{ "--delay": `${(index % 3) * 90}ms` } as React.CSSProperties}>
                <div className="portfolioImage">
                  <Image src={item.imageUrl} alt={item.altText} fill unoptimized sizes={index === 2 ? "(max-width: 700px) 100vw, 55vw" : "(max-width: 700px) 100vw, 40vw"} />
                  <span>{String(index + 1).padStart(2, "0")}</span>
                </div>
                <div className="portfolioMeta"><div><h3>{item.title}</h3><p>{item.style}</p></div>{item.featured && <small>Featured</small>}</div>
              </article>
            ))}
          </div>

          <a className="textLink" href="https://instagram.com" target="_blank" rel="noreferrer"><Instagram /> See the full archive on Instagram <ArrowRight /></a>
        </section>

        <section className="section studioSection" id="studio" aria-labelledby="studio-title">
          <div className="studioIntro reveal">
            <p className="eyebrow"><span /> Inside the studio</p>
            <div>
              <h2 id="studio-title">A room made for<br /><em>good work.</em></h2>
              <p>Tattoin is a private atelier in the heart of Canggu—quiet, considered, and open by appointment only.</p>
            </div>
          </div>
          <div className="studioFeature">
            <div className="studioPhoto reveal">
              <Image src="/images/studio-interior.png" alt="Interior of the Tattoin tattoo studio with a tattoo chair and workstation" fill sizes="(max-width: 760px) 100vw, 68vw" />
            </div>
            <div className="studioInfo reveal">
              <p className="eyebrow"><span /> The space</p>
              <h3>Private by design.</h3>
              <p>One calm room, one focused session, and enough time to get every detail right.</p>
              <dl>
                <div><dt>Location</dt><dd>Canggu, Bali</dd></div>
                <div><dt>Sessions</dt><dd>By appointment</dd></div>
                <div><dt>Clients</dt><dd>18+ only</dd></div>
              </dl>
            </div>
          </div>
        </section>

        <section className="manifesto" aria-labelledby="manifesto-title">
          <div className="manifestoInner reveal">
            <p className="eyebrow eyebrow--center"><span /> Our philosophy <span /></p>
            <blockquote id="manifesto-title">“A tattoo should feel like it has <em>always</em> belonged to you.”</blockquote>
            <p>— Arya, founder & artist</p>
          </div>
        </section>

        <section className="section approach" id="approach" aria-labelledby="approach-title">
          <div className="sectionIntro sectionIntro--compact reveal">
            <p className="eyebrow"><span /> The process</p>
            <h2 id="approach-title">A calm, considered<br /><em>approach.</em></h2>
          </div>
          <div className="approachGrid">
            {approach.map((step) => (
              <article className="approachCard reveal" key={step.number}>
                <span>{step.number}</span>
                <div className="approachGlyph" aria-hidden="true">{step.number === "01" ? "◌" : step.number === "02" ? "✣" : "✦"}</div>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section pricing" id="pricing" aria-labelledby="pricing-title">
          <div className="pricingHeader reveal">
            <div><p className="eyebrow"><span /> Starting prices</p><h2 id="pricing-title">Clear from<br /><em>the start.</em></h2></div>
            <p>Every body and every brief is different. These guide prices help you plan; your final quote is confirmed after consultation.</p>
          </div>
          <div className="priceList">
            {prices.map((item, index) => (
              <article className={`priceRow reveal${item.featured ? " priceRow--featured" : ""}`} key={item.id}>
                <span className="priceIndex">{String(index + 1).padStart(2, "0")}</span>
                <div className="priceName"><h3>{item.serviceName}</h3><p>{item.description}</p></div>
                <span className="priceDuration">{item.duration}</span>
                <strong>{formatIDR(item.price)}</strong>
                {item.featured && <small>Most requested</small>}
              </article>
            ))}
          </div>
          <p className="priceNote reveal">A non-refundable deposit secures your appointment and is deducted from the final cost.</p>
        </section>

        <section className="booking" id="booking" aria-labelledby="booking-title">
          <div className="bookingGlow" />
          <div className="bookingContent reveal">
            <p className="eyebrow eyebrow--center"><span /> Your story, your skin <span /></p>
            <h2 id="booking-title">Ready to make it<br /><em>permanent?</em></h2>
            <p>Tell us what you have in mind. We’ll reply within 1–2 studio days with thoughtful next steps.</p>
            <a className="button button--light button--large" href={bookingUrl} target="_blank" rel="noreferrer">Book a consultation <ArrowUpRight /></a>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="footerTop">
          <Link className="brand brand--footer" href="/"><span className="brandMark">T</span><span>TATTOIN<small>Bali · Indonesia</small></span></Link>
          <div><p>Visit</p><address>Jl. Pantai Batu Bolong<br />Canggu, Bali 80361</address></div>
          <div><p>Contact</p><a href={`https://wa.me/${whatsapp}`}>WhatsApp</a><a href="mailto:studio@tattoin.com">studio@tattoin.com</a></div>
          <div><p>Follow</p><a href="https://instagram.com" target="_blank" rel="noreferrer">Instagram ↗</a><a href="https://pinterest.com" target="_blank" rel="noreferrer">Pinterest ↗</a></div>
        </div>
        <div className="footerBottom"><span>© {new Date().getFullYear()} Tattoin Studio</span><span>By appointment only · 18+</span><Link href="/admin/login">Studio login</Link></div>
      </footer>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
    </>
  );
}

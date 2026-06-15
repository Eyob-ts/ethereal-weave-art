import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

import { ClientOnly } from "@/components/zhaddi/ClientOnly";
import { Cursor } from "@/components/zhaddi/Cursor";
import { SmoothScroll } from "@/components/zhaddi/SmoothScroll";
import { HeroCanvas } from "@/components/zhaddi/HeroCanvas";
import { ThreadParticles } from "@/components/zhaddi/ThreadParticles";
import { useReveal } from "@/components/zhaddi/useReveal";

import atelier1 from "@/assets/zhaddi-atelier-1.jpg";
import atelier2 from "@/assets/zhaddi-atelier-2.jpg";
import atelier3 from "@/assets/zhaddi-atelier-3.jpg";
import gownCelestial from "@/assets/gown-celestial.jpg";
import gownNoir from "@/assets/gown-noir.jpg";
import gownAureate from "@/assets/gown-aureate.jpg";
import gownBlush from "@/assets/gown-blush.jpg";
import veilImg from "@/assets/zhaddi-veil.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Zhaddi Wedding — Where Forever Begins in Silk & Starlight" },
      {
        name: "description",
        content:
          "Zhaddi Wedding is a luxury bridal fashion house crafting couture gowns where every stitch is a promise. Request an atelier consultation.",
      },
      { property: "og:title", content: "Zhaddi Wedding — Luxury Bridal Couture" },
      {
        property: "og:description",
        content: "Haute couture wedding gowns woven in silk and starlight.",
      },
      { property: "og:image", content: gownAureate },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const collection = [
  { name: "The Celestial", note: "Ivory silk, silver star embroidery", img: gownCelestial },
  { name: "The Noir", note: "Midnight charmeuse, gilded lacework", img: gownNoir },
  { name: "The Aureate", note: "Liquid gold satin, hand beadwork", img: gownAureate },
  { name: "The Blush", note: "Rose tulle, whispered lace", img: gownBlush },
];

function Loader({ done }: { done: boolean }) {
  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-zhaddi-black transition-opacity duration-1000"
      style={{ opacity: done ? 0 : 1, pointerEvents: done ? "none" : "auto" }}
    >
      <div className="text-center">
        <div className="font-serif text-4xl tracking-[0.5em] text-gradient-gold">
          ZHADDI
        </div>
        <div className="mx-auto mt-6 h-px w-40 overflow-hidden bg-white/10">
          <div
            className="h-full bg-zhaddi-gold transition-[width] duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{ width: done ? "100%" : "8%" }}
          />
        </div>
        <p className="mt-4 font-display text-xs uppercase tracking-[0.4em] text-zhaddi-ivory/40">
          Weaving the atelier
        </p>
      </div>
    </div>
  );
}

function Index() {
  const ref = useReveal<HTMLDivElement>();
  const [loaded, setLoaded] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 1500);
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      clearTimeout(t);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // drag-to-scroll for carousel
  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;
    let down = false;
    let startX = 0;
    let startScroll = 0;
    const onDown = (e: PointerEvent) => {
      down = true;
      startX = e.clientX;
      startScroll = el.scrollLeft;
    };
    const onMove = (e: PointerEvent) => {
      if (!down) return;
      el.scrollLeft = startScroll - (e.clientX - startX) * 1.4;
    };
    const onUp = () => (down = false);
    el.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      el.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, []);

  return (
    <div ref={ref} className="zhaddi-root relative">
      <Loader done={loaded} />
      <ClientOnly>
        <Cursor />
        <SmoothScroll />
      </ClientOnly>

      {/* ===== HERO — The Unveiling ===== */}
      <section className="relative flex h-screen items-center justify-center overflow-hidden">
        <ClientOnly>
          <HeroCanvas />
        </ClientOnly>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-zhaddi-black/40 via-transparent to-zhaddi-black" />
        <div className="relative z-10 px-6 text-center">
          <p className="font-display text-sm uppercase tracking-[0.55em] text-zhaddi-gold/80">
            Haute Bridal Couture
          </p>
          <h1 className="font-serif text-[18vw] leading-[0.85] tracking-[0.08em] text-gradient-gold md:text-[12vw]">
            ZHADDI
          </h1>
          <p className="mx-auto mt-6 max-w-xl font-display text-xl font-light tracking-wide text-zhaddi-ivory/80 md:text-2xl">
            Where forever begins in silk and starlight.
          </p>
        </div>
        <div className="absolute bottom-10 left-1/2 z-10 -translate-x-1/2 text-center">
          <p className="font-display text-[0.7rem] uppercase tracking-[0.4em] text-zhaddi-ivory/50">
            Scroll to unveil
          </p>
          <div className="mx-auto mt-3 h-10 w-px animate-zhaddi-float bg-gradient-to-b from-zhaddi-gold to-transparent" />
        </div>
      </section>

      {/* ===== ATELIER — Philosophy ===== */}
      <section className="relative mx-auto max-w-7xl px-6 py-32 md:py-44">
        <div className="grid items-center gap-16 md:grid-cols-2">
          <div className="zhaddi-reveal">
            <p className="font-display text-sm uppercase tracking-[0.45em] text-zhaddi-gold/80">
              The Atelier
            </p>
            <h2 className="mt-6 font-serif text-4xl leading-tight md:text-5xl">
              Every stitch is a promise.
            </h2>
            <p className="mt-6 max-w-md font-display text-xl font-light leading-relaxed text-zhaddi-ivory/70">
              Every fold, a whisper of devotion. Within our atelier, time slows.
              Silk is coaxed, lace is breathed into being, and light is captured
              thread by thread — until a gown becomes a memory you can wear.
            </p>
            <div className="zhaddi-hairline mt-10 w-2/3" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[atelier1, atelier2, atelier3].map((src, i) => (
              <div
                key={i}
                className="zhaddi-reveal overflow-hidden rounded-sm border border-white/5"
                style={{
                  transform: `translateY(${(scrollY * 0.04 * (i - 1)).toFixed(1)}px)`,
                }}
              >
                <img
                  src={src}
                  alt={["Hand-stitching silk", "Lace detail", "Gold beadwork"][i]}
                  loading="lazy"
                  width={1024}
                  height={1280}
                  className="h-[22rem] w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-110"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== COLLECTION — The Silhouettes ===== */}
      <section className="relative py-24">
        <div className="mx-auto mb-12 max-w-7xl px-6">
          <p className="zhaddi-reveal font-display text-sm uppercase tracking-[0.45em] text-zhaddi-gold/80">
            The Silhouettes
          </p>
          <h2 className="zhaddi-reveal mt-4 font-serif text-4xl md:text-5xl">
            The Collection
          </h2>
        </div>
        <div
          ref={carouselRef}
          data-cursor
          className="flex snap-x gap-6 overflow-x-auto px-6 pb-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {collection.map((g) => (
            <article
              key={g.name}
              className="group relative w-[78vw] shrink-0 snap-center overflow-hidden rounded-sm border border-white/5 sm:w-[44vw] lg:w-[28vw]"
            >
              <img
                src={g.img}
                alt={g.name}
                loading="lazy"
                width={1024}
                height={1600}
                className="h-[34rem] w-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zhaddi-black via-zhaddi-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 p-6">
                <h3 className="font-serif text-2xl text-zhaddi-ivory">{g.name}</h3>
                <p className="mt-1 font-display text-sm tracking-wide text-zhaddi-gold/80">
                  {g.note}
                </p>
              </div>
            </article>
          ))}
        </div>
        <p className="mt-2 text-center font-display text-xs uppercase tracking-[0.4em] text-zhaddi-ivory/40">
          Drag to explore
        </p>
      </section>

      {/* ===== CRAFTSMANSHIP — Threads of Devotion ===== */}
      <section className="relative h-[90vh] overflow-hidden">
        <ClientOnly>
          <ThreadParticles />
        </ClientOnly>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-end pb-20 text-center">
          <p className="font-display text-sm uppercase tracking-[0.45em] text-zhaddi-gold/80">
            Threads of Devotion
          </p>
          <h2 className="mt-3 max-w-lg px-6 font-serif text-3xl md:text-4xl">
            Thousands of golden threads, woven into one name.
          </h2>
          <p className="mt-3 font-display text-xs uppercase tracking-[0.35em] text-zhaddi-ivory/40">
            Click to disturb the silk
          </p>
        </div>
      </section>

      {/* ===== ATMOSPHERE — The Veil ===== */}
      <section className="relative flex h-screen items-center justify-center overflow-hidden">
        <img
          src={veilImg}
          alt="Backlit bridal veil"
          loading="lazy"
          width={1920}
          height={1280}
          className="absolute inset-0 h-full w-full object-cover"
          style={{ transform: `scale(1.1) translateY(${(scrollY * 0.02).toFixed(1)}px)` }}
        />
        <div className="absolute inset-0 bg-zhaddi-black/40" />
        <div className="relative z-10 max-w-2xl px-6 text-center">
          <h2 className="zhaddi-reveal font-serif text-4xl leading-tight md:text-6xl">
            Some moments deserve to be veiled in eternity.
          </h2>
        </div>
      </section>

      {/* ===== CTA — Begin Your Legacy ===== */}
      <section className="relative px-6 py-32 md:py-44">
        <div className="mx-auto max-w-2xl text-center">
          <p className="zhaddi-reveal font-display text-sm uppercase tracking-[0.45em] text-zhaddi-gold/80">
            Begin Your Legacy
          </p>
          <h2 className="zhaddi-reveal mt-4 font-serif text-4xl md:text-5xl">
            Request an Atelier Consultation
          </h2>
          <form
            className="zhaddi-reveal mt-12 grid gap-5 text-left"
            onSubmit={(e) => {
              e.preventDefault();
              const btn = e.currentTarget.querySelector("button");
              if (btn) btn.textContent = "Thank you — we will be in touch";
            }}
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Full name" type="text" name="name" />
              <Field label="Email" type="email" name="email" />
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Preferred date" type="date" name="date" />
              <div>
                <label className="mb-2 block font-display text-xs uppercase tracking-[0.3em] text-zhaddi-ivory/50">
                  Dream silhouette
                </label>
                <select
                  name="silhouette"
                  className="w-full border-0 border-b border-white/15 bg-transparent py-3 font-display text-lg text-zhaddi-ivory outline-none focus:border-zhaddi-gold"
                >
                  {collection.map((c) => (
                    <option key={c.name} className="bg-zhaddi-black">
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <button
              type="submit"
              className="group relative mt-6 overflow-hidden rounded-full border border-zhaddi-gold/60 px-10 py-4 font-display text-sm uppercase tracking-[0.35em] text-zhaddi-gold transition-colors duration-500 hover:text-zhaddi-black"
            >
              <span className="absolute inset-0 -z-0 origin-bottom scale-y-0 bg-zhaddi-gold transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-y-100" />
              <span className="relative z-10">Request Atelier Consultation</span>
            </button>
          </form>
        </div>
        <footer className="mx-auto mt-28 max-w-7xl border-t border-white/5 pt-10 text-center">
          <div className="font-serif text-2xl tracking-[0.4em] text-gradient-gold">
            ZHADDI
          </div>
          <p className="mt-3 font-display text-xs uppercase tracking-[0.3em] text-zhaddi-ivory/40">
            © {new Date().getFullYear()} Zhaddi Wedding — Silk &amp; Starlight
          </p>
        </footer>
      </section>
    </div>
  );
}

function Field({
  label,
  type,
  name,
}: {
  label: string;
  type: string;
  name: string;
}) {
  return (
    <div>
      <label className="mb-2 block font-display text-xs uppercase tracking-[0.3em] text-zhaddi-ivory/50">
        {label}
      </label>
      <input
        type={type}
        name={name}
        required
        className="w-full border-0 border-b border-white/15 bg-transparent py-3 font-display text-lg text-zhaddi-ivory outline-none placeholder:text-zhaddi-ivory/30 focus:border-zhaddi-gold"
      />
    </div>
  );
}

"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, CheckCircle2, Search } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

export type Highlight = {
  _id: string;
  category: "news" | "update" | "class" | "scholarship" | "announcement";
  title: string;
  summary: string;
  link?: { label?: string; url?: string };
  mainImage?: { url: string; alt?: string };
};

const fallbackHighlights: Highlight[] = [
  {
    _id: "welcome",
    category: "update",
    title: "Find the right education consultancy with confidence",
    summary:
      "Compare trusted consultancies across Nepal and plan your international education journey.",
    link: { label: "Explore consultancies", url: "/consultancies" },
    mainImage: {
      url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2070&auto=format&fit=crop",
      alt: "Students collaborating around a table",
    },
  },
  {
    _id: "scholarships",
    category: "scholarship",
    title: "Discover opportunities that can fund your studies",
    summary:
      "Browse scholarship information and take the next step toward studying abroad without financial worries.",
    link: { label: "View scholarships", url: "/scholarships" },
    mainImage: {
      url: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop",
      alt: "Students cheering with backpacks",
    },
  },
  {
    _id: "destinations",
    category: "announcement",
    title: "Start planning your study-abroad journey",
    summary:
      "Explore popular destinations, entry requirements, and options for your academic and career goals.",
    link: { label: "View destinations", url: "/study" },
    mainImage: {
      url: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2074&auto=format&fit=crop",
      alt: "Airplane wing and destination map",
    },
  },
];

const categoryLabels: Record<Highlight["category"], string> = {
  news: "News",
  update: "Update",
  class: "Class",
  scholarship: "Scholarship",
  announcement: "Announcement",
};

export function AnimatedHero({ highlights }: { highlights: Highlight[] }) {
  const slides = highlights.length ? highlights : fallbackHighlights;
  const [active, setActive] = useState(0);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion || slides.length < 2) return;
    const timer = window.setInterval(
      () => setActive((current) => (current + 1) % slides.length),
      6500,
    );
    return () => window.clearInterval(timer);
  }, [reduceMotion, slides.length]);

  const slide = slides[active];
  // Keep the lead visual consistent when slide copy changes.
  const suppliedImage =
    active === 0 ? fallbackHighlights[0].mainImage?.url : slide.mainImage?.url;
  const validImageUrl =
    suppliedImage &&
    (suppliedImage.startsWith("/") || /^https?:\/\//.test(suppliedImage));
  const imageUrl =
    validImageUrl && !failedImages[slide._id]
      ? suppliedImage
      : "/images/hero-fallback.svg";

  return (
    <section
      className="relative flex min-h-[700px] w-full items-center overflow-hidden bg-[#eef6f3] px-4 py-16 lg:min-h-[760px] lg:py-20"
      aria-roledescription="carousel"
      aria-label="Latest news and opportunities"
    >
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(16,47,59,.12)_1px,transparent_0)] bg-[size:28px_28px] [mask-image:linear-gradient(to_bottom,black,transparent_80%)]" />
        <div className="absolute -right-40 top-16 h-[34rem] w-[34rem] rounded-full bg-brand-secondary/15 blur-[100px]" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={slide._id}
            initial={reduceMotion ? false : { opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, x: 20 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            aria-live="polite"
            aria-atomic="true"
            className="grid items-center gap-12 lg:grid-cols-[1.02fr_.98fr] lg:gap-16"
          >
            {/* Text Content */}
            <div className="flex flex-col items-start text-left">
              <h1 className="mb-6 max-w-3xl text-4xl font-extrabold leading-[1.04] tracking-[-.045em] text-brand-primary sm:text-5xl lg:text-7xl text-balance">
                {slide.title}
              </h1>
              <p className="mb-8 max-w-xl text-lg leading-8 text-text-muted sm:text-xl">
                {slide.summary}
              </p>
              {slide.link?.url && (
                <div className="flex flex-col gap-3 sm:flex-row"><Link href={slide.link.url} className="group inline-flex min-h-14 items-center justify-center rounded-xl bg-brand-primary px-7 text-base font-bold text-white shadow-[0_14px_30px_-16px_rgba(16,47,59,.7)] transition hover:bg-brand-secondary">
                  {slide.link.label || "Learn more"}
                  <ArrowRight
                    className="ml-2 size-5 transition-transform group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </Link><Link href="/study" className="inline-flex min-h-14 items-center justify-center rounded-xl border border-brand-primary/15 bg-white/70 px-7 font-bold text-brand-primary transition hover:border-brand-secondary hover:bg-white"><Search className="mr-2 h-5 w-5" aria-hidden="true" />Explore destinations</Link></div>
              )}
              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-text-muted"><span className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-brand-secondary" aria-hidden="true" />Transparent profiles</span><span className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-brand-secondary" aria-hidden="true" />Practical study guides</span></div>
            </div>

            {/* Image Content */}
            <div className="relative flex w-full justify-center">
              {imageUrl ? (
                <div className="relative aspect-[4/3] w-full max-w-2xl overflow-hidden rounded-[2rem] bg-gray-100 shadow-[0_30px_80px_-35px_rgba(16,47,59,.6)] ring-1 ring-brand-primary/10">
                  <Image
                    key={`${slide._id}-${imageUrl}`}
                    src={imageUrl}
                    alt={
                      active === 0
                        ? "Students collaborating around a table"
                        : slide.mainImage?.alt || slide.title
                    }
                    fill
                    className="object-cover"
                    priority={active === 0}
                    sizes="(max-width: 768px) 100vw, 50vw"
                    onError={() =>
                      setFailedImages((current) => ({
                        ...current,
                        [slide._id]: true,
                      }))
                    }
                  />
                </div>
              ) : (
                <div className="relative w-full aspect-[4/3] lg:aspect-square xl:aspect-[4/3] max-w-2xl rounded-3xl overflow-hidden shadow-2xl ring-1 ring-black/5 bg-gradient-to-br from-brand-primary/20 to-brand-secondary/20 flex items-center justify-center">
                  <span className="text-brand-primary/40 font-semibold text-xl">
                    No image provided
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {slides.length > 1 && (
          <div className="mt-10 flex flex-col items-center gap-6 lg:items-start">
            <div
              className="flex gap-3"
              role="tablist"
              aria-label="Choose a highlight"
            >
              {slides.map((item, index) => (
                <button
                  key={item._id}
                  type="button"
                  role="tab"
                  aria-selected={index === active}
                  aria-label={`Show ${categoryLabels[item.category]}: ${item.title}`}
                  onClick={() => setActive(index)}
                  className={`h-3 min-w-11 rounded-full transition-colors ${index === active ? "bg-brand-primary shadow-sm" : "bg-white ring-1 ring-brand-primary/20 hover:bg-brand-secondary/20"}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

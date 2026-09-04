"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  GraduationCap,
  Search,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import type { ConsultancyCard } from "@/lib/sanity/consultancies";

type Post = { 
  _id: string; 
  title: string; 
  slug: string; 
  excerpt?: string;
  publishedAt?: string;
  mainImage?: { url: string; alt?: string };
  author?: { name: string; image?: { url: string; alt?: string } };
};

const pathways = [
  {
    title: "Choose a destination",
    description:
      "Compare study environments, common intakes and planning considerations.",
    href: "/study",
    icon: GraduationCap,
  },
  {
    title: "Prepare for a test",
    description:
      "Understand IELTS, PTE, TOEFL and SAT formats before choosing support.",
    href: "/test-preparation",
    icon: BookOpen,
  },
  {
    title: "Attend an event",
    description:
      "Find upcoming fairs, information sessions, workshops and webinars.",
    href: "/events",
    icon: CalendarDays,
  },
];
const faqs = [
  {
    question: "How should I compare education consultancies?",
    answer:
      "Compare relevant destination experience, transparent service fees, counsellor access, documentation practices and support after an offer. Verify important claims with the institution or official authority.",
  },
  {
    question: "Does a verified badge guarantee a visa or admission?",
    answer:
      "No. Verification only indicates that selected listing details were reviewed on the displayed date. Universities and government authorities make admission and visa decisions.",
  },
  {
    question: "What should I ask before paying a consultancy?",
    answer:
      "Ask for a written service scope, refund terms, third-party fees, application access and the name of the person managing your case. Keep your own copies of every submission and receipt.",
  },
  {
    question: "Can I apply to study abroad without a consultancy?",
    answer:
      "Often, yes. Many institutions accept direct applications. A consultancy may be useful for guidance and administration, but students should retain control of their email, documents and final decisions.",
  },
];

export function HomeDiscovery({
  consultancies,
  posts,
}: {
  consultancies: ConsultancyCard[];
  posts: Post[];
}) {
  const reduceMotion = useReducedMotion();
  return (
    <>
      <section className="relative overflow-hidden bg-white py-24 lg:py-28">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-secondary/30 to-transparent" />
        <div className="mx-auto max-w-7xl px-4">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto max-w-3xl text-center"
          >
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-brand-secondary">
              Start with what you need
            </p>
            <h2 className="mt-4 text-4xl font-extrabold tracking-tight text-brand-primary md:text-5xl">
              A clearer path to your next step
            </h2>
            <p className="mt-5 text-lg leading-8 text-text-muted">
              Research the decision first, then compare providers with more
              useful questions.
            </p>
          </motion.div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {pathways.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.article
                  key={item.title}
                  initial={reduceMotion ? false : { opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group rounded-3xl border border-slate-200 bg-slate-50 p-7 transition hover:-translate-y-1 hover:bg-white hover:shadow-xl"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-primary text-white">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-6 text-2xl font-bold text-brand-primary">
                    {item.title}
                  </h3>
                  <p className="mt-3 leading-7 text-text-muted">
                    {item.description}
                  </p>
                  <Link
                    href={item.href}
                    className="mt-6 inline-flex items-center font-bold text-brand-secondary"
                  >
                    Explore{" "}
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-slate-100 py-24 lg:py-28">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-brand-secondary">
                Directory preview
              </p>
              <h2 className="mt-3 text-4xl font-extrabold text-brand-primary md:text-5xl">
                Consultancies to explore
              </h2>
              <p className="mt-4 max-w-2xl text-lg text-text-muted">
                Review profiles, services and public contact details. Imported
                listings remain unverified until independently checked by our
                editors.
              </p>
            </div>
            <Link
              href="/consultancies"
              className="inline-flex items-center font-bold text-brand-secondary"
            >
              View full directory <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
          {consultancies.length ? (
            <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {consultancies.slice(0, 8).map((item, index) => (
                <motion.article
                  key={item._id}
                  initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.06 }}
                  className="flex min-h-64 flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    {item.logo?.url ? (
                      <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl bg-white shadow-sm border border-slate-100">
                        <Image src={item.logo.url} alt={item.logo.alt || `${item.name} logo`} width={44} height={44} className="h-full w-full object-contain p-1" />
                      </div>
                    ) : (
                      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-primary/5 text-lg font-extrabold text-brand-primary">
                        {item.name.charAt(0)}
                      </span>
                    )}
                    {item.isVerified && (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700">
                        <CheckCircle2 className="h-4 w-4" /> Verified
                      </span>
                    )}
                  </div>
                  <h3 className="mt-5 text-xl font-bold text-brand-primary">
                    {item.name}
                  </h3>
                  <p className="mt-2 text-sm font-medium text-brand-secondary">
                    {item.city || "Nepal"}
                  </p>
                  <p className="mt-4 flex-1 text-sm leading-6 text-text-muted">
                    {item.destinations?.length
                      ? `Destinations include ${item.destinations.slice(0, 3).join(", ")}.`
                      : "View the profile for available services and contact details."}
                  </p>
                  <Link
                    href={`/consultancies/${item.slug}`}
                    className="mt-5 font-bold text-brand-primary hover:text-brand-secondary"
                  >
                    View profile →
                  </Link>
                </motion.article>
              ))}
            </div>
          ) : (
            <div className="mt-10 rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-text-muted">
            More consultancy profiles are being reviewed and will appear here
            soon.
            </div>
          )}
        </div>
      </section>

      <section className="bg-white py-24">
        <div className="mx-auto grid max-w-7xl gap-14 px-4 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-brand-secondary">
              Independent decisions
            </p>
            <h2 className="mt-3 text-4xl font-extrabold text-brand-primary">
              Use the directory with confidence
            </h2>
            <div className="mt-8 space-y-5">
              {[
                {
                  icon: Search,
                  title: "Compare consistently",
                  text: "Review the same practical details across different providers.",
                },
                {
                  icon: ShieldCheck,
                  title: "Understand verification",
                  text: "A badge records a check, not an endorsement or promised outcome.",
                },
                {
                  icon: CheckCircle2,
                  title: "Confirm before committing",
                  text: "Cross-check fees, affiliations and requirements using official sources.",
                },
              ].map(({ icon: Icon, title, text }) => (
                <div key={title} className="flex gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-secondary/10 text-brand-secondary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-brand-primary">{title}</h3>
                    <p className="mt-1 leading-7 text-text-muted">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-brand-secondary">
              Common questions
            </p>
            <div className="mt-5 divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-slate-50 px-6">
              {faqs.map((faq) => (
                <details key={faq.question} className="group py-5">
                  <summary className="cursor-pointer list-none pr-6 font-bold text-brand-primary marker:hidden">
                    {faq.question}
                    <span className="float-right text-brand-secondary transition-transform group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 pr-8 leading-7 text-text-muted">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </div>
        {posts.length ? (
          <div className="mx-auto mt-20 max-w-7xl px-4">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-brand-secondary">
                  Latest resources
                </p>
                <h2 className="mt-3 text-3xl font-extrabold text-brand-primary">
                  Read before you decide
                </h2>
              </div>
              <Link href="/blog" className="font-bold text-brand-secondary hover:underline">
                All guides →
              </Link>
            </div>
            
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {posts.map((post) => (
                <article 
                  key={post._id} 
                  className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-secondary/10 hover:border-brand-secondary/30"
                >
                  <div className="flex flex-col h-full">
                    {post.mainImage?.url && (
                      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                        <Image 
                          src={post.mainImage.url} 
                          alt={post.mainImage.alt || post.title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                    )}
                    
                    <div className="flex flex-col flex-1 p-6">
                      <div className="flex items-center gap-2 text-sm font-medium text-text-muted mb-3">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 text-[10px]">
                          📅
                        </span>
                        {post.publishedAt ? new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(new Date(post.publishedAt)) : 'Study guide'}
                      </div>
                      
                      <h3 className="mb-3 text-xl font-bold text-brand-primary">
                        <Link href={`/blog/${post.slug}`} className="before:absolute before:inset-0">
                          {post.title}
                        </Link>
                      </h3>
                      
                      {post.excerpt && (
                        <p className="mb-5 line-clamp-3 text-sm leading-relaxed text-text-muted flex-1">
                          {post.excerpt}
                        </p>
                      )}
                      
                      <div className="mt-4 flex items-center justify-between pt-4 border-t border-slate-100">
                        {post.author ? (
                          <div className="flex items-center gap-2 relative z-20">
                            {post.author.image?.url ? (
                              <div className="relative h-8 w-8 overflow-hidden rounded-full border border-slate-200">
                                <Image
                                  src={post.author.image.url}
                                  alt={post.author.image.alt || post.author.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            ) : (
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-500">
                                {post.author.name.charAt(0)}
                              </div>
                            )}
                            <span className="text-xs font-medium text-text-main">{post.author.name}</span>
                          </div>
                        ) : <div />}
                        
                        <div className="flex items-center gap-1 text-sm font-semibold text-brand-secondary group-hover:text-brand-primary transition-colors">
                          Read 
                          <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        ) : null}
      </section>
    </>
  );
}

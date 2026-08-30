'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import Image from 'next/image';

export function CTASection() {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden bg-brand-primary">
      {/* Premium Background Patterns */}
      <div className="absolute inset-0 z-0 opacity-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>
      
      {/* Ambient Glow Effects */}
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3">
        <div className="w-96 h-96 bg-brand-secondary rounded-full opacity-30 blur-[100px]" />
      </div>
      <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3">
        <div className="w-96 h-96 bg-white rounded-full opacity-10 blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center"
        >
          {/* Trust Indicators / Avatar Group */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-6 py-2.5 shadow-xl">
             <div className="flex -space-x-3">
               {[
                 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
                 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop',
                 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
                 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
               ].map((src, i) => (
                 <div key={i} className="w-10 h-10 rounded-full border-2 border-brand-primary overflow-hidden relative shadow-sm">
                   <Image src={src} alt="Student avatar" fill className="object-cover" />
                 </div>
               ))}
             </div>
             <div className="text-center sm:text-left flex flex-col items-center sm:items-start">
               <div className="flex items-center text-yellow-400 text-sm mb-0.5">
                 {'★'.repeat(5)}
               </div>
               <p className="text-sm font-medium text-white/90">
                 Trusted by <span className="font-bold text-white">10,000+</span> students
               </p>
             </div>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 text-balance leading-[1.1]">
            Ready to start your <br className="hidden sm:block" />
            <span className="text-brand-secondary relative inline-block mt-2">
              journey?
              <Sparkles className="absolute -top-8 -right-8 text-brand-secondary w-8 h-8 animate-pulse opacity-80 hidden sm:block" />
            </span>
          </h2>
          
          <p className="text-lg md:text-2xl text-white/80 mb-12 max-w-2xl text-balance leading-relaxed">
            Join thousands of students who found their perfect education partner through our comprehensive directory.
          </p>
          
          <Link
            href="/consultancies"
            className="group relative inline-flex h-16 items-center justify-center rounded-full bg-white px-10 text-lg font-bold text-brand-primary transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.4)] active:scale-95"
          >
            Start Searching Now
            <ArrowRight className="ml-3 h-6 w-6 transition-transform duration-300 group-hover:translate-x-2" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, MapPin } from 'lucide-react';

const destinations = [
  {
    title: 'Australia',
    slug: 'australia',
    description: 'World-class education and incredible post-study work opportunities in a vibrant, diverse environment.',
    image: 'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?q=80&w=2130&auto=format&fit=crop',
    color: 'from-blue-500/10 to-cyan-500/10',
    borderColor: 'group-hover:border-blue-500/50',
    buttonColor: 'bg-blue-50 text-blue-700 group-hover:bg-blue-600 group-hover:text-white',
  },
  {
    title: 'Canada',
    slug: 'canada',
    description: 'Highly welcoming for international students, offering excellent pathways to permanent residency.',
    image: 'https://images.unsplash.com/photo-1550596334-7bb40a71b6bc?q=80&w=2070&auto=format&fit=crop',
    color: 'from-red-500/10 to-orange-500/10',
    borderColor: 'group-hover:border-red-500/50',
    buttonColor: 'bg-red-50 text-red-700 group-hover:bg-red-600 group-hover:text-white',
  },
  {
    title: 'United Kingdom',
    slug: 'uk',
    description: 'Home to some of the oldest and most prestigious universities in the world.',
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=2070&auto=format&fit=crop',
    color: 'from-indigo-500/10 to-purple-500/10',
    borderColor: 'group-hover:border-indigo-500/50',
    buttonColor: 'bg-indigo-50 text-indigo-700 group-hover:bg-indigo-600 group-hover:text-white',
  },
  {
    title: 'United States',
    slug: 'usa',
    description: 'The largest international student population in the world, with unmatched academic flexibility.',
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=2070&auto=format&fit=crop',
    color: 'from-emerald-500/10 to-teal-500/10',
    borderColor: 'group-hover:border-emerald-500/50',
    buttonColor: 'bg-emerald-50 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white',
  }
];

export function BentoGrid() {
  return (
    <div className="py-24 lg:py-32 px-4 max-w-6xl mx-auto overflow-hidden">
      <div className="text-center mb-20">
        <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-gray-900 mb-6">
          Popular Study Destinations
        </h2>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Explore top countries for Nepalese students. Discover world-class universities and vibrant cultures.
        </p>
      </div>

      <div className="flex flex-col gap-10 md:gap-16 relative">
        {/* Subtle connecting line in the background for desktop */}
        <div className="hidden lg:block absolute left-1/2 top-8 bottom-8 w-px bg-gray-200 -translate-x-1/2 z-0" />

        {destinations.map((dest, i) => {
          const isEven = i % 2 === 0;
          return (
            <motion.div
              key={dest.title}
              initial={{ opacity: 0, x: isEven ? -50 : 50, y: 20 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, type: "spring", bounce: 0.3 }}
              className={`w-full lg:w-[85%] xl:w-[80%] relative z-10 ${isEven ? 'lg:mr-auto' : 'lg:ml-auto'}`}
            >
              <Link href={`/study/${dest.slug}`} className="block group">
                <div className={`relative overflow-hidden rounded-[2rem] border border-gray-100 bg-white p-6 md:p-8 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${dest.borderColor}`}>
                  {/* Background Gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${dest.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  
                  <div className={`relative z-10 flex flex-col md:flex-row items-center gap-8 md:gap-10 ${!isEven ? 'md:flex-row-reverse' : ''}`}>
                    {/* Professional Image instead of Emoji */}
                    <div className="relative w-full md:w-2/5 aspect-[4/3] rounded-2xl overflow-hidden shadow-md ring-1 ring-black/5 flex-shrink-0 group-hover:shadow-lg transition-all duration-500">
                       <Image
                         src={dest.image}
                         alt={`${dest.title} study destination`}
                         fill
                         className="object-cover transition-transform duration-700 group-hover:scale-105"
                         sizes="(max-width: 768px) 100vw, 40vw"
                       />
                    </div>
                    
                    <div className={`flex-grow w-full ${!isEven ? 'md:text-right' : 'md:text-left'}`}>
                      <div className={`mb-3 inline-flex items-center text-sm font-semibold text-gray-500 ${!isEven ? 'flex-row-reverse' : ''}`}>
                         <MapPin className={`w-4 h-4 ${!isEven ? 'ml-1.5' : 'mr-1.5'}`} />
                         Destination
                      </div>
                      <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{dest.title}</h3>
                      <p className="text-gray-600 leading-relaxed text-base md:text-xl mb-8">
                        {dest.description}
                      </p>

                      <div className={`flex ${!isEven ? 'justify-end' : 'justify-start'}`}>
                        <div className={`inline-flex items-center justify-center rounded-full px-8 py-3.5 text-base font-bold transition-all duration-300 shadow-sm ${dest.buttonColor}`}>
                          <span>Explore {dest.title}</span>
                          <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

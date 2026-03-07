'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ArrowRight, Play } from 'lucide-react';

export const HeroSection: React.FC = () => {
  return (
    <section className="bg-neutral-50 py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[55%_45%] gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div>
            <div
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-6 animate-fade-up"
              style={{ animationDelay: '0ms' }}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500" />
              </span>
              Année universitaire 2025-2026
            </div>

            <h1
              className="font-display text-5xl md:text-7xl font-extrabold leading-tight text-neutral-900 mb-6 animate-fade-up"
              style={{ animationDelay: '150ms' }}
            >
              L&apos;Amicale qui{' '}
              <span className="relative inline-block text-primary-500">
                fédère
                <svg
                  className="absolute -bottom-1 left-0 w-full"
                  viewBox="0 0 200 8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden
                >
                  <path
                    d="M1 5.5C25 2 75 2 100 5.5S175 2 199 5.5"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    className="text-primary-500"
                  />
                </svg>
              </span>{' '}
              les enseignants de la Faculté de Pharmacie
            </h1>

            <p
              className="text-lg text-neutral-500 max-w-md font-body mb-8 animate-fade-up"
              style={{ animationDelay: '300ms' }}
            >
              L&apos;association des enseignants de la FPHM : congrès, journées scientifiques,
              formations continues et réseau professionnel au service de l&apos;excellence de l&apos;enseignement pharmaceutique.
            </p>

            <div
              className="flex flex-wrap gap-4 mb-12 animate-fade-up"
              style={{ animationDelay: '450ms' }}
            >
              <Link href="/register">
                <Button variant="primary" size="xl" rightIcon={<ArrowRight className="w-5 h-5" />}>
                  Devenir membre
                </Button>
              </Link>
              <Link href="/evenements">
                <Button variant="ghost" size="xl" rightIcon={<Play className="w-5 h-5" />}>
                  Voir les événements
                </Button>
              </Link>
            </div>

            {/* Stats row */}
            <div
              className="flex flex-wrap items-center gap-4 pt-8 border-t border-neutral-200 animate-fade-up"
              style={{ animationDelay: '600ms' }}
            >
              <span className="font-display text-primary-600 font-bold text-lg">
                120+ Enseignants membres
              </span>
              <span className="text-neutral-300">|</span>
              <span className="font-display text-primary-600 font-bold text-lg">
                50+ Événements
              </span>
              <span className="text-neutral-300">|</span>
              <span className="font-display text-primary-600 font-bold text-lg">
                Depuis 1974
              </span>
            </div>
          </div>

          {/* Right - Image + Floating card */}
          <div
            className="relative animate-fade-up"
            style={{ animationDelay: '200ms' }}
          >
            <div className="relative rounded-3xl overflow-hidden shadow-card-lg bg-white">
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src="/images/hero2.jpeg"
                  alt="Communauté Amicale FPHM"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  priority
                />
              </div>
              <div className="absolute bottom-4 left-4 right-4 md:right-auto md:w-64 bg-white/80 backdrop-blur-md rounded-2xl p-4 shadow-card border border-white/50">
                <p className="text-xs font-semibold text-neutral-500 mb-1">
                  Prochain événement
                </p>
                <p className="font-display font-bold text-neutral-900">
                  Gala de la Pharmacie 2026
                </p>
                <p className="text-sm text-neutral-500">15 mars 2026</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

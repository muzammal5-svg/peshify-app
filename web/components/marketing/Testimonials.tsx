"use client";

import { useTranslation } from "react-i18next";
import { MessageSquare, Quote } from "lucide-react";

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  title: string;
  court: string;
  city: string;
}

// Clean placeholders ready to be filled with verified advocate reviews post-launch
export const REAL_TESTIMONIALS: Testimonial[] = [];

export function Testimonials({ reviews = REAL_TESTIMONIALS }: { reviews?: Testimonial[] }) {
  const { t } = useTranslation();

  // Hidden until verified reviews are collected from active Pakistani advocates
  if (!reviews || reviews.length === 0) {
    return null;
  }

  return (
    <section className="py-20 md:py-32 border-t border-border/80 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-primary">
            Advocate Experiences
          </span>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            What Counsel Say About Peshify
          </h2>
          <p className="text-sm md:text-base text-muted-foreground">
            Verified feedback from advocates and chambers practicing across Pakistani High Courts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="p-6 rounded-2xl bg-card border border-border/80 shadow-xs flex flex-col justify-between"
            >
              <div className="space-y-4">
                <Quote className="w-6 h-6 text-primary opacity-60" />
                <p className="text-sm text-foreground/90 italic leading-relaxed">
                  &ldquo;{rev.quote}&rdquo;
                </p>
              </div>

              <div className="pt-6 border-t border-border/60 mt-6">
                <p className="font-semibold text-foreground text-sm">{rev.author}</p>
                <p className="text-xs text-muted-foreground">{rev.title} • {rev.court}</p>
                <p className="text-[11px] text-primary">{rev.city}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

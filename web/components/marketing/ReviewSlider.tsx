"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  Star,
  ChevronLeft,
  ChevronRight,
  Quote,
  ShieldCheck,
  Pause,
  Play,
  MapPin,
  Building2,
} from "lucide-react";
import { REVIEWS, type Review } from "@/lib/reviews";
import { cn } from "@/lib/utils";

interface ReviewSliderProps {
  reviews?: Review[];
  className?: string;
}

export function ReviewSlider({
  reviews = REVIEWS,
  className,
}: ReviewSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isAutoPlayEnabled, setIsAutoPlayEnabled] = useState(true);
  const [cardsPerView, setCardsPerView] = useState(1);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Responsive cards-per-view calculation
  useEffect(() => {
    function handleResize() {
      if (typeof window === "undefined") return;
      if (window.innerWidth >= 1024) {
        setCardsPerView(3);
      } else if (window.innerWidth >= 640) {
        setCardsPerView(2);
      } else {
        setCardsPerView(1);
      }
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const totalReviews = reviews.length;
  const maxIndex = Math.max(0, totalReviews - cardsPerView);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  }, [maxIndex]);

  // Autoplay timer (5 seconds)
  useEffect(() => {
    if (!isAutoPlayEnabled || isPaused) return;
    const interval = setInterval(() => {
      handleNext();
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlayEnabled, isPaused, handleNext]);

  // Touch swipe support for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;
    if (distance > minSwipeDistance) {
      handleNext();
    } else if (distance < -minSwipeDistance) {
      handlePrev();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  // Ensure currentIndex stays within bounds when resizing
  useEffect(() => {
    if (currentIndex > maxIndex) {
      setCurrentIndex(maxIndex);
    }
  }, [cardsPerView, maxIndex, currentIndex]);

  return (
    <div
      className={cn("relative w-full select-none", className)}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Slider Controls Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1 rounded-none bg-white/[0.04] border border-[rgba(237,232,224,0.15)] text-[#EDE8E0] text-[11px] font-bold uppercase tracking-[0.1em]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#6B8F71] animate-pulse" />
            <span>Verified Advocate Testimonials</span>
          </div>
          <span className="text-xs text-[#5C5852] font-mono">
            {currentIndex + 1} / {totalReviews}
          </span>
        </div>

        {/* Buttons & Indicators */}
        <div className="flex items-center gap-2">
          {/* Play/Pause Toggle */}
          <button
            type="button"
            onClick={() => setIsAutoPlayEnabled((v) => !v)}
            aria-label={isAutoPlayEnabled ? "Pause autoplay" : "Start autoplay"}
            className="p-2 rounded-none bg-transparent hover:bg-white/[0.06] text-[#9A958C] hover:text-[#EDE8E0] transition-colors border border-[rgba(237,232,224,0.12)]"
            title={isAutoPlayEnabled ? "Pause autoplay" : "Start autoplay"}
          >
            {isAutoPlayEnabled ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4" />
            )}
          </button>

          {/* Previous Button */}
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous review"
            className="p-2.5 rounded-none bg-transparent hover:bg-[#EDE8E0] text-[#EDE8E0] hover:text-[#050505] border border-[rgba(237,232,224,0.22)] transition-colors active:scale-95"
          >
            <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
          </button>

          {/* Next Button */}
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next review"
            className="p-2.5 rounded-none bg-transparent hover:bg-[#EDE8E0] text-[#EDE8E0] hover:text-[#050505] border border-[rgba(237,232,224,0.22)] transition-colors active:scale-95"
          >
            <ChevronRight className="w-4 h-4 rtl:rotate-180" />
          </button>
        </div>
      </div>

      {/* Carousel Track Container */}
      <div className="overflow-hidden rounded-none py-2">
        <div
          className="flex transition-transform duration-500 ease-out gap-6"
          style={{
            transform: `translateX(-${
              currentIndex * (100 / cardsPerView)
            }%)`,
          }}
        >
          {reviews.map((review, idx) => {
            const isFeatured = idx === currentIndex;
            return (
              <div
                key={idx}
                className="flex-shrink-0"
                style={{
                  width: `calc(${100 / cardsPerView}% - ${
                    ((cardsPerView - 1) * 24) / cardsPerView
                  }px)`,
                }}
              >
                <div
                  className={cn(
                    "h-full flex flex-col justify-between bg-[#111111] border rounded-none p-6 sm:p-7 transition-all duration-300 relative group overflow-hidden",
                    isFeatured
                      ? "border-[rgba(237,232,224,0.28)]"
                      : "border-[rgba(237,232,224,0.12)] hover:border-[rgba(237,232,224,0.22)] hover:bg-[#161616]"
                  )}
                >
                  {/* Top Bar: Stars + Tag & Quote Icon */}
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-4">
                      {/* Star Rating */}
                      <div className="flex items-center gap-1">
                        {Array.from({ length: review.stars }).map((_, i) => (
                          <Star
                            key={i}
                            className="w-3.5 h-3.5 text-[#EDE8E0] fill-[#EDE8E0]"
                          />
                        ))}
                      </div>

                      {/* Tag pill */}
                      {review.tag && (
                        <span className="text-[10px] font-bold uppercase tracking-[0.1em] px-2 py-0.5 rounded-none bg-white/[0.04] text-[#EDE8E0] border border-[rgba(237,232,224,0.15)] whitespace-nowrap">
                          {review.tag}
                        </span>
                      )}
                    </div>

                    {/* Quotation text */}
                    <div className="relative mb-6">
                      <p className="text-[#9A958C] text-sm sm:text-[14px] leading-relaxed relative z-10 italic">
                        &ldquo;{review.quote}&rdquo;
                      </p>
                    </div>
                  </div>

                  {/* Bottom: Author & Chamber details */}
                  <div className="pt-4 border-t border-[rgba(237,232,224,0.10)] flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Avatar Initials */}
                      <div className="w-9 h-9 rounded-none bg-[#1A1A1A] border border-[rgba(237,232,224,0.20)] flex items-center justify-center text-xs font-bold text-[#EDE8E0] flex-shrink-0">
                        {review.initials}
                      </div>

                      {/* Name & Title */}
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="text-[#EDE8E0] font-semibold text-sm truncate">
                            {review.name}
                          </p>
                          <span title="Verified Advocate" className="inline-flex">
                            <ShieldCheck
                              className="w-3.5 h-3.5 text-[#6B8F71] flex-shrink-0"
                              aria-label="Verified Advocate"
                            />
                          </span>
                        </div>
                        <p className="text-[#5C5852] text-xs truncate">
                          {review.role} &bull; {review.firm}
                        </p>
                      </div>
                    </div>

                    {/* Location Badge */}
                    {(review.location || review.court) && (
                      <div className="hidden xl:flex items-center gap-1 text-[11px] text-[#5C5852] bg-white/[0.02] px-2 py-0.5 rounded-none border border-[rgba(237,232,224,0.08)] shrink-0">
                        <MapPin className="w-3 h-3 text-[#9A958C]" />
                        <span>{review.location || review.court}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pagination Dash Indicators */}
      <div className="flex items-center justify-center gap-2 mt-8">
        {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setCurrentIndex(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            className={cn(
              "h-1 rounded-none transition-all duration-300",
              currentIndex === idx
                ? "w-8 bg-[#EDE8E0]"
                : "w-3 bg-white/20 hover:bg-white/40"
            )}
          />
        ))}
      </div>
    </div>
  );
}

"use client";

import { MessageSquare } from "lucide-react";
import { whatsappLink } from "@/lib/siteConfig";

export function FloatingWhatsApp() {
  return (
    <aside
      aria-label="Contact Chamber Support via WhatsApp"
      className="fixed bottom-20 end-4 md:bottom-6 md:end-6 z-30 animate-float-subtle"
    >
      <a
        href={whatsappLink("Hello, I would like to learn more about DiaryLex Case Management for my legal practice.")}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="group relative flex items-center gap-2.5 px-3 py-2.5 rounded-full bg-[#1F7A4D] hover:bg-[#1A6640] text-white shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 pulse-ring-emerald"
      >
        <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
          <MessageSquare className="w-4 h-4 fill-white" strokeWidth={1.5} />
        </div>
        <span className="hidden sm:inline-block text-xs font-semibold tracking-wide pe-1">
          WhatsApp Support
        </span>
      </a>
    </aside>
  );
}

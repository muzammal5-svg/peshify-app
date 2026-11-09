"use client";

import { MessageSquare } from "lucide-react";
import { whatsappLink } from "@/lib/siteConfig";

export function FloatingWhatsApp() {
  return (
    <aside
      aria-label="Contact Chamber Support via WhatsApp"
      className="fixed bottom-20 end-4 md:bottom-6 md:end-6 z-30"
    >
      <a
        href={whatsappLink("Assalam-o-Alaikum, I want to learn more about Peshify Case Management for my legal practice.")}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="group flex items-center gap-2.5 px-3 py-2.5 rounded-full bg-[#1F7A4D] hover:bg-[#1A6640] text-white shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
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

"use client";

import { Sparkles, CalendarDays, Smartphone, Globe, Shield, MessageCircle } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";

interface WhatsNewModalProps {
  open: boolean;
  onClose: () => void;
}

export function WhatsNewModal({ open, onClose }: WhatsNewModalProps) {
  const updates = [
    {
      icon: CalendarDays,
      title: "Executive Cause List & Hearing Diary",
      desc: "Instant morning cause list hero widget with status badges (Running, Pending, Adjourned, Decided), 7-day upcoming hearings, and limitation alerts.",
      tag: "Dashboard",
    },
    {
      icon: Smartphone,
      title: "Mobile-First App Shell & Bottom Sheets",
      desc: "Designed for on-the-go advocates with a 5-tab bottom navigation bar, min 44px tap targets, and slide-up bottom sheets replacing desktop modals.",
      tag: "Mobile",
    },
    {
      icon: Globe,
      title: "Native Urdu (Nastaliq RTL) Support",
      desc: "Seamless one-tap language switching with mirror layouts, right-to-left alignment, and specialized Pakistani court terminology.",
      tag: "Localization",
    },
    {
      icon: MessageCircle,
      title: "Direct WhatsApp Client Notices",
      desc: "Send formatted next hearing date alerts and case status updates directly to clients via WhatsApp in one tap.",
      tag: "Client Alerts",
    },
    {
      icon: Shield,
      title: "Bank-Grade Encryption & Chamber RLS",
      desc: "Row-Level Security (RLS) guarantees absolute chamber privacy. Your client files, orders, and diary remain strictly yours.",
      tag: "Security",
    },
  ];

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="What's New in Peshify v2.1"
      size="md"
    >
      <div className="space-y-4 pt-1">
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-primary/10 border border-primary/20 text-xs text-primary font-medium">
          <Sparkles className="w-4 h-4 shrink-0 text-amber-500" strokeWidth={1.75} />
          <span>Production Launch Edition &bull; Built exclusively for Pakistani advocates</span>
        </div>

        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
          {updates.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="flex items-start gap-3 p-3 rounded-xl bg-secondary/40 border border-border/80 hover:border-border transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                  <Icon className="w-4 h-4" strokeWidth={1.75} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-xs font-semibold text-foreground">{item.title}</h4>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary border border-border text-muted-foreground font-medium shrink-0">
                      {item.tag}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-snug mt-1">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-3 border-t border-border flex justify-end">
          <Button onClick={onClose} className="min-h-[44px] px-6">
            Got It
          </Button>
        </div>
      </div>
    </Modal>
  );
}

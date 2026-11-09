"use client";

import { useState } from "react";
import { MessageSquarePlus, Send, CheckCircle2, Sparkles, Bug, Lightbulb, Scale } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";

interface FeedbackModalProps {
  open: boolean;
  onClose: () => void;
}

export function FeedbackModal({ open, onClose }: FeedbackModalProps) {
  const [category, setCategory] = useState<"bug" | "feature" | "court" | "other">("feature");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const categories = [
    { id: "feature" as const, label: "Feature Request", icon: Lightbulb },
    { id: "court" as const, label: "Court / Legal Suggestion", icon: Scale },
    { id: "bug" as const, label: "Issue / Bug", icon: Bug },
    { id: "other" as const, label: "Other Feedback", icon: Sparkles },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setLoading(true);
    // Persist to localStorage or mock dispatch
    try {
      const existing = JSON.parse(localStorage.getItem("peshify_feedback") || "[]");
      existing.push({
        category,
        message,
        timestamp: new Date().toISOString(),
      });
      localStorage.setItem("peshify_feedback", JSON.stringify(existing));
    } catch {}

    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setMessage("");
        onClose();
      }, 1800);
    }, 400);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Chamber Feedback & Suggestions"
      size="md"
    >
      {submitted ? (
        <div className="py-8 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-emerald-500/15 text-emerald-500 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" strokeWidth={2} />
          </div>
          <h3 className="text-base font-semibold text-foreground">Thank You for Your Feedback!</h3>
          <p className="text-xs text-muted-foreground max-w-xs mx-auto">
            Your suggestion helps us refine Peshify for Pakistani advocates across all courts.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          <div>
            <label className="block text-xs font-medium text-foreground mb-2">
              Feedback Category
            </label>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((cat) => {
                const Icon = cat.icon;
                const isSelected = category === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-medium text-start transition-all min-h-[44px] ${
                      isSelected
                        ? "bg-primary/10 border-primary text-primary font-semibold"
                        : "bg-secondary/50 border-border text-muted-foreground hover:text-foreground hover:bg-secondary"
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" strokeWidth={1.75} />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label htmlFor="feedback-text" className="block text-xs font-medium text-foreground mb-1.5">
              Your Message or Suggestion
            </label>
            <textarea
              id="feedback-text"
              rows={4}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell us what you'd like to see, report an issue, or suggest courtroom workflow improvements..."
              className="w-full bg-secondary/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary rounded-xl text-sm p-3 outline-none text-foreground placeholder:text-muted-foreground"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={loading}
              className="min-h-[44px]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || !message.trim()}
              loading={loading}
              className="min-h-[44px] px-5"
              leftIcon={<Send className="w-4 h-4" strokeWidth={1.75} />}
            >
              Send Feedback
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}

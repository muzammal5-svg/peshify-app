"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Briefcase,
  User,
  X,
  ArrowRight,
  ExternalLink,
  Building,
  Phone,
  Command,
} from "lucide-react";
import { useGlobalSearch } from "@/hooks/useGlobalSearch";

interface GlobalSearchModalProps {
  open: boolean;
  onClose: () => void;
}

export function GlobalSearchModal({ open, onClose }: GlobalSearchModalProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const { results, isLoading, debouncedQuery } = useGlobalSearch(query);

  // Focus input on open
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
    }
  }, [open]);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const handleSelectCase = (id: string) => {
    onClose();
    router.push(`/cases/view?id=${id}`);
  };

  const handleSelectClient = (id: string) => {
    onClose();
    router.push(`/clients/view?id=${id}`);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-start justify-center pt-14 md:pt-20 px-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-card border border-border shadow-2xl rounded-2xl overflow-hidden flex flex-col max-h-[80vh] text-foreground animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top search input header */}
        <div className="relative flex items-center px-4 py-3.5 border-b border-border bg-card">
          <Search className="w-5 h-5 text-muted-foreground flex-shrink-0 me-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search cases, clients, phone numbers or parties..."
            className="flex-1 bg-transparent text-base text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          {query ? (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                inputRef.current?.focus();
              }}
              className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono font-medium text-muted-foreground bg-secondary border border-border rounded">
              ESC
            </kbd>
          )}
        </div>

        {/* Results Container */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4">
          {isLoading && (
            <div className="py-8 flex flex-col items-center justify-center gap-2 text-sm text-muted-foreground">
              <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <span>Searching legal records...</span>
            </div>
          )}

          {!isLoading && query.trim().length < 2 && (
            <div className="py-10 text-center text-sm text-muted-foreground">
              <Command className="w-8 h-8 mx-auto mb-2 opacity-40 text-muted-foreground" />
              <p>Type at least 2 characters to search across cases and clients.</p>
              <p className="text-xs text-muted-foreground/70 mt-1">
                Tip: Press <kbd className="px-1.5 py-0.5 rounded bg-secondary text-[11px]">⌘K</kbd> or <kbd className="px-1.5 py-0.5 rounded bg-secondary text-[11px]">Ctrl+K</kbd> anytime to open this search.
              </p>
            </div>
          )}

          {!isLoading && query.trim().length >= 2 && results.totalCount === 0 && (
            <div className="py-10 text-center text-sm text-muted-foreground">
              <p>No matching cases or clients found for &ldquo;{debouncedQuery}&rdquo;</p>
              <p className="text-xs text-muted-foreground/70 mt-1">
                Check for typos or try searching by client name or case reference.
              </p>
            </div>
          )}

          {/* Cases Results */}
          {!isLoading && results.cases.length > 0 && (
            <div>
              <div className="flex items-center justify-between px-2 mb-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-primary" />
                  <span>Cases ({results.cases.length})</span>
                </span>
              </div>
              <div className="space-y-1">
                {results.cases.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => handleSelectCase(c.id)}
                    className="w-full text-start flex items-center justify-between p-2.5 rounded-xl hover:bg-secondary/80 border border-transparent hover:border-border/60 transition-colors group"
                  >
                    <div className="min-w-0 flex-1 me-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-semibold text-primary font-mono">
                          {c.case_ref_no}
                        </span>
                        <span
                          className={`text-[10px] px-1.5 py-0.2 rounded-full font-medium ${
                            c.status === "running"
                              ? "bg-amber-400/10 text-amber-500 border border-amber-400/20"
                              : "bg-emerald-400/10 text-emerald-500 border border-emerald-400/20"
                          }`}
                        >
                          {c.status}
                        </span>
                        {c.court_no && (
                          <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                            <Building className="w-3 h-3 text-muted-foreground/70" />
                            Court {c.court_no}
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-medium text-foreground truncate mt-0.5">
                        {c.plaintiff_name} <span className="text-muted-foreground text-xs font-normal">vs</span> {c.defendant_name}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 rtl:rotate-180" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Clients Results */}
          {!isLoading && results.clients.length > 0 && (
            <div>
              <div className="flex items-center justify-between px-2 mb-1.5 pt-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Clients ({results.clients.length})</span>
                </span>
              </div>
              <div className="space-y-1">
                {results.clients.map((cl) => (
                  <button
                    key={cl.id}
                    type="button"
                    onClick={() => handleSelectClient(cl.id)}
                    className="w-full text-start flex items-center justify-between p-2.5 rounded-xl hover:bg-secondary/80 border border-transparent hover:border-border/60 transition-colors group"
                  >
                    <div className="min-w-0 flex-1 me-3">
                      <p className="text-sm font-semibold text-foreground truncate">
                        {cl.full_name}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                        {cl.phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {cl.phone}
                          </span>
                        )}
                        {cl.city && <span>{cl.city}</span>}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-emerald-500 transition-colors flex-shrink-0 rtl:rotate-180" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2.5 bg-secondary/40 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground">
          <span>Global Search (Cases & Clients)</span>
          <div className="flex items-center gap-2">
            <span>Press</span>
            <kbd className="px-1.5 py-0.5 rounded bg-card border border-border text-[10px] font-mono">
              ESC
            </kbd>
            <span>to exit</span>
          </div>
        </div>
      </div>
    </div>
  );
}

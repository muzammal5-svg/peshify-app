"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Phone, CreditCard, Briefcase, ChevronRight, Mail, MapPin } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { cn, isUrdu, textDir } from "@/lib/utils";
import { formatPhoneDisplay } from "@/lib/phone";
import type { Client } from "@/types/supabase";

interface ClientCardProps {
  client: Client;
  caseCount?: number;
  className?: string;
}

export function ClientCard({ client, caseCount, className }: ClientCardProps) {
  const { t } = useTranslation();

  return (
    <Link href={`/clients/view?id=${client.id}`} className="block group">
      <Card
        hover
        className={cn(
          "flex items-center gap-3 p-3.5 sm:p-4 rounded-xl border-border/80 hover:border-primary/40 transition-all",
          className
        )}
      >
        {/* Avatar */}
        <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
          <span
            className={cn(
              "font-bold text-primary leading-none text-base",
              isUrdu(client.full_name) ? "font-urdu" : ""
            )}
          >
            {client.full_name.charAt(0).toUpperCase()}
          </span>
        </div>

        {/* Info Column */}
        <div className="flex-1 min-w-0">
          <p
            className="font-semibold text-foreground group-hover:text-primary transition-colors truncate text-sm leading-snug"
            dir={textDir(client.full_name)}
            lang={isUrdu(client.full_name) ? "ur" : "en"}
          >
            {client.full_name}
          </p>

          {/* Contact tags with wrap protection */}
          <div className="flex items-center gap-2 mt-1 flex-wrap text-xs text-muted-foreground">
            {client.phone && (
              <span className="inline-flex items-center gap-1 font-medium truncate max-w-full">
                <Phone className="w-3 h-3 text-muted-foreground shrink-0" strokeWidth={1.75} />
                <span className="truncate">{formatPhoneDisplay(client.phone)}</span>
              </span>
            )}
            {client.email && (
              <span className="inline-flex items-center gap-1 min-w-0 max-w-[150px] xs:max-w-[190px] sm:max-w-[260px] text-muted-foreground/90">
                <Mail className="w-3 h-3 text-muted-foreground shrink-0" strokeWidth={1.75} />
                <span className="truncate">{client.email}</span>
              </span>
            )}
            {client.cnic && (
              <span className="inline-flex items-center gap-1 font-mono text-[11px] truncate">
                <CreditCard className="w-3 h-3 text-muted-foreground shrink-0" strokeWidth={1.75} />
                <span className="truncate">{client.cnic}</span>
              </span>
            )}
          </div>

          {client.city && (
            <p className="text-[11px] text-muted-foreground mt-0.5 truncate flex items-center gap-1">
              <MapPin className="w-3 h-3 text-muted-foreground shrink-0" strokeWidth={1.75} />
              <span className="truncate">{client.city}</span>
            </p>
          )}
        </div>

        {/* Right side indicators */}
        <div className="flex flex-col items-end gap-1.5 flex-shrink-0 ms-1">
          {!client.is_active && (
            <Badge variant="neutral" size="sm">{t("common.deactivate")}</Badge>
          )}
          {caseCount !== undefined && caseCount > 0 && (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary px-2 py-0.5 rounded-md bg-primary/10">
              <Briefcase className="w-3 h-3" strokeWidth={1.75} />
              <span>{caseCount}</span>
            </span>
          )}
          <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors rtl:rotate-180" strokeWidth={1.75} />
        </div>
      </Card>
    </Link>
  );
}

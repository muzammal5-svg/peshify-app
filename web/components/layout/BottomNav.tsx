"use client";

import Link               from "next/link";
import { usePathname }    from "next/navigation";
import { useTranslation } from "react-i18next";
import {
  Home, Calendar, Briefcase, Users, MoreHorizontal, type LucideIcon,
} from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import { cn }      from "@/lib/utils";
import { BOTTOM_NAV } from "./navItems";

const ICON_MAP: Record<string, LucideIcon | React.ComponentType<any>> = {
  Home, Calendar, Briefcase, Users, MoreHorizontal,
};

export function BottomNav() {
  const { t }                   = useTranslation();
  const pathname                = usePathname();
  const { unreadCount, reminderCount } = useAuth();

  return (
    <nav
      className="md:hidden fixed bottom-0 start-0 end-0 z-30 bg-card/95 backdrop-blur-xl border-t border-border/80 shadow-lg"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      aria-label={t("nav.home")}
    >
      <div className="flex items-stretch justify-around px-1">
        {BOTTOM_NAV.map((item) => {
          const Icon     = ICON_MAP[item.icon];
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          const badge =
            item.key === "more" ? unreadCount :
            item.key === "reminders" ? reminderCount : 0;

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex-1 flex flex-col items-center justify-center gap-1",
                "min-h-[56px] py-1.5 px-1 text-[11px] font-medium transition-colors relative select-none",
                isActive ? "text-primary font-semibold" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {isActive && (
                <span
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-b-full bg-primary shadow-xs"
                  aria-hidden="true"
                />
              )}
              <span className="relative flex items-center justify-center">
                {Icon && (
                  <Icon
                    className={cn(
                      "w-5 h-5 transition-transform duration-150",
                      isActive && "scale-110 text-primary"
                    )}
                    strokeWidth={1.75}
                  />
                )}
                {badge > 0 && (
                  <span
                    aria-hidden="true"
                    className="absolute -top-1 -end-2 min-w-[15px] h-3.5 px-0.5 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center leading-none"
                  >
                    {badge > 9 ? "9+" : badge}
                  </span>
                )}
              </span>
              <span className="leading-tight truncate max-w-[62px] text-center text-[10px]">
                {t(`nav.${item.key}`)}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

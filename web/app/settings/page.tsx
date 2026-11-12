"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import {
  User,
  Users,
  Globe,
  Info,
  ChevronRight,
  Scale,
  Tag,
  Shield,
  BellRing,
  AlertTriangle,
  Trash2,
  Palette,
  Sun,
  Moon,
  Laptop,
  Check,
} from "lucide-react";

import { AppShell } from "@/components/layout/AppShell";
import { RouteGuard } from "@/components/shared/RouteGuard";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { toast } from "@/components/ui/Toast";
import { LangSwitcher } from "@/components/shared/LangSwitcher";
import { useRoleGuard } from "@/hooks/useRoleGuard";
import { useAuth } from "@/providers/AuthProvider";
import { useTheme } from "@/providers/ThemeProvider";
import { saasRpc } from "@/lib/supabase/saas";
import { cn } from "@/lib/utils";

function SettingsPage() {
  const { t } = useTranslation();
  const { can, isAdminOrAbove } = useRoleGuard();
  const { signOut } = useAuth();
  const { mode, setMode, accent, setAccent, accents } = useTheme();
  const router = useRouter();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteInput, setDeleteInput] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    if (deleteInput !== "DELETE") return;
    setIsDeleting(true);
    try {
      const { error } = await saasRpc.deleteOwnAccount();
      if (error) throw error;
      toast.success(t("settings.deleteSuccess"));
      await signOut();
      router.replace("/");
    } catch (err: any) {
      toast.error(err.message || t("common.error"));
      setIsDeleting(false);
    }
  };

  return (
    <AppShell pageTitle={t("settings.title")} showBack>
      <div className="max-w-xl mx-auto space-y-5">
        {/* Account */}
        <section>
          <p className="text-xs font-semibold uppercase tracking-wider text-navy-500 mb-2 px-1">
            {t("settings.account")}
          </p>
          <Card padding="none" className="divide-y divide-border">
            <Link
              href="/profile"
              className="flex items-center gap-3 px-4 py-3.5 hover:bg-white/[0.04] transition-colors group"
            >
              <User className="w-4 h-4 text-navy-400 group-hover:text-gold transition-colors" />
              <span className="flex-1 text-sm font-semibold text-navy">{t("profile.title")}</span>
              <ChevronRight className="w-4 h-4 text-navy-400 group-hover:text-gold transition-colors" />
            </Link>
            <Link
              href="/settings/notifications"
              className="flex items-center gap-3 px-4 py-3.5 hover:bg-white/[0.04] transition-colors group"
            >
              <BellRing className="w-4 h-4 text-navy-400 group-hover:text-gold transition-colors" />
              <span className="flex-1 text-sm font-semibold text-navy">
                {t("settings.notificationPreferences")}
              </span>
              <ChevronRight className="w-4 h-4 text-navy-400 group-hover:text-gold transition-colors" />
            </Link>
          </Card>
        </section>

        {/* Appearance & Color Theme */}
        <section>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 px-1 flex items-center gap-1.5">
            <Palette className="w-3.5 h-3.5 text-primary" /> Appearance & Theme
          </p>
          <Card className="space-y-4">
            {/* Mode selection */}
            <div>
              <label className="text-xs font-semibold text-foreground block mb-2">
                Interface Mode
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(
                  [
                    { id: "light", label: "Light", Icon: Sun },
                    { id: "dark", label: "Dark", Icon: Moon },
                    { id: "system", label: "Auto", Icon: Laptop },
                  ] as const
                ).map(({ id, label, Icon }) => {
                  const isActive = mode === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setMode(id)}
                      className={cn(
                        "flex items-center justify-center gap-2 py-2 px-3 rounded-lg border text-xs font-medium transition-all duration-150",
                        isActive
                          ? "bg-primary text-primary-foreground border-primary shadow-xs font-semibold"
                          : "bg-secondary/60 text-muted-foreground border-border/80 hover:bg-secondary hover:text-foreground"
                      )}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Accent Presets */}
            <div className="pt-3 border-t border-border/80">
              <label className="text-xs font-semibold text-foreground block mb-2">
                Brand Accent Color
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {accents.map((item) => {
                  const isSelected = accent === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setAccent(item.id)}
                      className={cn(
                        "flex items-center gap-2.5 p-2 rounded-lg border transition-all duration-150 text-start",
                        isSelected
                          ? "border-primary bg-primary/10 shadow-xs"
                          : "border-border/80 bg-secondary/50 hover:border-border hover:bg-secondary"
                      )}
                    >
                      <span
                        className="w-4.5 h-4.5 rounded-full flex items-center justify-center flex-shrink-0 shadow-xs"
                        style={{ backgroundColor: item.hex }}
                      >
                        {isSelected && <Check className="w-3 h-3 text-white stroke-[3]" />}
                      </span>
                      <span className="text-xs font-medium text-foreground truncate">
                        {item.name.split(" ")[1] || item.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </Card>
        </section>

        {/* Language */}
        <section>
          <p className="text-xs font-semibold uppercase tracking-wider text-navy-500 mb-2 px-1 flex items-center gap-1">
            <Globe className="w-3.5 h-3.5 text-navy-400" /> {t("settings.language")}
          </p>
          <LangSwitcher />
        </section>

        {/* Admin config */}
        {can("settings:admin_config") && (
          <section>
            <p className="text-xs font-semibold uppercase tracking-wider text-navy-500 mb-2 px-1 flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-gold" /> {t("settings.adminConfig")}
            </p>
            <Card padding="none" className="divide-y divide-border">
              <Link
                href="/settings/members"
                className="flex items-center gap-3 px-4 py-3.5 hover:bg-white/[0.04] transition-colors group"
              >
                <Users className="w-4 h-4 text-navy-400 group-hover:text-gold transition-colors" />
                <span className="flex-1 text-sm font-semibold text-navy">Chamber Members & Munshi</span>
                <ChevronRight className="w-4 h-4 text-navy-400 group-hover:text-gold transition-colors" />
              </Link>
              <Link
                href="/settings/case-types"
                className="flex items-center gap-3 px-4 py-3.5 hover:bg-white/[0.04] transition-colors group"
              >
                <Tag className="w-4 h-4 text-navy-400 group-hover:text-gold transition-colors" />
                <span className="flex-1 text-sm font-semibold text-navy">{t("common.caseTypes")}</span>
                <ChevronRight className="w-4 h-4 text-navy-400 group-hover:text-gold transition-colors" />
              </Link>
              <Link
                href="/settings/courts"
                className="flex items-center gap-3 px-4 py-3.5 hover:bg-white/[0.04] transition-colors group"
              >
                <Scale className="w-4 h-4 text-navy-400 group-hover:text-gold transition-colors" />
                <span className="flex-1 text-sm font-semibold text-navy">{t("common.courts")}</span>
                <ChevronRight className="w-4 h-4 text-navy-400 group-hover:text-gold transition-colors" />
              </Link>
            </Card>
          </section>
        )}

        {/* About */}
        <section>
          <p className="text-xs font-semibold uppercase tracking-wider text-navy-500 mb-2 px-1 flex items-center gap-1">
            <Info className="w-3.5 h-3.5 text-navy-400" /> {t("settings.about")}
          </p>
          <Card>
            <p className="text-sm text-navy font-semibold">Peshify</p>
            <p className="text-xs text-navy-500 mt-0.5">Case Management System v1.0.0</p>
            <p className="text-xs text-navy-400 mt-2">Next.js 14 · Supabase · Capacitor</p>
          </Card>
        </section>

        {/* Danger Zone: Google Play Account Deletion */}
        <section className="pt-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-danger mb-2 px-1 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5" /> {t("settings.dangerZone")}
          </p>
          <Card className="border border-danger/30 bg-danger/5 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-danger">{t("settings.deleteAccount")}</p>
              <p className="text-xs text-muted mt-0.5">{t("settings.deleteAccountDesc")}</p>
            </div>
            <Button
              variant="danger"
              size="sm"
              onClick={() => setShowDeleteModal(true)}
              className="text-xs shrink-0"
            >
              <Trash2 className="w-3.5 h-3.5 me-1" />
              {t("settings.deleteAccount")}
            </Button>
          </Card>
        </section>
      </div>

      {/* Account Deletion Confirmation Modal */}
      {showDeleteModal && (
        <Modal
          open={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setDeleteInput("");
          }}
          title={t("settings.deleteConfirmTitle")}
        >
          <div className="space-y-4">
            <p className="text-xs text-muted leading-relaxed">
              {t("settings.deleteConfirmWarning")}
            </p>
            <Input
              label={t("settings.deleteConfirmPrompt")}
              value={deleteInput}
              onChange={(e) => setDeleteInput(e.target.value)}
              placeholder="DELETE"
              required
            />
            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="secondary"
                type="button"
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteInput("");
                }}
              >
                {t("common.cancel")}
              </Button>
              <Button
                variant="danger"
                disabled={deleteInput !== "DELETE" || isDeleting}
                onClick={handleDeleteAccount}
              >
                {isDeleting ? t("common.loading") : t("settings.deleteButton")}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </AppShell>
  );
}

export default function SettingsRoute() {
  return (
    <RouteGuard>
      <SettingsPage />
    </RouteGuard>
  );
}

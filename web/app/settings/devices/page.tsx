"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Laptop,
  Smartphone,
  Shield,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
} from "lucide-react";

import { AppShell } from "@/components/layout/AppShell";
import { RouteGuard } from "@/components/shared/RouteGuard";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/Modal";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { QueryErrorState } from "@/components/ui/QueryErrorState";
import { useToast } from "@/components/ui/Toast";
import { useMyDevices, useRevokeDevice } from "@/hooks/useDevices";
import { useAuth } from "@/providers/AuthProvider";
import { fmtDate } from "@/lib/utils";
import type { UserDeviceRecord } from "@/types/devices";

function MyDevicesPage() {
  const { t } = useTranslation();
  const toast = useToast();
  const { currentDeviceId } = useAuth();
  const { data: devices, isLoading, isError, refetch } = useMyDevices();
  const revokeMutation = useRevokeDevice();

  const [deviceToRevoke, setDeviceToRevoke] = useState<UserDeviceRecord | null>(null);

  const localStoredId =
    currentDeviceId ||
    (typeof window !== "undefined"
      ? localStorage.getItem("peshify_current_device_id")
      : null);

  async function handleConfirmRevoke() {
    if (!deviceToRevoke) return;
    try {
      await revokeMutation.mutateAsync(deviceToRevoke.id);
      toast.success(
        "Device successfully revoked",
        `${deviceToRevoke.device_name} has been signed out.`
      );
    } catch (err: any) {
      toast.error(
        "Error",
        err?.message || "Failed to revoke device"
      );
    } finally {
      setDeviceToRevoke(null);
    }
  }

  function getDeviceIcon(type: string) {
    if (type === "android" || type === "ios") {
      return <Smartphone className="w-5 h-5 text-primary flex-shrink-0" />;
    }
    return <Laptop className="w-5 h-5 text-primary flex-shrink-0" />;
  }

  return (
    <AppShell
      pageTitle="My Devices"
      showBack
    >
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Information Banner */}
        <Card className="p-4 bg-primary/5 border border-primary/20">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/25 flex items-center justify-center flex-shrink-0 text-primary mt-0.5">
              <Shield className="w-5 h-5" strokeWidth={1.75} />
            </div>
            <div className="text-xs sm:text-sm space-y-1">
              <p className="font-bold text-foreground">
                Device Security &amp; Concurrency Limit
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Your account is permitted up to 3 active sessions concurrently. Inactive devices not seen for 30 days automatically expire.
              </p>
            </div>
          </div>
        </Card>

        {/* Device List Section */}
        <section className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Active Logged-In Devices ({devices?.length ?? 0}/3)
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => void refetch()}
              leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
              className="text-xs text-muted-foreground hover:text-foreground h-8"
            >
              Refresh
            </Button>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : isError ? (
            <QueryErrorState onRetry={() => void refetch()} />
          ) : !devices?.length ? (
            <EmptyState
              icon={Laptop}
              title="No active devices recorded"
              description="Refresh the page to sync current session status."
            />
          ) : (
            <div className="space-y-3">
              {devices.map((d) => {
                const isCurrent =
                  d.id === localStoredId || (devices.length === 1 && !localStoredId);

                return (
                  <Card
                    key={d.id}
                    className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 transition-all ${
                      isCurrent
                        ? "border-primary/40 bg-primary/[0.03] shadow-xs"
                        : "border-border/80 bg-card hover:border-border"
                    }`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div
                        className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          isCurrent
                            ? "bg-primary/15 text-primary border border-primary/30"
                            : "bg-secondary text-muted-foreground border border-border/80"
                        }`}
                      >
                        {getDeviceIcon(d.device_type)}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-bold text-foreground truncate">
                            {d.device_name || "Device"}
                          </p>
                          {isCurrent && (
                            <Badge variant="success" size="sm" dot>
                              This Device
                            </Badge>
                          )}
                        </div>

                        <p className="text-xs text-muted-foreground mt-0.5">
                          Last seen:{" "}
                          <span className="font-medium text-foreground">
                            {fmtDate(d.last_seen_at)}
                          </span>
                          {" · "}
                          <span className="capitalize">{d.device_type}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-end sm:justify-start flex-shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/60">
                      {isCurrent ? (
                        <span className="text-xs text-emerald-500 font-semibold flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Current Session</span>
                        </span>
                      ) : (
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => setDeviceToRevoke(d)}
                          leftIcon={<Trash2 className="w-3.5 h-3.5" />}
                          className="min-h-[40px] text-xs font-semibold"
                        >
                          Revoke Access
                        </Button>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </section>

        {/* Confirmation Modal */}
        <ConfirmDialog
          open={!!deviceToRevoke}
          onClose={() => setDeviceToRevoke(null)}
          onConfirm={handleConfirmRevoke}
          title="Revoke Device Session?"
          message={`Are you sure you want to sign out "${deviceToRevoke?.device_name}"? That device will be disconnected immediately.`}
          confirmLabel="Yes, Revoke Device"
          confirmVariant="danger"
          loading={revokeMutation.isPending}
        />
      </div>
    </AppShell>
  );
}

export default function MyDevicesRoute() {
  return (
    <RouteGuard>
      <MyDevicesPage />
    </RouteGuard>
  );
}

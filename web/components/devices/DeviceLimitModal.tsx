"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Laptop, Smartphone, Tablet, ShieldAlert, Trash2, LogOut, CheckCircle2 } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { devicesRpc } from "@/lib/supabase/devices";
import { fmtDate } from "@/lib/utils";
import type { ActiveDeviceSummary } from "@/types/devices";

interface DeviceLimitModalProps {
  open: boolean;
  devices: ActiveDeviceSummary[];
  onRetryRegister: () => Promise<boolean>;
  onSignOut: () => Promise<void>;
}

export function DeviceLimitModal({
  open,
  devices,
  onRetryRegister,
  onSignOut,
}: DeviceLimitModalProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ur";
  const [revokingId, setRevokingId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  async function handleRevoke(deviceId: string) {
    setRevokingId(deviceId);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      await devicesRpc.revokeDevice(deviceId);
      setSuccessMsg(
        isRTL
          ? "ڈیوائس کامیابی سے ہٹا دی گئی۔ اس ڈیوائس کو رجسٹر کیا جا رہا ہے..."
          : "Device removed. Registering this device now..."
      );

      // Attempt to register this device now that a slot was freed
      const registered = await onRetryRegister();
      if (!registered) {
        setErrorMsg(
          isRTL
            ? "رجسٹریشن مکمل نہیں ہو سکی۔ برائے مہربانی دوبارہ کوشش کریں۔"
            : "Registration could not be completed. Please try again."
        );
      }
    } catch (err: any) {
      setErrorMsg(err?.message || (isRTL ? "ڈیوائس ہٹانے میں خرابی پیش آئی" : "Failed to remove device"));
    } finally {
      setRevokingId(null);
    }
  }

  function getDeviceIcon(type: string) {
    if (type === "android" || type === "ios") {
      return <Smartphone className="w-5 h-5 text-primary flex-shrink-0" />;
    }
    return <Laptop className="w-5 h-5 text-primary flex-shrink-0" />;
  }

  return (
    <Modal
      open={open}
      onClose={() => {}} // Cannot simply close out — must revoke or sign out
      title={
        isRTL
          ? "اکاؤنٹ پر 3 ڈیوائسز پہلے سے لاگ ان ہیں"
          : "Aap ke account par 3 devices already login hain"
      }
      size="md"
    >
      <div className="space-y-4 py-1" dir={isRTL ? "rtl" : "ltr"}>
        <div className="flex items-start gap-3 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300">
          <ShieldAlert className="w-5 h-5 flex-shrink-0 mt-0.5 text-amber-400" />
          <div className="text-xs sm:text-sm leading-relaxed">
            <p className="font-semibold text-amber-200">
              {isRTL
                ? "ڈیوائس لمٹ پوری ہو چکی ہے (3 / 3)"
                : "Active Device Limit Reached (3 of 3 Allowed)"}
            </p>
            <p className="text-amber-300/90 mt-1">
              {isRTL
                ? "آپ کے اکاؤنٹ پر بیک وقت زیادہ سے زیادہ 3 ڈیوائسز کی اجازت ہے۔ اس ڈیوائس پر لاگ ان جاری رکھنے کے لیے نیچے دی گئی لسٹ میں سے کسی پرانی ڈیوائس کو ہٹائیں۔"
                : "Peshify allows a maximum of 3 active devices per account. Please remove one of your existing devices below to log in on this device."}
            </p>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs sm:text-sm">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs sm:text-sm flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400" />
            <span>{successMsg}</span>
          </div>
        )}

        <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-1">
            {isRTL ? "فعال ڈیوائسز" : "Currently Active Devices"}
          </p>
          {devices.map((d) => (
            <div
              key={d.id}
              className="flex items-center justify-between p-3 rounded-xl bg-secondary/40 border border-border/80 gap-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-lg bg-card border border-border/80 flex items-center justify-center flex-shrink-0">
                  {getDeviceIcon(d.device_type)}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">
                    {d.device_name || (d.device_type === "web" ? "Web Browser" : "Mobile App")}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {isRTL ? "آخری سرگرمی: " : "Last active: "}
                    <span className="font-medium text-foreground">{fmtDate(d.last_seen_at)}</span>
                  </p>
                </div>
              </div>

              <Button
                variant="danger"
                size="sm"
                loading={revokingId === d.id}
                disabled={!!revokingId}
                onClick={() => handleRevoke(d.id)}
                leftIcon={<Trash2 className="w-3.5 h-3.5" />}
                className="flex-shrink-0 min-h-[40px] text-xs font-semibold"
              >
                {isRTL ? "ہٹائیں" : "Remove"}
              </Button>
            </div>
          ))}
        </div>

        <div className="pt-3 border-t border-border/80 flex items-center justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={onSignOut}
            leftIcon={<LogOut className="w-4 h-4" />}
            className="text-xs text-muted-foreground hover:text-foreground min-h-[44px]"
          >
            {isRTL ? "لاگ آؤٹ کریں" : "Sign Out"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

"use client";

import {
  createContext, useContext, useEffect, useRef,
  useState, useCallback, type ReactNode,
} from "react";
import type { User, Session } from "@supabase/supabase-js";
import { supabase, IS_SUPABASE_CONFIGURED } from "@/lib/supabase/client";
import { canUseWebPush, enableWebPush, disableWebPush, getWebPushSubscriptionEndpoint } from "@/lib/push";
import { devicesRpc } from "@/lib/supabase/devices";
import { getClientDeviceInfo } from "@/lib/deviceDetection";
import { DeviceLimitModal } from "@/components/devices/DeviceLimitModal";
import type { Profile, Firm } from "@/types/supabase";
import type { ActiveDeviceSummary } from "@/types/devices";

interface AuthContextValue {
  user:           User    | null;
  session:        Session | null;
  profile:        Profile | null;
  firm:           Firm    | null;
  loading:        boolean;
  profileLoading: boolean;
  configured:     boolean;
  unreadCount:    number;          // unread notifications count
  reminderCount:  number;
  currentDeviceId: string | null;
  registerCurrentDevice: () => Promise<boolean>;
  refreshProfile: () => Promise<void>;
  refreshCounts:  () => Promise<void>;
  signOut:        () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user:           null,
  session:        null,
  profile:        null,
  firm:           null,
  loading:        true,
  profileLoading: true,
  configured:     false,
  unreadCount:    0,
  reminderCount:  0,
  currentDeviceId: null,
  registerCurrentDevice: async () => false,
  refreshProfile: async () => {},
  refreshCounts:  async () => {},
  signOut:        async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user,        setUser]        = useState<User    | null>(null);
  const [session,     setSession]     = useState<Session | null>(null);
  const [profile,     setProfile]     = useState<Profile | null>(null);
  const [firm,        setFirm]        = useState<Firm    | null>(null);
  const [loading,     setLoading]     = useState(IS_SUPABASE_CONFIGURED);
  const [profileLoading, setProfileLoading] = useState(IS_SUPABASE_CONFIGURED);
  const [unreadCount, setUnreadCount] = useState(0);
  const [reminderCount, setReminderCount] = useState(0);

  // Device registration & limit state
  const [currentDeviceId, setCurrentDeviceId] = useState<string | null>(null);
  const [deviceLimitReached, setDeviceLimitReached] = useState(false);
  const [activeLimitDevices, setActiveLimitDevices] = useState<ActiveDeviceSummary[]>([]);
  const lastHeartbeatTimeRef = useRef<number>(0);
  const profileRef = useRef<Profile | null>(null);

  // ── Fetch profile row ────────────────────────────────────────────────────
  const fetchProfile = useCallback(async (userId: string, silent: boolean = false) => {
    if (!silent && !profileRef.current) {
      setProfileLoading(true);
    }
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();
      if (error) throw error;
      if (!data) throw new Error("The signed-in user has no profile.");
      const profileData = data as import("@/types/supabase").Profile | null;
      if (profileData) {
        profileRef.current = profileData;
        setProfile(profileData);
        const { data: firmData, error: firmError } = await supabase
          .from("firms")
          .select("*")
          .eq("id", profileData.firm_id)
          .single();
        if (firmError) throw firmError;
        setFirm((firmData as import("@/types/supabase").Firm | null) ?? null);
      }
    } catch (error) {
      if (!silent) {
        profileRef.current = null;
        setProfile(null);
        setFirm(null);
      }
      throw error;
    } finally {
      if (!silent) {
        setProfileLoading(false);
      }
    }
  }, []);

  // ── Fetch unread notification count ──────────────────────────────────────
  const refreshCounts = useCallback(async () => {
    if (!IS_SUPABASE_CONFIGURED) return;
    try {
      const [{ count: unread, error: notificationsError }, { count: upcoming, error: remindersError }] = await Promise.all([
        supabase
        .from("notifications")
        .select("id", { count: "exact", head: true })
        .eq("is_read", false),
        supabase
        .from("reminders")
        .select("id", { count: "exact", head: true })
        .eq("status", "upcoming"),
      ]);
      if (notificationsError) console.error("[notifications] count:", notificationsError.message);
      if (remindersError) console.error("[reminders] count:", remindersError.message);
      setUnreadCount(unread ?? 0);
      setReminderCount(upcoming ?? 0);
    } catch (error) {
      console.error("[notifications] refresh counts:", error);
    }
  }, []);

  // ── Public: re-fetch profile (after photo/name update) ───────────────────
  const refreshProfile = useCallback(async () => {
    if (user) await fetchProfile(user.id);
  }, [user, fetchProfile]);

  // ── Register / remove device token (push) on sign-in / sign-out ───────────
  const registerDeviceToken = useCallback(async (userId: string) => {
    if (!IS_SUPABASE_CONFIGURED || !canUseWebPush()) return;
    try {
      const endpoint = await getWebPushSubscriptionEndpoint();
      if (!endpoint) {
        // Try to subscribe (requires user to have granted notification permission
        // and the VAPID public key to be configured).
        await enableWebPush(userId);
        const ep = await getWebPushSubscriptionEndpoint();
        if (!ep) return;
      }
      // Upsert into device_tokens (platform 'web') so the send-push Edge Function
      // can target this device via FCM/device-token path as well.
      const { error } = await supabase.from("device_tokens").upsert({
        user_id: userId,
        token: await getWebPushSubscriptionEndpoint() ?? "",
        platform: "web",
      }, { onConflict: "token" });
      if (error) console.error("[device_token] upsert:", error.message);
    } catch (error) {
      // Non-fatal: push registration is optional.
      console.error("[device_token] register:", error);
    }
  }, []);

  const removeDeviceToken = useCallback(async (userId: string) => {
    if (!IS_SUPABASE_CONFIGURED || !userId) return;
    try {
      // Only remove the current browser's push token, not all tokens across devices
      const { getWebPushSubscriptionEndpoint } = await import("@/lib/push");
      const endpoint = await getWebPushSubscriptionEndpoint();
      if (!endpoint) return; // No push subscription for this browser — nothing to clean up
      const { error } = await supabase
        .from("device_tokens")
        .delete()
        .eq("user_id", userId)
        .eq("token", endpoint);
      if (error) console.error("[device_token] remove:", error.message);
    } catch (error) {
      console.error("[device_token] remove:", error);
    }
  }, []);

  // ── Register device (active device limits & session tracking) ───────────────
  const registerCurrentDevice = useCallback(async (): Promise<boolean> => {
    if (!IS_SUPABASE_CONFIGURED) return true;
    try {
      const info = await getClientDeviceInfo();
      const res = await devicesRpc.registerDevice(
        info.deviceName,
        info.deviceType,
        info.deviceUuid
      );

      if (res.status === "limit_reached") {
        setActiveLimitDevices(res.devices);
        setDeviceLimitReached(true);
        return false;
      }

      if (res.status === "ok") {
        setCurrentDeviceId(res.device_id);
        setDeviceLimitReached(false);
        setActiveLimitDevices([]);
        if (typeof window !== "undefined") {
          localStorage.setItem("peshify_current_device_id", res.device_id);
        }
        return true;
      }
    } catch (error) {
      console.error("[devices] register current device error:", error);
    }
    return true;
  }, []);

  // ── Heartbeat device check (throttled ping, max once every 10 min) ──────────
  const performHeartbeat = useCallback(async (forced: boolean = false) => {
    if (!IS_SUPABASE_CONFIGURED || !user) return;
    const now = Date.now();
    // At most once every 10 minutes unless forced
    if (!forced && (now - lastHeartbeatTimeRef.current < 10 * 60 * 1000)) {
      return;
    }

    const deviceId =
      currentDeviceId ||
      (typeof window !== "undefined"
        ? localStorage.getItem("peshify_current_device_id")
        : null);

    if (!deviceId) return;
    lastHeartbeatTimeRef.current = now;

    try {
      const res = await devicesRpc.heartbeat(deviceId);
      if (res && res.valid === false && res.reason === "revoked") {
        console.warn("[devices] Session revoked from another device.");
        // Sign out automatically
        await signOut();
        if (typeof window !== "undefined") {
          alert("Aap ko doosre device se logout kar diya gaya / You have been logged out from another device.");
        }
      }
    } catch (err) {
      console.error("[devices] heartbeat check failed:", err);
    }
  }, [user, currentDeviceId]);

  // ── Auth state listener ───────────────────────────────────────────────────
  useEffect(() => {
    if (!IS_SUPABASE_CONFIGURED) {
      setLoading(false);
      setProfileLoading(false);
      return;
    }

    void (async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        setSession(data.session);
        setUser(data.session?.user ?? null);
        if (data.session?.user) {
          await fetchProfile(data.session.user.id);
          await refreshCounts();
          await registerDeviceToken(data.session.user.id);
          await registerCurrentDevice();
        } else {
          setProfile(null);
          setFirm(null);
          setProfileLoading(false);
        }
      } catch (error) {
        console.error("[auth] session/profile load:", error);
        setProfileLoading(false);
      } finally {
        setLoading(false);
      }
    })();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);
        if (newSession?.user) {
          const hasExistingProfile = !!profileRef.current;
          // Only show loading spinner on fresh sign-in, not background token refreshes or tab switches
          if (!hasExistingProfile && event !== "TOKEN_REFRESHED") {
            setProfileLoading(true);
          }
          setLoading(false);
          void fetchProfile(newSession.user.id, hasExistingProfile)
            .then(refreshCounts)
            .then(() => registerDeviceToken(newSession.user.id))
            .then(() => registerCurrentDevice())
            .catch(error => console.error("[auth] profile load:", error));
        } else {
          profileRef.current = null;
          setProfile(null);
          setFirm(null);
          setUnreadCount(0);
          setReminderCount(0);
          setCurrentDeviceId(null);
          setProfileLoading(false);
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [fetchProfile, refreshCounts, registerDeviceToken, registerCurrentDevice]);

  // ── Poll heartbeat periodically (every 5 minutes in background) ────────────
  useEffect(() => {
    if (!user || !IS_SUPABASE_CONFIGURED) return;

    // Check heartbeat periodically (every 5 minutes)
    const intervalId = setInterval(() => {
      void performHeartbeat();
    }, 5 * 60 * 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [user, performHeartbeat]);

  // ── Poll unread count every 60 s when user is active ─────────────────────
  useEffect(() => {
    if (!user || !IS_SUPABASE_CONFIGURED) return;
    const id = setInterval(refreshCounts, 60_000);
    return () => clearInterval(id);
  }, [user, refreshCounts]);

  useEffect(() => {
    if (!user || !IS_SUPABASE_CONFIGURED) return;
    const channel = supabase
      .channel(`notification-badges:${user.id}`)
      .on("postgres_changes", {
        event: "*",
        schema: "public",
        table: "notifications",
        filter: `user_id=eq.${user.id}`,
      }, () => { void refreshCounts(); })
      .on("postgres_changes", {
        event: "*",
        schema: "public",
        table: "reminders",
        filter: `user_id=eq.${user.id}`,
      }, () => { void refreshCounts(); })
      .subscribe();
    return () => { void supabase.removeChannel(channel); };
  }, [user, refreshCounts]);

  const signOut = useCallback(async () => {
    if (user) await removeDeviceToken(user.id);
    if (typeof window !== "undefined") {
      localStorage.removeItem("peshify_current_device_id");
    }
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
    setFirm(null);
    setUnreadCount(0);
    setReminderCount(0);
    setCurrentDeviceId(null);
    setDeviceLimitReached(false);
    setActiveLimitDevices([]);
  }, [user, removeDeviceToken]);

  return (
    <AuthContext.Provider value={{
      user, session, profile, firm, loading, profileLoading,
      configured: IS_SUPABASE_CONFIGURED,
      unreadCount, reminderCount,
      currentDeviceId, registerCurrentDevice,
      refreshProfile, refreshCounts, signOut,
    }}>
      {children}
      {deviceLimitReached && (
        <DeviceLimitModal
          open={deviceLimitReached}
          devices={activeLimitDevices}
          onRetryRegister={registerCurrentDevice}
          onSignOut={signOut}
        />
      )}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

import { supabase } from "./client";
import type {
  RegisterDeviceResult,
  UserDeviceRecord,
} from "@/types/devices";

export const devicesRpc = {
  /**
   * Registers or refreshes the current session device.
   * Returns { status: 'ok' } or { status: 'limit_reached', devices: [...] }
   */
  async registerDevice(
    deviceName: string,
    deviceType: string = "web",
    clientSessionId?: string
  ): Promise<RegisterDeviceResult> {
    const { data, error } = await (supabase as any).rpc("register_device", {
      p_device_name: deviceName,
      p_device_type: deviceType,
      p_client_session_id: clientSessionId || null,
    });

    if (error) {
      console.error("[devices] register_device RPC error:", error);
      throw error;
    }

    return data as RegisterDeviceResult;
  },

  /**
   * Revokes a device by its ID.
   */
  async revokeDevice(deviceId: string): Promise<{ status: string; revoked_id: string }> {
    const { data, error } = await (supabase as any).rpc("revoke_device", {
      p_device_id: deviceId,
    });

    if (error) {
      console.error("[devices] revoke_device RPC error:", error);
      throw error;
    }

    return data;
  },

  /**
   * Heartbeat to keep session alive and check if it has been revoked from another device.
   */
  async heartbeat(deviceId: string): Promise<{ valid: boolean; reason?: string }> {
    const { data, error } = await (supabase as any).rpc("heartbeat_device", {
      p_device_id: deviceId,
    });

    if (error) {
      console.error("[devices] heartbeat error:", error);
      return { valid: true }; // Non-fatal on network hiccup
    }

    return data;
  },

  /**
   * Super Admin helper to reset/revoke all devices for a given user.
   */
  async adminResetUserDevices(userId: string): Promise<{ status: string; user_id: string }> {
    const { data, error } = await (supabase as any).rpc("admin_reset_user_devices", {
      p_user_id: userId,
    });

    if (error) {
      console.error("[devices] admin_reset_user_devices error:", error);
      throw error;
    }

    return data;
  },

  /**
   * Fetch active devices for the current user (last 30 days and not revoked).
   */
  async getMyDevices(): Promise<UserDeviceRecord[]> {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const { data, error } = await (supabase as any)
      .from("user_devices")
      .select("*")
      .is("revoked_at", null)
      .gte("last_seen_at", thirtyDaysAgo)
      .order("last_seen_at", { ascending: false });

    if (error) {
      console.error("[devices] getMyDevices error:", error);
      throw error;
    }

    return (data as UserDeviceRecord[]) ?? [];
  },
};

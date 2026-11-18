import { Device } from "@capacitor/device";
import type { DeviceType } from "@/types/devices";

const DEVICE_UUID_KEY = "peshify_device_uuid";

/**
 * Returns a human-friendly browser + OS string if running in standard web.
 */
function getWebDeviceName(): string {
  if (typeof window === "undefined" || !window.navigator) {
    return "Web Client";
  }

  const ua = navigator.userAgent;
  let browser = "Browser";
  if (ua.includes("Firefox/")) browser = "Firefox";
  else if (ua.includes("Edg/")) browser = "Edge";
  else if (ua.includes("Chrome/") && !ua.includes("Edg/")) browser = "Chrome";
  else if (ua.includes("Safari/") && !ua.includes("Chrome/")) browser = "Safari";
  else if (ua.includes("Opera") || ua.includes("OPR/")) browser = "Opera";

  let os = "Web";
  if (/Windows NT 10.0/i.test(ua)) os = "Windows 10/11";
  else if (/Windows/i.test(ua)) os = "Windows";
  else if (/Android/i.test(ua)) os = "Android";
  else if (/iPhone|iPad|iPod/i.test(ua)) os = "iOS";
  else if (/Mac OS X/i.test(ua)) os = "macOS";
  else if (/Linux/i.test(ua)) os = "Linux";

  return `${browser} on ${os}`;
}

/**
 * Detects current device name, type, and persistent device UUID.
 * Integrates @capacitor/device when running native, with standard web fallbacks.
 */
export async function getClientDeviceInfo(): Promise<{
  deviceName: string;
  deviceType: DeviceType;
  deviceUuid: string;
}> {
  let deviceName = "Web Browser";
  let deviceType: DeviceType = "web";
  let deviceUuid = "";

  // 1. Get or generate persistent UUID
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(DEVICE_UUID_KEY);
      if (stored) {
        deviceUuid = stored;
      } else {
        deviceUuid = crypto?.randomUUID?.() ?? `device-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
        localStorage.setItem(DEVICE_UUID_KEY, deviceUuid);
      }
    } catch {
      deviceUuid = `device-${Date.now()}`;
    }
  }

  // 2. Query Capacitor Device API
  try {
    const info = await Device.getInfo();
    if (info.platform === "android") {
      deviceType = "android";
      deviceName = info.model ? `Android (${info.model})` : (info.name || "Android Phone");
    } else if (info.platform === "ios") {
      deviceType = "ios";
      deviceName = info.model ? `iPhone/iPad (${info.model})` : (info.name || "Apple Device");
    } else {
      deviceType = "web";
      deviceName = getWebDeviceName();
    }

    try {
      const capId = await Device.getId();
      if (capId?.identifier) {
        deviceUuid = capId.identifier;
      }
    } catch {
      // Use fallback deviceUuid
    }
  } catch {
    // If Capacitor plugin call fails (pure SSR or standard browser), use web detection
    deviceName = getWebDeviceName();
    deviceType = "web";
  }

  return { deviceName, deviceType, deviceUuid };
}

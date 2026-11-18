export type DeviceType = "web" | "android" | "ios";

export interface UserDeviceRecord {
  id: string;
  user_id: string;
  session_id: string | null;
  device_name: string;
  device_type: DeviceType;
  last_seen_at: string;
  created_at: string;
  revoked_at: string | null;
}

export interface ActiveDeviceSummary {
  id: string;
  device_name: string;
  device_type: DeviceType;
  last_seen_at: string;
  created_at: string;
}

export interface RegisterDeviceOkResult {
  status: "ok";
  device_id: string;
  session_id: string;
}

export interface RegisterDeviceLimitResult {
  status: "limit_reached";
  message: string;
  devices: ActiveDeviceSummary[];
}

export type RegisterDeviceResult = RegisterDeviceOkResult | RegisterDeviceLimitResult;

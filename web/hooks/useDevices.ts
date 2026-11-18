"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { devicesRpc } from "@/lib/supabase/devices";
import type { UserDeviceRecord } from "@/types/devices";

export function useMyDevices() {
  return useQuery<UserDeviceRecord[]>({
    queryKey: ["my-devices"],
    queryFn: async () => {
      return await devicesRpc.getMyDevices();
    },
    staleTime: 1000 * 30,
  });
}

export function useRevokeDevice() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (deviceId: string) => devicesRpc.revokeDevice(deviceId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["my-devices"] });
    },
  });
}

export function useAdminResetUserDevices() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => devicesRpc.adminResetUserDevices(userId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["my-devices"] });
    },
  });
}

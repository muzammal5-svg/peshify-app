"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { db, insert, supabaseRaw } from "@/lib/supabase/client";
import { useAuth } from "@/providers/AuthProvider";
import type { Court } from "@/types/supabase";

export function useCourts() {
  const { profile } = useAuth();
  const firmId = profile?.firm_id;
  const isSuper = profile?.role === "super_admin";

  return useQuery({
    queryKey: ["courts", firmId],
    queryFn: async () => {
      let q = db.courts()
        .select("*")
        .order("name", { ascending: true });

      if (firmId && !isSuper) {
        q = q.eq("firm_id", firmId);
      }

      const { data, error } = await q;
      if (error) throw error;
      return (data as Court[]) ?? [];
    },
    enabled: !!firmId || isSuper,
    staleTime: 1000 * 60 * 10,
  });
}

export function useCreateCourt() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { firm_id: string; name: string }) => {
      const { data, error } = await insert.court(payload);
      if (error) throw error;
      return data as Court;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["courts"] }),
  });
}

export function useUpdateCourt() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, name }: { id: string; name: string }) => {
      const { error } = await supabaseRaw.from("courts").update({ name }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["courts"] }),
  });
}

export function useDeleteCourt() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabaseRaw.from("courts").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["courts"] }),
  });
}

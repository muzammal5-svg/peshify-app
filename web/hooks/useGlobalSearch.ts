"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { db } from "@/lib/supabase/client";
import { useAuth } from "@/providers/AuthProvider";

export interface GlobalSearchCase {
  id: string;
  case_ref_no: string;
  plaintiff_name: string;
  defendant_name: string;
  status: string;
  court_no?: string | null;
  judge_name?: string | null;
}

export interface GlobalSearchClient {
  id: string;
  full_name: string;
  phone?: string | null;
  whatsapp?: string | null;
  city?: string | null;
  cnic?: string | null;
}

export interface GlobalSearchResults {
  cases: GlobalSearchCase[];
  clients: GlobalSearchClient[];
  totalCount: number;
}

export function useGlobalSearch(query: string) {
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const { profile } = useAuth();
  const firmId = profile?.firm_id;
  const isSuper = profile?.role === "super_admin";

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 250);
    return () => clearTimeout(handler);
  }, [query]);

  const enabled = debouncedQuery.length >= 2;

  const { data, isLoading, isFetching } = useQuery<GlobalSearchResults>({
    queryKey: ["global-search", debouncedQuery, firmId],
    queryFn: async () => {
      const clean = debouncedQuery.replace(/[%_,]/g, "");
      if (!clean) return { cases: [], clients: [], totalCount: 0 };

      let casesQ = db
        .cases()
        .select("id, case_ref_no, plaintiff_name, defendant_name, status, court_no, judge_name")
        .or(
          `case_ref_no.ilike.%${clean}%,plaintiff_name.ilike.%${clean}%,defendant_name.ilike.%${clean}%`
        )
        .limit(6);

      let clientsQ = db
        .clients()
        .select("id, full_name, phone, whatsapp, city, cnic")
        .or(`full_name.ilike.%${clean}%,phone.ilike.%${clean}%,whatsapp.ilike.%${clean}%`)
        .limit(6);

      if (firmId && !isSuper) {
        casesQ = casesQ.eq("firm_id", firmId);
        clientsQ = clientsQ.eq("firm_id", firmId);
      }

      const [casesRes, clientsRes] = await Promise.all([casesQ, clientsQ]);

      const cases = (casesRes.data || []) as GlobalSearchCase[];
      const clients = (clientsRes.data || []) as GlobalSearchClient[];

      return {
        cases,
        clients,
        totalCount: cases.length + clients.length,
      };
    },
    enabled,
    staleTime: 1000 * 30, // 30s
  });

  return {
    results: data ?? { cases: [], clients: [], totalCount: 0 },
    isLoading: enabled && (isLoading || isFetching),
    debouncedQuery,
  };
}

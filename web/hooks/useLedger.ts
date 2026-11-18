"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ledgerRpc } from "@/lib/supabase/ledger";
import type {
  DealSummary,
  ClientDeal,
  ClientPayment,
  ChamberExpense,
  FirmLedgerSummary,
} from "@/types/ledger";

export function useClientDeals(clientId: string | null | undefined) {
  return useQuery<DealSummary[]>({
    queryKey: ["client-deals", clientId],
    queryFn: async () => {
      if (!clientId) return [];
      return await ledgerRpc.getClientDeals(clientId);
    },
    enabled: !!clientId,
    staleTime: 1000 * 30,
  });
}

export function useCaseDeal(caseId: string | null | undefined) {
  return useQuery<DealSummary | null>({
    queryKey: ["case-deal", caseId],
    queryFn: async () => {
      if (!caseId) return null;
      return await ledgerRpc.getCaseDeal(caseId);
    },
    enabled: !!caseId,
    staleTime: 1000 * 30,
  });
}

export function useDealPayments(params: { dealId?: string; clientId?: string }) {
  return useQuery<ClientPayment[]>({
    queryKey: ["client-payments", params.dealId, params.clientId],
    queryFn: async () => {
      if (!params.dealId && !params.clientId) return [];
      return await ledgerRpc.getPayments(params);
    },
    enabled: !!(params.dealId || params.clientId),
    staleTime: 1000 * 30,
  });
}

export function useDealExpenses(params: { dealId?: string }) {
  return useQuery<ChamberExpense[]>({
    queryKey: ["chamber-expenses", params.dealId],
    queryFn: async () => {
      return await ledgerRpc.getExpenses(params);
    },
    staleTime: 1000 * 30,
  });
}

export function useFirmLedgerSummary(enabled: boolean = true) {
  return useQuery<FirmLedgerSummary>({
    queryKey: ["firm-ledger-summary"],
    queryFn: async () => {
      return await ledgerRpc.getFirmLedgerSummary();
    },
    enabled,
    staleTime: 1000 * 60,
  });
}

export function useCreateDeal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (deal: {
      firm_id: string;
      client_id: string;
      case_id?: string | null;
      title: string;
      agreed_amount: number;
      currency?: string;
      notes?: string | null;
      created_by?: string | null;
    }) => ledgerRpc.createDeal(deal),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ["client-deals", variables.client_id] });
      if (variables.case_id) {
        qc.invalidateQueries({ queryKey: ["case-deal", variables.case_id] });
      }
      qc.invalidateQueries({ queryKey: ["firm-ledger-summary"] });
    },
  });
}

export function useCreatePayment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payment: {
      firm_id: string;
      deal_id: string;
      client_id: string;
      amount: number;
      payment_date?: string;
      method?: string;
      reference_no?: string | null;
      notes?: string | null;
      created_by?: string | null;
    }) => ledgerRpc.createPayment(payment),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ["client-deals", variables.client_id] });
      qc.invalidateQueries({ queryKey: ["client-payments", variables.deal_id, variables.client_id] });
      qc.invalidateQueries({ queryKey: ["case-deal"] });
      qc.invalidateQueries({ queryKey: ["firm-ledger-summary"] });
    },
  });
}

export function useCreateExpense() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (expense: {
      firm_id: string;
      deal_id?: string | null;
      category: string;
      amount: number;
      expense_date?: string;
      notes?: string | null;
      created_by?: string | null;
    }) => ledgerRpc.createExpense(expense),
    onSuccess: (_, variables) => {
      if (variables.deal_id) {
        qc.invalidateQueries({ queryKey: ["client-deals"] });
        qc.invalidateQueries({ queryKey: ["chamber-expenses", variables.deal_id] });
        qc.invalidateQueries({ queryKey: ["case-deal"] });
      }
      qc.invalidateQueries({ queryKey: ["firm-ledger-summary"] });
    },
  });
}

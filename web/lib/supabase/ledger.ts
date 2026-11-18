import { supabase } from "./client";
import type {
  ClientDeal,
  ClientPayment,
  ChamberExpense,
  DealSummary,
  FirmLedgerSummary,
} from "@/types/ledger";

export const ledgerDb = {
  deals: () => (supabase as any).from("client_deals"),
  payments: () => (supabase as any).from("client_payments"),
  expenses: () => (supabase as any).from("chamber_expenses"),
  dealsSummary: () => (supabase as any).from("v_client_deals_summary"),
};

export const ledgerRpc = {
  /**
   * Summarized metrics for the dashboard: Total agreed, received, outstanding, and top debtors.
   */
  async getFirmLedgerSummary(): Promise<FirmLedgerSummary> {
    const { data, error } = await (supabase as any).rpc("get_firm_ledger_summary");
    if (error) {
      console.error("[ledger] get_firm_ledger_summary error:", error);
      return {
        total_agreed: 0,
        total_received: 0,
        total_outstanding: 0,
        debtors: [],
      };
    }

    return (data as FirmLedgerSummary) ?? {
      total_agreed: 0,
      total_received: 0,
      total_outstanding: 0,
      debtors: [],
    };
  },

  /**
   * Fetch summarized deals for a specific client.
   */
  async getClientDeals(clientId: string): Promise<DealSummary[]> {
    const { data, error } = await ledgerDb
      .dealsSummary()
      .select("*")
      .eq("client_id", clientId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[ledger] getClientDeals error:", error);
      throw error;
    }

    return (data as DealSummary[]) ?? [];
  },

  /**
   * Fetch summarized deal for a specific case (if linked).
   */
  async getCaseDeal(caseId: string): Promise<DealSummary | null> {
    const { data, error } = await ledgerDb
      .dealsSummary()
      .select("*")
      .eq("case_id", caseId)
      .maybeSingle();

    if (error) {
      console.error("[ledger] getCaseDeal error:", error);
      return null;
    }

    return (data as DealSummary | null) ?? null;
  },

  /**
   * Fetch payments for a deal or client.
   */
  async getPayments(params: { dealId?: string; clientId?: string }): Promise<ClientPayment[]> {
    let q = ledgerDb.payments().select("*").order("payment_date", { ascending: false }).order("created_at", { ascending: false });
    if (params.dealId) q = q.eq("deal_id", params.dealId);
    if (params.clientId) q = q.eq("client_id", params.clientId);

    const { data, error } = await q;
    if (error) {
      console.error("[ledger] getPayments error:", error);
      throw error;
    }

    return (data as ClientPayment[]) ?? [];
  },

  /**
   * Fetch expenses for a deal or firm.
   */
  async getExpenses(params: { dealId?: string }): Promise<ChamberExpense[]> {
    let q = ledgerDb.expenses().select("*").order("expense_date", { ascending: false }).order("created_at", { ascending: false });
    if (params.dealId) q = q.eq("deal_id", params.dealId);

    const { data, error } = await q;
    if (error) {
      console.error("[ledger] getExpenses error:", error);
      throw error;
    }

    return (data as ChamberExpense[]) ?? [];
  },

  /**
   * Insert a new client deal.
   */
  async createDeal(deal: {
    firm_id: string;
    client_id: string;
    case_id?: string | null;
    title: string;
    agreed_amount: number;
    currency?: string;
    notes?: string | null;
    created_by?: string | null;
  }): Promise<ClientDeal> {
    const { data, error } = await ledgerDb.deals().insert({
      firm_id: deal.firm_id,
      client_id: deal.client_id,
      case_id: deal.case_id || null,
      title: deal.title.trim(),
      agreed_amount: Math.max(0, deal.agreed_amount),
      currency: deal.currency || "PKR",
      notes: deal.notes || null,
      created_by: deal.created_by || null,
      status: "active",
    }).select().single();

    if (error) {
      console.error("[ledger] createDeal error:", error);
      throw error;
    }

    return data as ClientDeal;
  },

  /**
   * Insert a client payment.
   */
  async createPayment(payment: {
    firm_id: string;
    deal_id: string;
    client_id: string;
    amount: number;
    payment_date?: string;
    method?: string;
    reference_no?: string | null;
    notes?: string | null;
    created_by?: string | null;
  }): Promise<ClientPayment> {
    const { data, error } = await ledgerDb.payments().insert({
      firm_id: payment.firm_id,
      deal_id: payment.deal_id,
      client_id: payment.client_id,
      amount: Math.max(0, payment.amount),
      payment_date: payment.payment_date || new Date().toISOString().split("T")[0],
      method: payment.method || "cash",
      reference_no: payment.reference_no || null,
      notes: payment.notes || null,
      created_by: payment.created_by || null,
    }).select().single();

    if (error) {
      console.error("[ledger] createPayment error:", error);
      throw error;
    }

    return data as ClientPayment;
  },

  /**
   * Insert a chamber expense.
   */
  async createExpense(expense: {
    firm_id: string;
    deal_id?: string | null;
    category: string;
    amount: number;
    expense_date?: string;
    notes?: string | null;
    created_by?: string | null;
  }): Promise<ChamberExpense> {
    const { data, error } = await ledgerDb.expenses().insert({
      firm_id: expense.firm_id,
      deal_id: expense.deal_id || null,
      category: expense.category,
      amount: Math.max(0, expense.amount),
      expense_date: expense.expense_date || new Date().toISOString().split("T")[0],
      notes: expense.notes || null,
      created_by: expense.created_by || null,
    }).select().single();

    if (error) {
      console.error("[ledger] createExpense error:", error);
      throw error;
    }

    return data as ChamberExpense;
  },
};

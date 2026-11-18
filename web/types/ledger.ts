export type ClientDealStatus = "active" | "closed";

export type ClientPaymentMethod =
  | "cash"
  | "bank"
  | "easypaisa"
  | "jazzcash"
  | "cheque"
  | "other";

export type ChamberExpenseCategory =
  | "court_fee"
  | "stamp_paper"
  | "munshi"
  | "travel"
  | "other";

export interface ClientDeal {
  id: string;
  firm_id: string;
  client_id: string;
  case_id: string | null;
  title: string;
  agreed_amount: number;
  currency: string;
  notes: string | null;
  status: ClientDealStatus;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface ClientPayment {
  id: string;
  firm_id: string;
  deal_id: string;
  client_id: string;
  amount: number;
  payment_date: string;
  method: ClientPaymentMethod;
  reference_no: string | null;
  notes: string | null;
  created_by: string | null;
  created_at: string;
}

export interface ChamberExpense {
  id: string;
  firm_id: string;
  deal_id: string | null;
  category: ChamberExpenseCategory;
  amount: number;
  expense_date: string;
  notes: string | null;
  created_by: string | null;
  created_at: string;
}

export interface DealSummary {
  deal_id: string;
  firm_id: string;
  client_id: string;
  case_id: string | null;
  title: string;
  agreed_amount: number;
  currency: string;
  notes: string | null;
  status: ClientDealStatus;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  total_received: number;
  total_expenses: number;
  balance: number;
}

export interface TopDebtor {
  client_id: string;
  client_name: string;
  client_phone: string | null;
  total_balance: number;
  active_deals_count: number;
}

export interface FirmLedgerSummary {
  total_agreed: number;
  total_received: number;
  total_outstanding: number;
  debtors: TopDebtor[];
}

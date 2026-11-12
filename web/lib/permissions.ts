import type { UserRole } from "@/types/supabase";

export type PermissionAction =
  // Cases
  | "cases:view"
  | "cases:create"
  | "cases:edit"
  | "cases:delete"
  | "cases:decide"
  | "cases:reopen"
  // Clients
  | "clients:view"
  | "clients:create"
  | "clients:edit"
  | "clients:delete"
  // Hearings
  | "hearings:view"
  | "hearings:create"
  | "hearings:edit"
  | "hearings:delete"
  // Case Notes
  | "notes:view"
  | "notes:create"
  | "notes:delete"
  // Documents
  | "documents:view"
  | "documents:upload"
  | "documents:delete"
  // Cause List
  | "cause_list:view"
  // Fees & Payments
  | "fees:view"
  | "fees:edit"
  | "payments:view"
  | "payments:create"
  | "subscriptions:view"
  | "subscriptions:manage"
  // Settings & Configuration
  | "settings:view"
  | "settings:firm"
  | "settings:users"
  | "settings:courts"
  | "settings:case_types"
  | "settings:admin_config"
  | "settings:danger_zone";

/**
 * Static Role-Based Permission Matrix
 *
 * Rules:
 * - super_admin: Full access across the entire platform
 * - admin: Full control within their firm
 * - lawyer: Can manage cases, clients, hearings, documents; cannot delete cases/clients or change firm settings
 * - clerk (Munshi):
 *     CAN: view cases, view clients, add/edit hearings, add case notes, view cause list, view/upload documents
 *     CANNOT: delete cases/clients/documents, view or edit any fee/payment data, create new cases, change firm/subscription/user settings
 */
const ROLE_PERMISSIONS: Record<UserRole, Record<PermissionAction, boolean>> = {
  super_admin: {
    "cases:view": true,
    "cases:create": true,
    "cases:edit": true,
    "cases:delete": true,
    "cases:decide": true,
    "cases:reopen": true,
    "clients:view": true,
    "clients:create": true,
    "clients:edit": true,
    "clients:delete": true,
    "hearings:view": true,
    "hearings:create": true,
    "hearings:edit": true,
    "hearings:delete": true,
    "notes:view": true,
    "notes:create": true,
    "notes:delete": true,
    "documents:view": true,
    "documents:upload": true,
    "documents:delete": true,
    "cause_list:view": true,
    "fees:view": true,
    "fees:edit": true,
    "payments:view": true,
    "payments:create": true,
    "subscriptions:view": true,
    "subscriptions:manage": true,
    "settings:view": true,
    "settings:firm": true,
    "settings:users": true,
    "settings:courts": true,
    "settings:case_types": true,
    "settings:admin_config": true,
    "settings:danger_zone": true,
  },
  admin: {
    "cases:view": true,
    "cases:create": true,
    "cases:edit": true,
    "cases:delete": true,
    "cases:decide": true,
    "cases:reopen": true,
    "clients:view": true,
    "clients:create": true,
    "clients:edit": true,
    "clients:delete": true,
    "hearings:view": true,
    "hearings:create": true,
    "hearings:edit": true,
    "hearings:delete": true,
    "notes:view": true,
    "notes:create": true,
    "notes:delete": true,
    "documents:view": true,
    "documents:upload": true,
    "documents:delete": true,
    "cause_list:view": true,
    "fees:view": true,
    "fees:edit": true,
    "payments:view": true,
    "payments:create": true,
    "subscriptions:view": true,
    "subscriptions:manage": true,
    "settings:view": true,
    "settings:firm": true,
    "settings:users": true,
    "settings:courts": true,
    "settings:case_types": true,
    "settings:admin_config": true,
    "settings:danger_zone": true,
  },
  lawyer: {
    "cases:view": true,
    "cases:create": true,
    "cases:edit": true,
    "cases:delete": false, // Firm admin only
    "cases:decide": true,
    "cases:reopen": false, // Firm admin only
    "clients:view": true,
    "clients:create": true,
    "clients:edit": true,
    "clients:delete": false, // Firm admin only
    "hearings:view": true,
    "hearings:create": true,
    "hearings:edit": true,
    "hearings:delete": false, // Firm admin only
    "notes:view": true,
    "notes:create": true,
    "notes:delete": true,
    "documents:view": true,
    "documents:upload": true,
    "documents:delete": true,
    "cause_list:view": true,
    "fees:view": true,
    "fees:edit": true,
    "payments:view": true,
    "payments:create": false,
    "subscriptions:view": true,
    "subscriptions:manage": false,
    "settings:view": true,
    "settings:firm": false,
    "settings:users": false,
    "settings:courts": false,
    "settings:case_types": false,
    "settings:admin_config": false,
    "settings:danger_zone": false,
  },
  clerk: {
    // Clerk CAN:
    "cases:view": true,
    "clients:view": true,
    "hearings:view": true,
    "hearings:create": true,
    "hearings:edit": true,
    "notes:view": true,
    "notes:create": true,
    "cause_list:view": true,
    "documents:view": true,
    "documents:upload": true,
    "settings:view": true, // profile & preferences only

    // Clerk CANNOT:
    "cases:create": false,
    "cases:edit": false,
    "cases:delete": false,
    "cases:decide": false,
    "cases:reopen": false,
    "clients:create": false,
    "clients:edit": false,
    "clients:delete": false,
    "hearings:delete": false,
    "notes:delete": false,
    "documents:delete": false,
    "fees:view": false,
    "fees:edit": false,
    "payments:view": false,
    "payments:create": false,
    "subscriptions:view": false,
    "subscriptions:manage": false,
    "settings:firm": false,
    "settings:users": false,
    "settings:courts": false,
    "settings:case_types": false,
    "settings:admin_config": false,
    "settings:danger_zone": false,
  },
};

/**
 * Primary permission evaluation helper
 *
 * Usage:
 *   if (can(userRole, "cases:create")) { ... }
 */
export function can(
  role: UserRole | string | null | undefined,
  action: PermissionAction
): boolean {
  if (!role) return false;
  const userRole = role as UserRole;
  const permissions = ROLE_PERMISSIONS[userRole];
  if (!permissions) return false;
  return !!permissions[action];
}

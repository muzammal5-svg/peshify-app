"use client";

import { useAuth } from "@/providers/AuthProvider";
import type { UserRole } from "@/types/supabase";
import { can, type PermissionAction } from "@/lib/permissions";

const ROLE_RANK: Record<UserRole, number> = {
  super_admin: 4,
  admin:       3,
  lawyer:      2,
  clerk:       1,
};

/**
 * Returns role and permission helpers for role-based UI decisions.
 * Does NOT redirect — use RouteGuard for route-level protection.
 *
 * Usage:
 *   const { can, canDelete, role } = useRoleGuard();
 *   if (can("cases:create")) { ... }
 */
export function useRoleGuard() {
  const { profile } = useAuth();
  const role = (profile?.role ?? "clerk") as UserRole;
  const rank = ROLE_RANK[role] ?? 1;

  return {
    role,
    /** Primary permission checker: can("cases:create") */
    can: (action: PermissionAction) => can(role, action),
    /** true for super_admin and admin */
    isAdminOrAbove:      rank >= ROLE_RANK.admin,
    /** true for super_admin only */
    isSuperAdmin:        role === "super_admin",
    /** true for lawyer and above */
    isLawyerOrAbove:     rank >= ROLE_RANK.lawyer,
    /** Can insert/update cases and clients */
    canWrite:            can(role, "cases:create"),
    /** Can delete records */
    canDelete:           can(role, "cases:delete"),
    /** Can delete documents */
    canDeleteDocuments:  can(role, "documents:delete"),
    /** Can manage users */
    canManageUsers:      can(role, "settings:users"),
    /** Generic check */
    hasRole:             (r: UserRole) => role === r,
    atLeast:             (r: UserRole) => rank >= (ROLE_RANK[r] ?? 1),
  };
}

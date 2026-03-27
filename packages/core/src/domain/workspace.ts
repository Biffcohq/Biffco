import type { WorkspaceId, WorkspaceMemberId, TeamId, EmployeeId } from '@biffco/shared'

export type WorkspaceMemberStatus = "active" | "suspended" | "revoked"

export interface WorkspaceMember {
  readonly id: WorkspaceMemberId
  readonly workspaceId: WorkspaceId
  readonly personId: string // FK a persons
  readonly publicKey: string // Ed25519 public key hex
  readonly roles: readonly string[]
  readonly status: WorkspaceMemberStatus
  readonly invitedAt: Date
  readonly acceptedAt: Date | null
  readonly revokedAt: Date | null
}

export interface Team {
  readonly id: TeamId
  readonly workspaceId: WorkspaceId
  readonly name: string
  readonly description: string | null
  readonly memberIds: readonly WorkspaceMemberId[]
}

export interface Employee {
  readonly id: EmployeeId
  readonly workspaceId: WorkspaceId
  readonly name: string
  readonly role: string
  readonly dni: string | null
  readonly supervisorId: WorkspaceMemberId
  readonly memberId: WorkspaceMemberId | null
  readonly isActive: boolean
}

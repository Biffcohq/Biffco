import type { EventId, AssetId, WorkspaceMemberId, WorkspaceId, EmployeeId } from '@biffco/shared';
export interface DomainEvent {
    readonly id: EventId;
    readonly type: string;
    readonly schemaVersion: number;
    readonly assetId: AssetId;
    readonly workspaceId: WorkspaceId;
    readonly actorId: WorkspaceMemberId;
    readonly employeeId: EmployeeId | null;
    readonly signature: string;
    readonly publicKey: string;
    readonly occurredAt: Date;
    readonly createdAt: Date;
    readonly correlationId: string | null;
    readonly payload: Readonly<Record<string, unknown>>;
}
export interface SignableEventPayload {
    readonly type: string;
    readonly schemaVersion: number;
    readonly assetId: string;
    readonly workspaceId: string;
    readonly actorId: string;
    readonly occurredAt: string;
    readonly payload: Record<string, unknown>;
}
//# sourceMappingURL=event.d.ts.map
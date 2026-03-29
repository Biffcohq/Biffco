import type { AssetId, AssetGroupId, WorkspaceMemberId, WorkspaceId, PenId } from '@biffco/shared';
export type AssetStatus = "active" | "in_transit" | "in_process" | "locked" | "quarantine" | "closed" | "recalled" | "stolen" | "lost";
export interface Asset {
    readonly id: AssetId;
    readonly type: string;
    readonly status: AssetStatus;
    readonly workspaceId: WorkspaceId;
    readonly verticalId: string;
    readonly ownerId: WorkspaceMemberId;
    readonly custodianId: WorkspaceMemberId | null;
    readonly payload: Readonly<Record<string, unknown>>;
    readonly parentIds: readonly AssetId[];
    readonly currentPenId: PenId | null;
    readonly currentGroupId: AssetGroupId | null;
    readonly externalId: string | null;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly closedAt: Date | null;
}
export type AssetGroupType = 'group' | 'split_output' | 'merge_output' | 'transform_output' | 'transfer' | 'export';
export type AssetGroupStatus = 'forming' | 'active' | 'dissolved' | 'in_transit' | 'delivered';
export interface AssetGroup {
    readonly id: AssetGroupId;
    readonly workspaceId: WorkspaceId;
    readonly name: string;
    readonly type: AssetGroupType;
    readonly status: AssetGroupStatus;
    readonly metadata: Readonly<Record<string, unknown>>;
    readonly createdAt: Date;
    readonly dissolvedAt: Date | null;
}
//# sourceMappingURL=asset.d.ts.map
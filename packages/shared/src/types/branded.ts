// ─── Tipo genérico para crear branded types ──────────────────────
type Brand<T, B extends string> = T & { readonly _brand: B }

// ─── Función para crear valores del tipo ─────────────────────────
// En producción se usa directamente el string, pero el tipo garantiza
// que no se puede confundir un ID con otro.
export const brand = <T extends string>(value: string): Brand<string, T> =>
  value as Brand<string, T>

// ─── Todos los branded types del dominio ─────────────────────────
export type WorkspaceId = Brand<string, "WorkspaceId">
export type WorkspaceMemberId = Brand<string, "WorkspaceMemberId">
export type TeamId = Brand<string, "TeamId">
export type EmployeeId = Brand<string, "EmployeeId">
export type AssetId = Brand<string, "AssetId">
export type AssetGroupId = Brand<string, "AssetGroupId">
export type EventId = Brand<string, "EventId">
export type FacilityId = Brand<string, "FacilityId">
export type ZoneId = Brand<string, "ZoneId">
export type PenId = Brand<string, "PenId">
export type TransferOfferId = Brand<string, "TransferOfferId">
export type AnchorId = Brand<string, "AnchorId">
export type CertificationId = Brand<string, "CertificationId">

// ─── Constructores tipados ────────────────────────────────────────
export const WorkspaceId = (v: string) => brand<'WorkspaceId'>(v)
export const WorkspaceMemberId = (v: string) => brand<'WorkspaceMemberId'>(v)
export const TeamId = (v: string) => brand<'TeamId'>(v)
export const EmployeeId = (v: string) => brand<'EmployeeId'>(v)
export const AssetId = (v: string) => brand<'AssetId'>(v)
export const AssetGroupId = (v: string) => brand<'AssetGroupId'>(v)
export const EventId = (v: string) => brand<'EventId'>(v)
export const FacilityId = (v: string) => brand<'FacilityId'>(v)
export const ZoneId = (v: string) => brand<'ZoneId'>(v)
export const PenId = (v: string) => brand<'PenId'>(v)
export const TransferOfferId = (v: string) => brand<'TransferOfferId'>(v)
export const AnchorId = (v: string) => brand<'AnchorId'>(v)
export const CertificationId = (v: string) => brand<'CertificationId'>(v)

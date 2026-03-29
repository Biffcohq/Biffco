# Contratos tRPC de Fase B

Este documento define los contratos iniciales acordados entre Backend (Tech Lead) y Frontend (Frontend Dev) para evitar bloqueos durante el Sprint B.1 y B.2 de la Fase B. Estos contratos se enfocan principalmente en los routers `assets`, `events`, y `upload`.

## 1. assets.list
**Uso:** Dashboard Operations (`/assets`), listado y tabla de activos.
**Input (Filtros Opcionales):**
```typescript
{
  status?: string[],
  type?: string,
  penId?: string,
  groupId?: string,
  externalId?: string,
  text?: string,
  cursor?: string,
  limit?: number
}
```
**Output (`Asset[]` paginado):**
```typescript
{
  items: [
    {
      id: "ast_123",
      type: "AnimalAsset", // Definido en VerticalPack
      status: "active",
      ownerId: "mem_abc", // ID del WorkspaceMember
      custodianId: null,
      workspaceId: "ws_xyz",
      verticalId: "livestock",
      payload: { ... }, // Data dinámica
      parentIds: [],
      currentPenId: "pen_def",
      currentGroupId: null,
      externalId: "AR-2024-001"
    }
  ],
  nextCursor: "cursor_string_or_null"
}
```

## 2. assets.getById
**Uso:** Vista detallada de un activo (`/assets/[id]`).
**Input:**
```typescript
{
  id: string
}
```
**Output:**
```typescript
{
  asset: { /* Formato Asset (ver assets.list) */ },
  events: [ /* Últimos N eventos para preview */ ],
  ancestors: [ /* Info de linaje básico para DAGVisualizer */ ]
}
```

## 3. events.append
**Uso:** Mutación general para registrar un evento firmado por el actor.
**Input (Evento Firmado):**
```typescript
{
  type: string,
  schemaVersion: number,
  assetId: string,
  occurredAt: string, // ISO 8601
  payload: Record<string, unknown>,
  signature: string, // Ed25519 signature hex
  publicKey: string, // Ed25519 public key hex
  employeeId?: string,
  correlationId?: string
}
```
**Output:**
```typescript
{
  id: "evt_789",
  type: "...",
  // ... resto del DomainEvent registrado
  createdAt: "..."
}
```

## 4. upload.getSignedUrl
**Uso:** Obtener presigned URL de S3 al subir evidencia (Componente `EvidenceUploader`).
**Input:**
```typescript
{
  filename: string, // ej: "certificado.pdf"
  mimeType: string,
  sizeBytes: number,
  sha256: string // Calculado client-side
}
```
**Output:**
```typescript
{
  signedUrl: "https://biffco-evidence-...", 
  key: "ws_xyz/12345-certificado.pdf"
}
```

## 5. upload.confirmUpload
**Uso:** Confirmar que la evidencia ya fue subida y encolar a ClamAV.
**Input:**
```typescript
{
  key: string,
  sha256: string
}
```
**Output:**
```typescript
{
  key: "ws_xyz/12345-certificado.pdf",
  status: "scanning" | "ready"
}
```

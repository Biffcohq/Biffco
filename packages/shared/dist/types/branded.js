"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CertificationId = exports.AnchorId = exports.TransferOfferId = exports.PenId = exports.ZoneId = exports.FacilityId = exports.EventId = exports.AssetGroupId = exports.AssetId = exports.EmployeeId = exports.TeamId = exports.WorkspaceMemberId = exports.WorkspaceId = exports.brand = void 0;
// ─── Función para crear valores del tipo ─────────────────────────
// En producción se usa directamente el string, pero el tipo garantiza
// que no se puede confundir un ID con otro.
const brand = (value) => value;
exports.brand = brand;
// ─── Constructores tipados ────────────────────────────────────────
const WorkspaceId = (v) => (0, exports.brand)(v);
exports.WorkspaceId = WorkspaceId;
const WorkspaceMemberId = (v) => (0, exports.brand)(v);
exports.WorkspaceMemberId = WorkspaceMemberId;
const TeamId = (v) => (0, exports.brand)(v);
exports.TeamId = TeamId;
const EmployeeId = (v) => (0, exports.brand)(v);
exports.EmployeeId = EmployeeId;
const AssetId = (v) => (0, exports.brand)(v);
exports.AssetId = AssetId;
const AssetGroupId = (v) => (0, exports.brand)(v);
exports.AssetGroupId = AssetGroupId;
const EventId = (v) => (0, exports.brand)(v);
exports.EventId = EventId;
const FacilityId = (v) => (0, exports.brand)(v);
exports.FacilityId = FacilityId;
const ZoneId = (v) => (0, exports.brand)(v);
exports.ZoneId = ZoneId;
const PenId = (v) => (0, exports.brand)(v);
exports.PenId = PenId;
const TransferOfferId = (v) => (0, exports.brand)(v);
exports.TransferOfferId = TransferOfferId;
const AnchorId = (v) => (0, exports.brand)(v);
exports.AnchorId = AnchorId;
const CertificationId = (v) => (0, exports.brand)(v);
exports.CertificationId = CertificationId;
//# sourceMappingURL=branded.js.map
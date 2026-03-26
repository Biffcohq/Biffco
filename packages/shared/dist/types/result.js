"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapResult = exports.isErr = exports.isOk = exports.err = exports.ok = void 0;
// ─── Constructores ───────────────────────────────────────────────
const ok = (value) => ({ ok: true, value });
exports.ok = ok;
const err = (error) => ({ ok: false, error });
exports.err = err;
// ─── Helpers ─────────────────────────────────────────────────────
const isOk = (r) => r.ok === true;
exports.isOk = isOk;
const isErr = (r) => r.ok === false;
exports.isErr = isErr;
// ─── Mapear el value si es Ok ────────────────────────────────────
const mapResult = (result, fn) => result.ok ? (0, exports.ok)(fn(result.value)) : result;
exports.mapResult = mapResult;
//# sourceMappingURL=result.js.map
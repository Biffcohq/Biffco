"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashDocument = hashDocument;
const crypto_1 = require("crypto");
/** Helper: hash SHA-256 de un Buffer (para evidencias S3) */
function hashDocument(buffer) {
    return (0, crypto_1.createHash)("sha256").update(buffer).digest("hex");
}
//# sourceMappingURL=hash.js.map
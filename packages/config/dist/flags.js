"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFlag = exports.flags = void 0;
const env_1 = require("./env");
exports.flags = {
    // Habilitado solo en dev para mostrar información de debug
    DEBUG_MODE: env_1.env.NODE_ENV === "development",
    // Blockchain: en dev usar mock, en staging/prod usar Polygon Amoy
    BLOCKCHAIN_ENABLED: env_1.env.NODE_ENV !== "development",
    // Email: en dev logear en consola, en staging/prod usar Resend
    EMAIL_PROVIDER: env_1.env.NODE_ENV === "development" ? "console" : "resend",
};
const getFlag = (key) => exports.flags[key];
exports.getFlag = getFlag;
//# sourceMappingURL=flags.js.map
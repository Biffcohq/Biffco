"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const drizzle_kit_1 = require("drizzle-kit");
const config_1 = require("@biffco/config");
exports.default = (0, drizzle_kit_1.defineConfig)({
    schema: './src/schema/index.ts',
    out: './src/migrations',
    dialect: 'postgresql',
    dbCredentials: {
        url: config_1.env.DATABASE_URL_UNPOOLED
    },
    verbose: true,
    strict: true
});
//# sourceMappingURL=drizzle.config.js.map
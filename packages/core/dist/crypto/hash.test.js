"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const hash_1 = require("./hash");
const buffer_1 = require("buffer");
(0, vitest_1.describe)("Hash SHA-256", () => {
    (0, vitest_1.it)("hashea el buffer consistentemente", () => {
        const buffer = buffer_1.Buffer.from("hello world");
        const hash = (0, hash_1.hashDocument)(buffer);
        (0, vitest_1.expect)(hash).toBe("b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9");
    });
});
//# sourceMappingURL=hash.test.js.map
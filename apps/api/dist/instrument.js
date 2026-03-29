"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const Sentry = __importStar(require("@sentry/node"));
const config_1 = require("@biffco/config");
if (config_1.env.SENTRY_DSN) {
    Sentry.init({
        dsn: config_1.env.SENTRY_DSN,
        environment: config_1.env.NODE_ENV,
        tracesSampleRate: config_1.env.NODE_ENV === "production" ? 0.1 : 1.0,
        beforeSend(event) {
            if (config_1.env.NODE_ENV === "development") {
                console.warn("[Sentry DEV Mock] Event captured: ", event.exception);
                return null; // NUNCA enviar a Sentry en dev local
            }
            return event;
        }
    });
}
else {
    console.warn("[Sentry] No DSN provided. Error tracking disabled.");
}
//# sourceMappingURL=instrument.js.map
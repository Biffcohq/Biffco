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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = sendEmail;
/* global console */
const react_1 = __importDefault(require("react"));
const resend_1 = require("resend");
const config_1 = require("@biffco/config");
const resendReady = !!config_1.env.RESEND_API_KEY;
const resend = resendReady ? new resend_1.Resend(config_1.env.RESEND_API_KEY) : null;
__exportStar(require("./templates/InvitationEmail"), exports);
__exportStar(require("./templates/WelcomeEmail"), exports);
__exportStar(require("./templates/HoldAlertEmail"), exports);
__exportStar(require("./templates/DTEExpiryEmail"), exports);
__exportStar(require("./templates/TransferOfferEmail"), exports);
async function sendEmail({ to, subject, component, props }) {
    const { render } = await import('@react-email/render');
    const html = await render(react_1.default.createElement(component, props));
    if (!resendReady || !resend) {
        console.info("[Email Mock] sendEmail called but RESEND_API_KEY is missing. Mock sent:", { to, subject });
        return { id: "mock-id-1234" };
    }
    return resend.emails.send({
        from: "BIFFCO <noreply@biffco.co>",
        to,
        subject,
        html
    });
}
//# sourceMappingURL=index.js.map
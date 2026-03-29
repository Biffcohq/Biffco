"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvitationEmail = InvitationEmail;
const jsx_runtime_1 = require("react/jsx-runtime");
function InvitationEmail({ workspaceName, inviterName, verticalLabel, acceptUrl }) {
    return ((0, jsx_runtime_1.jsxs)("div", { style: { fontFamily: 'sans-serif', padding: '20px' }, children: [(0, jsx_runtime_1.jsxs)("h1", { children: ["Invitaci\u00F3n a ", workspaceName] }), (0, jsx_runtime_1.jsx)("p", { children: "Hola," }), (0, jsx_runtime_1.jsxs)("p", { children: [inviterName, " te ha invitado a unirte a ", (0, jsx_runtime_1.jsx)("strong", { children: workspaceName }), " en la plataforma BIFFCO (", verticalLabel, ")."] }), (0, jsx_runtime_1.jsx)("a", { href: acceptUrl, style: { background: '#000', color: '#fff', padding: '10px 20px', textDecoration: 'none', borderRadius: '5px' }, children: "Aceptar Invitaci\u00F3n" }), (0, jsx_runtime_1.jsx)("p", { style: { marginTop: '20px', color: '#666', fontSize: '12px' }, children: "El enlace expirar\u00E1 en 72 horas." })] }));
}
//# sourceMappingURL=InvitationEmail.js.map
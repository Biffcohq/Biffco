import type { SignableEventPayload } from '../domain/event';
/**
 * Firma el payload de un evento con una clave privada Ed25519.
 *
 * Lo que se firma: canonicalJson(payload) — siempre el mismo string
 * para el mismo payload, independientemente del orden de las keys.
 *
 * @returns signature en formato hex
 */
export declare function signEvent(payload: SignableEventPayload, privateKey: Uint8Array): Promise<string>;
/**
 * Verifica la firma Ed25519 de un evento.
 *
 * @returns true si la firma es válida, false en cualquier otro caso
 * NUNCA lanza una excepción — siempre retorna un boolean.
 */
export declare function verifyEvent(payload: SignableEventPayload, signatureHex: string, publicKeyHex: string): Promise<boolean>;
//# sourceMappingURL=ed25519.d.ts.map
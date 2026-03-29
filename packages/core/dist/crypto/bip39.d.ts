import type { Buffer } from 'buffer';
/**
 * Genera un mnemonic BIP-39 de 24 palabras.
 *
 * SEGURIDAD: Esta función SOLO se llama en el browser durante el signup.
 * NUNCA se llama en apps/api ni en ningún servidor.
 * NUNCA se almacena el mnemonic en la DB ni en ningún log.
 *
 * El mnemonic se muestra UNA SOLA VEZ al usuario.
 * Después de que el usuario confirma las 3 palabras, el mnemonic
 * se elimina de la memoria del browser.
 */
export declare function generateMnemonic(): string;
/**
 * Valida que un mnemonic tiene el formato correcto.
 */
export declare function isValidMnemonic(mnemonic: string): boolean;
/**
 * Convierte un mnemonic a seed para SLIP-0010.
 * Usado internamente por deriveKeyFromMnemonic en slip0010.ts.
 */
export declare function mnemonicToSeed(mnemonic: string): Buffer;
//# sourceMappingURL=bip39.d.ts.map
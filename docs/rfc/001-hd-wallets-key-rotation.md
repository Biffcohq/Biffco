# RFC 001: Implementación de Rotación de Billeteras HD (BIP32/44)

**Estado**: Pendiente / Backlog (Feature Futuro)
**Prioridad**: Media-Alta (Post-Lanzamiento Operativo)
**Autor**: Biffco Engineering

## 1. Contexto

Para garantizar el cumplimiento al 100% como arquitectura "Non-Custodial" (No custodia) bajo el paraguas normativo de la ley EUDR y regulaciones criptográficas, debemos implementar la **Derivación de Claves HD (Billeteras Jerárquicas Deterministas)** y el **Flujo de Rotación de Claves** para las cuentas de Biffco.

Actualmente (V1), un usuario genera su par de claves al hacer _Signup_, guardándose de forma unidireccional la **Clave Pública** en la tabla de Base de Datos `workspaceMembers`. Esto significa que cada persona tiene una clave por Workspace.

## 2. Problema

1. Si un usuario delega su acceso, u opera sobre 5 Workspaces diferentes, debe tener control granulado de sub-firmas sin arriesgar ni saturar su identidad central.
2. Si la llave actual o equipo de un usuario es vulnerado, debemos poder _revocar_ sus privilegios para firmar eventos de Cadena, manteniendo la historia pasada válida (Inmutabilidad), mientras le asignamos una nueva llave para transacciones futuras (Key Rotation).

## 3. Propuesta de Arquitectura HD

### Reestructuración de Base de Datos (Drizzle)
Se debe realizar una migración del paradigma de persistencia de identidades.
- **Tabla `persons`**: Requerirá sumarle una columna `rootPublicKey`. Esto representa la semilla principal de la identidad del usuario, y se usa como el punto de verdad primario de la persona ante el Hub Global.
- **Tabla `workspaceMembers`**: Modificará su semántica para pasar de guardar indiscriminadamente la llave pública total, a persistir la `derivedPublicKey`. 

### Derivación Local en el Cliente (Browser)
Siguiendo las librerías `@noble/ed25519` o derivadas para la gestión web3:
1. El usuario desbloquea su **Keystore** (almacenamiento encriptado de su Frase Semilla de 12/24 palabras) tipeando su `Password` temporal en el LocalStorage de su navegador.
2. El sistema, sin tocar red alguna, emite un *Path de derivación* (Ejemplo `m/44'/...'/1` para minería, `m/44'/...'/2` para ganadería).
3. Se firma el evento transaccional con la sub-clave privada derivada.

### Proceso de Key Rotation
1. El usuario accede al Panel de configuración global (`/settings/wallet`).
2. Tipea su Frase Semilla física real (sin conexión) para poder habilitar el mecanismo.
3. Se generan nuevas entropías para una nueva Master Seed.
4. Una transacción en red "Biffco Network Anchor" revoca la Root Key #1, registrando Root Key #2, alertando de inmediato a todos los admins de Workspace de que las firmas delegadas deben re-autorizarse manualmente con la Clave Derivada de Sub-red #2.

## 4. Workitems / Tareas

- [ ] Adaptar flujo signup para crear Local Keystore cifrado (PBKDF2/AES-GCM).
- [ ] Refactor del Drizzle schema (`drizzle-kit push / generate`).
- [ ] Implementar `@noble/ed25519` en helpers `lib/crypto`.
- [ ] Agregar pantallas de Recovery Mnemonic y Password Prompts en la vista Global `settings/wallet/page.tsx`.

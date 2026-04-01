"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadRouter = void 0;
const zod_1 = require("zod");
const trpc_1 = require("../trpc");
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const crypto_1 = require("crypto");
// Requerimos AWS Credentials inyectadas por Doppler o Env global.
const s3Client = new client_s3_1.S3Client({
    region: process.env.NEXT_PUBLIC_S3_REGION || 'us-east-1',
});
exports.uploadRouter = (0, trpc_1.router)({
    getSignedUrl: trpc_1.protectedProcedure
        .input(zod_1.z.object({
        filename: zod_1.z.string(),
        contentType: zod_1.z.string(),
        assetId: zod_1.z.string().optional(), // Metadata opcional si la evidencia se liga al activo de inmediato
    }))
        .mutation(async ({ input, ctx }) => {
        // 1. Verificación Crítica: Workspace Authorization
        const { workspaceId, userId } = ctx;
        if (!workspaceId) {
            throw new Error("Unauthorized Access to S3 Vault");
        }
        // 2. Generar Key Determinística e Inmutable (WORM pathing)
        // Path: <workspaceId>/<year-month>/<uuid>-<filename>
        const dateString = new Date().toISOString().slice(0, 7); // YYYY-MM
        const uniqueId = (0, crypto_1.randomUUID)();
        const sanitizedName = input.filename.replace(/[^a-zA-Z0-9.-]/g, '_');
        const fileKey = `${workspaceId}/${dateString}/${uniqueId}-${sanitizedName}`;
        const bucket = process.env.S3_BUCKET_NAME || 'biffco-vault-worm-fallback';
        // 3. Crear el Comando de Inserción
        const command = new client_s3_1.PutObjectCommand({
            Bucket: bucket,
            Key: fileKey,
            ContentType: input.contentType,
            Metadata: {
                uploaderId: userId,
                workspaceId: workspaceId,
                assetRef: input.assetId || 'none'
            }
        });
        // 4. Firmar la URL (TTL Corta de 10 minutos por Riesgo de Exfiltración)
        const signedUrl = await (0, s3_request_presigner_1.getSignedUrl)(s3Client, command, { expiresIn: 600 });
        return {
            url: signedUrl,
            key: fileKey,
            expiresInSecs: 600
        };
    }),
});
//# sourceMappingURL=upload.js.map
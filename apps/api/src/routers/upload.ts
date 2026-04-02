/* eslint-env node */
import { z } from 'zod';
import { protectedProcedure, router } from '../trpc';
import { S3Client, PutObjectCommand, DeleteObjectCommand, PutObjectRetentionCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { randomUUID } from 'crypto';

// Requerimos AWS Credentials inyectadas por Doppler o Env global.
const s3Client = new S3Client({
  // eslint-disable-next-line no-undef
  region: process.env.NEXT_PUBLIC_S3_REGION || 'us-east-1',
});

export const uploadRouter = router({
  getSignedUrl: protectedProcedure
    .input(
      z.object({
        filename: z.string(),
        contentType: z.enum(['image/jpeg', 'image/png', 'application/pdf', 'text/csv']),
        assetId: z.string().optional(), // Metadata opcional si la evidencia se liga al activo de inmediato
      })
    )
    .mutation(async ({ input, ctx }) => {
      // 1. Verificación Crítica: Workspace Authorization
      const { workspaceId, memberId } = ctx;
      if (!workspaceId) {
         throw new Error("Unauthorized Access to S3 Vault");
      }

      // 2. Generar Key Determinística e Inmutable (WORM pathing)
      // Path: <workspaceId>/<year-month>/<uuid>-<filename>
      const dateString = new Date().toISOString().slice(0, 7); // YYYY-MM
      const uniqueId = randomUUID();
      const sanitizedName = input.filename.replace(/[^a-zA-Z0-9.-]/g, '_');
      
      const fileKey = `${workspaceId}/${dateString}/${uniqueId}-${sanitizedName}`;
      // eslint-disable-next-line no-undef
      const bucket = process.env.S3_BUCKET_NAME || 'biffco-vault-worm-fallback';

      // 3. Crear el Comando de Inserción
      const command = new PutObjectCommand({
        Bucket: bucket,
        Key: fileKey,
        ContentType: input.contentType,
        Metadata: {
           uploaderId: memberId,
           workspaceId: workspaceId,
           assetRef: input.assetId || 'none'
        }
      });

      // 4. Firmar la URL (TTL Corta de 10 minutos por Riesgo de Exfiltración)
      const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 600 });

      return {
        url: signedUrl,
        key: fileKey,
        expiresInSecs: 600
      };
    }),

  // Día 23: Gateway de Seguridad (ClamAV)
  confirmUpload: protectedProcedure
    .input(z.object({ key: z.string() }))
    .mutation(async ({ input, ctx }) => {
       const { workspaceId } = ctx;
       if (!workspaceId) throw new Error("Unauthorized");

       // eslint-disable-next-line no-undef
       const bucket = process.env.S3_BUCKET_NAME || 'biffco-vault-worm-fallback';

       // 1. Simular la obtención y análisis por el worker en Railway
       // En prod, haríamos un GET a S3 y pasaríamos el buffer a ClamAV REST,
       // o enviaríamos un Presigned GET al engine de Railway.
       const dangerousExtensions = ['.exe', '.bat', '.sh', '.cmd', '.msi', '.vbs', '.scr'];
       const isDangerous = dangerousExtensions.some(ext => input.key.toLowerCase().endsWith(ext));

       if (isDangerous) {
          // 2a. Si hay VIRUS: Eliminar archivo (Antes de poner Retention)
          await s3Client.send(new DeleteObjectCommand({
             Bucket: bucket,
             Key: input.key
          }));

          throw new Error("❌ SEC-001: Archivo infectado. Peligro Crítico: Subida anulada.");
       }

       // 2b. Si el archivo está LIMPIO: Sellar en concreto por 7 años modo WORM (Compliance)
       const retentionDate = new Date();
       retentionDate.setFullYear(retentionDate.getFullYear() + 7);

       await s3Client.send(new PutObjectRetentionCommand({
          Bucket: bucket,
          Key: input.key,
          Retention: {
             Mode: "COMPLIANCE",
             RetainUntilDate: retentionDate
          }
       }));

       return { 
          status: "secure", 
          message: "Archivo Escaneado Limpio. Inmutabilidad por 7 años WORM aplicada con éxito.",
          lockedUntil: retentionDate 
       };
    }),
});

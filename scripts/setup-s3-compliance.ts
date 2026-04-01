import { S3Client, CreateBucketCommand, PutObjectLockConfigurationCommand, DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";

/**
 * BIFFCO™ Phase B.3 - AWS S3 WORM Setup (Write-Once-Read-Many)
 * =============================================================
 * Este script aprovisiona automáticamente tu Bucket en modo radical COMPLIANCE. 
 * Cualquier archivo (evidencia) subido aquí es IMBORRABLE hasta el año 2033 (7 años),
 * garantizando auditorías infalibles y cero manipulaciones de base de datos.
 * 
 * Requisitos: 
 * Debes tener tus credenciales en el entorno o en Doppler antes de correrlo.
 * aws configure (export AWS_ACCESS_KEY_ID=... export AWS_SECRET_ACCESS_KEY=...)
 */

const REGION = process.env.AWS_REGION || "us-east-1";
const BUCKET_NAME = `biffco-vault-worm-${Date.now()}`; // Nombre único global

const s3 = new S3Client({ region: REGION });

async function run() {
  console.log(`[1/4] 🚀 Iniciando Aprovisionamiento de Infraestructura WORM para Biffco...`);
  console.log(`      Región seleccionada: ${REGION}`);
  
  try {
    // 1. Crear Bucket con ObjectLockEntryActivado (Obligatorio crear con flag prendido)
    console.log(`[2/4] 📦 Creando bucket inmutable: ${BUCKET_NAME}`);
    await s3.send(
      new CreateBucketCommand({
        Bucket: BUCKET_NAME,
        ObjectLockEnabledForBucket: true,
      })
    );
    console.log(`      ✅ Bucket WORM Creado.`);

    // 2. Imponer la Regla de Object Lock (Compliance Mode a 7 Años)
    console.log(`[3/4] 🔒 Enganchando la Regla Global "Object Lock COMPLIANCE 7-Years"...`);
    await s3.send(
      new PutObjectLockConfigurationCommand({
        Bucket: BUCKET_NAME,
        ObjectLockConfiguration: {
          ObjectLockEnabled: "Enabled",
          Rule: {
            DefaultRetention: {
              Mode: "COMPLIANCE",
              Years: 7, 
            },
          },
        },
      })
    );
    console.log(`      ✅ ¡Modo Compliance activo! Ni siquiera el Root de la cuenta de AWS podrá borrar evidencias subidas.`);

    // 3. Prueba de Fuego (Validar el "Shield" imborrable)
    console.log(`[4/4] 🛡️ Verificando "Delete Shield". Subiendo Test Evidence...`);
    const testKey = "system/worm-validation-test.txt";
    await s3.send(
      new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: testKey,
        Body: "BIFFCO_WORM_TEST_PAYLOAD",
      })
    );
    
    try {
      console.log(`      Intentando hackear/borrar la evidencia... 🪓`);
      await s3.send(
        new DeleteObjectCommand({
          Bucket: BUCKET_NAME,
          Key: testKey,
        })
      );
      // Nunca debería llegar aquí
      console.error(`      ❌ ERROR FATAL: El archivo se pudo eliminar. El modo WORM está roto.`);
      process.exit(1);
    } catch (err: any) {
      if (err.name === 'AccessDenied' || err.name === 'MethodNotAllowed' || err.message.includes("AccessDenied")) {
         console.log(`      ✅ ¡Hack Frustrado Correctamente! AWS escupió error: "${err.name}". El WORM es de Titanio.`);
      } else {
         console.log(`      ⚠️ Error inesperado pero el borrado falló: ${err.message}`);
      }
    }

    console.log(`\n======================================================`);
    console.log(`✅ APROVISIONAMIENTO FINALIZADO EXITOSAMENTE`);
    console.log(`======================================================`);
    console.log(`Por favor, copia este valor y guárdalo en tu bóveda de DOPPLER:`);
    console.log(`=> S3_BUCKET_NAME=${BUCKET_NAME}`);
    console.log(`=> NEXT_PUBLIC_S3_REGION=${REGION}`);
    console.log(`======================================================`);

  } catch (error: any) {
    console.error(`\n❌ Error Crítico aprovisionando el Bucket:`, error.message);
    console.log(`💡 ¿Tienes tus credenciales AWS_ACCESS_KEY_ID configuradas en tu consola?`);
  }
}

run();

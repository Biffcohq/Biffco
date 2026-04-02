'use client';

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { IconFileUp, IconShieldCheck, IconShieldExclamation, IconLoader2, IconFile, IconCheckCircle2 } from '@tabler/icons-react';
import { Button } from './Button';

// Utility para hashear en el Edge/Browser de manera nativa sin dependencias pesadas
async function calculateSHA256(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

export interface EvidenceUploaderProps {
  /** Callback para solicitar la URL firmada de S3 al backend TRPC */
  onRequestSignedUrl: (filename: string, contentType: string) => Promise<{ url: string; key: string }>;
  /** Callback para confirmar con ClamAV una vez subido a S3 */
  onConfirmUpload: (key: string) => Promise<{ status: string; message: string }>;
  /** Callback de éxito final para atarlo al Formulario o Tabla */
  onUploadSuccess?: (evidenceData: { key: string; sha256: string; filename: string }) => void;
  /** Callback de error general */
  onError?: (error: Error) => void;
  className?: string;
}

type UploadState = 'idle' | 'hashing' | 'uploading' | 'scanning' | 'success' | 'error';

export function EvidenceUploader({ 
  onRequestSignedUrl, 
  onConfirmUpload, 
  onUploadSuccess, 
  onError,
  className 
}: EvidenceUploaderProps) {
  const [state, setState] = useState<UploadState>('idle');
  const [progress, setProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [fileMeta, setFileMeta] = useState<{ name: string; size: number; hash?: string; } | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    try {
      setFileMeta({ name: file.name, size: file.size });
      
      // 1. Fase Criptográfica Local (WebCrypto API)
      setState('hashing');
      setProgress(10);
      const sha256 = await calculateSHA256(file);
      setFileMeta(prev => prev ? { ...prev, hash: sha256 } : null);
      
      // 2. Solicitud de Autenticación al Backend
      setProgress(20);
      const { url: signedUrl, key: s3Key } = await onRequestSignedUrl(file.name, file.type);

      // 3. Subida directa S3 WORM Bucket (Sin tocar el Backend Biffco Node)
      setState('uploading');
      setProgress(30);
      
      const xhr = new XMLHttpRequest();
      await new Promise<void>((resolve, reject) => {
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
             const percentComplete = 30 + (event.loaded / event.total) * 40; // Ocupa el 30% -> 70% del tramo
             setProgress(percentComplete);
          }
        };
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) resolve();
          else reject(new Error(`S3 Upload Failed with status ${xhr.status}`));
        };
        xhr.onerror = () => reject(new Error('S3 Network Error'));
        
        xhr.open('PUT', signedUrl, true);
        xhr.setRequestHeader('Content-Type', file.type);
        // Podríamos inyectar aquí el header x-amz-checksum-sha256 si estuviéramos usando ChecksumAlgorithm='SHA256'
        xhr.send(file);
      });

      // 4. Biffco Security Gateway (ClamAV)
      setState('scanning');
      setProgress(80);
      
      const scanResult = await onConfirmUpload(s3Key);
      
      if (scanResult.status === 'secure') {
         setProgress(100);
         setState('success');
         onUploadSuccess?.({ key: s3Key, sha256, filename: file.name });
      } else {
         throw new Error("SEC-002: Análisis de seguridad retornó status inseguro.");
      }

    } catch (e: any) {
      console.error("[EvidenceUploader] Flujo interceptado por error:", e);
      setState('error');
      setErrorMessage(e.message || 'Error desconocido durante la ingesta segura.');
      onError?.(e as Error);
    }
  }, [onRequestSignedUrl, onConfirmUpload, onUploadSuccess, onError]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    multiple: false,
    disabled: state !== 'idle' && state !== 'error'
  });

  return (
    <div className={`w-full max-w-md mx-auto rounded-xl border-2 ${isDragActive ? 'border-primary bg-primary/5' : 'border-dashed border-gray-300 dark:border-gray-700'} p-6 transition-all ${className || ''}`}>
      
      {state === 'idle' || state === 'error' ? (
        <div {...getRootProps()} className="flex flex-col items-center justify-center cursor-pointer text-center space-y-3">
          <input {...getInputProps()} />
          <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-full">
            <IconFileUp className="w-8 h-8 text-gray-500 dark:text-gray-400" />
          </div>
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {isDragActive ? "Suelta la evidencia aquí..." : "Arrastra tu Evidencia, o haz click"}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 max-w-[250px]">
            Imágenes o PDFs (Max 10MB). El archivo será hasheado (SHA-256) militarmente en tu navegador.
          </p>
          
          {state === 'error' && (
            <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs font-semibold rounded-lg flex items-start text-left gap-2 w-full">
              <IconShieldExclamation className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col w-full space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
               <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                 <IconFile className="w-6 h-6 text-blue-500" />
               </div>
               <div className="flex flex-col">
                  <span className="text-sm font-semibold truncate max-w-[200px] text-gray-800 dark:text-gray-200">
                    {fileMeta?.name}
                  </span>
                  <span className="text-xs text-gray-500">
                    {( (fileMeta?.size || 0) / 1024 / 1024 ).toFixed(2)} MB
                  </span>
               </div>
            </div>
            
            {state === 'success' ? (
               <IconCheckCircle2 className="w-6 h-6 text-green-500" />
            ) : (
               <IconLoader2 className="w-5 h-5 text-gray-400 animate-spin" />
            )}
          </div>

          <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2.5 overflow-hidden">
             <div 
               className={`h-2.5 rounded-full transition-all duration-300 ease-out ${state === 'success' ? 'bg-green-500' : 'bg-primary'}`} 
               style={{ width: `${progress}%` }}
             ></div>
          </div>

          <div className="flex flex-col gap-1 text-xs font-medium text-gray-600 dark:text-gray-400">
             <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  {state === 'hashing' && <>Calculando Hash SHA-256 (WebCrypto)...</>}
                  {state === 'uploading' && <>Transferencia Segura S3 WORM...</>}
                  {state === 'scanning' && <><IconShieldCheck className="w-3.5 h-3.5" /> Motor Biffco ClamAV Analizando...</>}
                  {state === 'success' && <strong className="text-green-600 dark:text-green-400">Certificación y WORM Bloqueo con Éxito</strong>}
                </span>
                <span>{Math.round(progress)}%</span>
             </div>
             
             {fileMeta?.hash && (
               <div className="mt-2 font-mono text-[10px] bg-gray-100 dark:bg-gray-800 p-2 rounded text-gray-500 break-all leading-relaxed">
                 SHA-256: {fileMeta.hash}
               </div>
             )}
          </div>

          {state === 'success' && (
            <Button onClick={() => {
              setState('idle');
              setProgress(0);
              setFileMeta(null);
            }} variant="outline" className="mt-2 w-full text-xs">
              Subir Nueva Evidencia
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

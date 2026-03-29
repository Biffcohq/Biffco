// @ts-nocheck
"use client"

import * as React from "react"
import { IconFileInvoice, IconAlertTriangle, IconFileCheck, IconEye } from "@tabler/icons-react"
import { cn } from "../lib/utils"
import { Badge } from "../components/Badge"
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from "../components/Dialog"

export type ClamAVStatus = "pending" | "clean" | "infected" | "unknown"

export interface EvidenceThumbProps extends React.HTMLAttributes<HTMLDivElement> {
  hash: string
  s3Key: string
  mimeType: string
  sizeBytes: number
  clamavStatus?: ClamAVStatus
  documentUrl?: string // Presigned URL to view the document
  filename?: string
}

export function EvidenceThumb({
  hash,
  s3Key,
  mimeType,
  sizeBytes,
  clamavStatus = "unknown",
  documentUrl,
  filename = "Documento",
  className,
  ...props
}: EvidenceThumbProps) {
  const shortHash = hash.slice(0, 8)
  const isImage = mimeType.startsWith("image/")
  const sizeKb = (sizeBytes / 1024).toFixed(1)

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div
          className={cn(
            "group relative flex w-64 cursor-pointer flex-col overflow-hidden rounded-lg border border-white/10 bg-zinc-950 transition-all hover:border-white/20 hover:bg-zinc-900",
            clamavStatus === "infected" && "border-red-500/50 bg-red-500/10 hover:border-red-500",
            className
          )}
          {...props}
        >
          {/* Top Bar with Status & Size */}
          <div className="flex items-center justify-between border-b border-white/5 bg-white/5 px-3 py-2">
            <div className="flex items-center gap-2">
              <IconFileInvoice size={14} className="text-zinc-400" />
              <span className="truncate text-xs font-medium text-zinc-300">
                {filename}
              </span>
            </div>
            <span className="text-[10px] text-zinc-500">{sizeKb} KB</span>
          </div>

          {/* Center Graphic */}
          <div className="flex flex-1 items-center justify-center p-6 text-zinc-600 group-hover:text-zinc-400">
            {clamavStatus === "infected" ? (
              <IconAlertTriangle size={32} className="text-red-500 opacity-50" />
            ) : isImage && documentUrl ? (
              <div 
                className="h-full w-full bg-cover bg-center bg-no-repeat opacity-50 group-hover:opacity-100 transition-opacity" 
                style={{ backgroundImage: `url(${documentUrl})` }} 
              />
            ) : (
              <IconFileInvoice size={32} />
            )}

            {/* Hover Overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
              <div className="flex items-center gap-2 rounded-full bg-primary/20 px-3 py-1.5 text-xs font-medium text-primary backdrop-blur-sm">
                <IconEye size={14} />
                Ver Documento
              </div>
            </div>
          </div>

          {/* Bottom Bar: Hash & Security */}
          <div className="flex items-center justify-between border-t border-white/5 bg-zinc-950 px-3 py-2">
            <code className="font-mono text-[10px] text-zinc-500" title={hash}>
              sha:{shortHash}
            </code>
            {clamavStatus === "clean" && (
              <Badge variant="green" className="px-1 py-0 h-4 text-[10px]">
                <IconFileCheck size={10} className="mr-1" />
                Seguro
              </Badge>
            )}
            {clamavStatus === "infected" && (
              <Badge variant="red" className="text-[10px] px-1 py-0 h-4">
                Infectado
              </Badge>
            )}
            {clamavStatus === "pending" && (
              <Badge variant="gray" className="text-[10px] opacity-70 px-1 py-0 h-4 bg-yellow-500/10 text-yellow-500">
                Escaneando...
              </Badge>
            )}
          </div>
        </div>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[700px] h-[80vh] flex flex-col p-0 overflow-hidden border-white/10 bg-zinc-950">
        <DialogHeader className="p-4 border-b border-white/10 bg-black/40">
          <DialogTitle className="flex items-center gap-2 text-zinc-200">
            <IconFileInvoice size={18} />
            {filename}
          </DialogTitle>
          <div className="flex items-center gap-4 text-xs text-zinc-500">
            <code className="font-mono">SHA256: {hash}</code>
            <span>•</span>
            <span>{sizeKb} KB</span>
            <span>•</span>
            <span>{mimeType}</span>
          </div>
        </DialogHeader>
        
        <div className="flex-1 overflow-auto bg-zinc-900 p-4 flex items-center justify-center">
          {clamavStatus === "infected" ? (
             <div className="text-center text-red-400">
               <IconAlertTriangle size={48} className="mx-auto mb-2 opacity-50" />
               <p>Este archivo no puede ser previsualizado porque fue detectado como peligroso.</p>
             </div>
          ) : documentUrl ? (
            isImage ? (
              <img src={documentUrl} alt={filename} className="max-w-full max-h-full object-contain rounded-md" />
            ) : mimeType === "application/pdf" ? (
              <iframe src={documentUrl} className="w-full h-full rounded-md border-0 bg-white" />
            ) : (
              <p className="text-zinc-400">No hay previsualización disponible para este tipo de archivo. <a href={documentUrl} target="_blank" rel="noreferrer" className="text-primary hover:underline">Descargar</a></p>
            )
          ) : (
            <p className="text-zinc-500 text-sm flex flex-col gap-2 items-center">
              <IconEye size={32} className="opacity-50" />
              Documento no disponible (URL expirada o no generada)
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

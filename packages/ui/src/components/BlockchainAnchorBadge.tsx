"use client"
import React from 'react'
import { ShieldCheck, ExternalLink } from 'lucide-react'

interface BlockchainAnchorBadgeProps {
  txHash: string
  network?: string
  timestamp?: Date
}

export function BlockchainAnchorBadge({ txHash, network = "Polygon Amoy", timestamp }: BlockchainAnchorBadgeProps) {
  const shortHash = `${txHash.slice(0, 6)}...${txHash.slice(-4)}`
  const explorerUrl = `https://amoy.polygonscan.com/tx/${txHash}`

  return (
    <div className="flex flex-col gap-2 rounded-lg border border-[#F2F4F7] bg-white p-4 shadow-sm dark:border-[#1F242F] dark:bg-[#0C111D]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-50 dark:bg-green-500/10">
            <ShieldCheck className="h-4 w-4 text-green-600 dark:text-green-500" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-[#101828] dark:text-[#F2F4F7]">Anclaje Criptográfico</h4>
            <p className="text-xs text-[#475467] dark:text-[#98A2B3]">Verificado en Blockchain Pública</p>
          </div>
        </div>
      </div>
      
      <div className="mt-2 rounded bg-[#F9FAFB] p-3 text-xs dark:bg-[#161B26]">
        <div className="flex items-center justify-between mb-1">
          <span className="font-medium text-[#475467] dark:text-[#98A2B3]">Red:</span>
          <span className="text-[#101828] dark:text-[#F2F4F7]">{network}</span>
        </div>
        <div className="flex items-center justify-between mb-1">
          <span className="font-medium text-[#475467] dark:text-[#98A2B3]">Fecha:</span>
          <span className="text-[#101828] dark:text-[#F2F4F7]">
            {timestamp ? new Intl.DateTimeFormat('es-AR', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(timestamp)) : 'Pendiente o Desconocida'}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-medium text-[#475467] dark:text-[#98A2B3]">Tx Hash:</span>
          <a 
            href={explorerUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-1 font-mono text-blue-600 hover:underline dark:text-blue-400"
          >
            {shortHash} <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
    </div>
  )
}

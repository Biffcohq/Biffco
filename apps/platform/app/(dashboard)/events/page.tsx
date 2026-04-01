/* eslint-disable @typescript-eslint/no-explicit-any, no-undef, @typescript-eslint/no-unused-vars */
"use client"

import React, { useState } from 'react'
import { trpc } from '@/lib/trpc'
import { IconFileCheck, IconSearch } from '@tabler/icons-react'
import { format } from 'date-fns'

export default function GlobalEventsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const { data: events, isLoading } = trpc.events.list.useQuery({ limit: 100 })

  const filteredEvents = events?.filter((e: any) => 
    !searchTerm || 
    e.eventType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.hash.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300 h-[calc(100vh-6rem)]">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6 shrink-0">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
            <IconFileCheck size={24} className="text-primary" />
            Eventos Globales (Log)
          </h1>
          <p className="text-text-secondary text-sm">Registro inmutable de toda la actividad operativa y registral del Workspace.</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between shrink-0 bg-surface p-4 rounded-xl border border-border shadow-sm">
        <div className="relative w-full sm:max-w-xs">
          <IconSearch size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input 
            type="text" 
            placeholder="Buscar por tipo o hash..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-bg border border-border rounded-md pl-9 pr-4 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
          />
        </div>
      </div>

      {/* Table Area */}
      <div className="flex-1 bg-surface border border-border rounded-xl shadow-sm overflow-hidden flex flex-col min-h-0">
        <div className="overflow-x-auto overflow-y-auto flex-1">
          <table className="w-full text-left text-sm text-text-secondary">
            <thead className="text-xs uppercase bg-surface-raised text-text-muted sticky top-0 border-b border-border z-10 font-bold">
              <tr>
                <th className="px-6 py-4 font-semibold tracking-wider">Fecha / Hora</th>
                <th className="px-6 py-4 font-semibold tracking-wider">Tipo (Evento)</th>
                <th className="px-6 py-4 font-semibold tracking-wider">Asset ID (Stream)</th>
                <th className="px-6 py-4 font-semibold tracking-wider">Tx Hash</th>
                <th className="px-6 py-4 font-semibold tracking-wider text-right">Payload</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4"><div className="h-4 bg-border/50 rounded w-24"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-border/50 rounded w-32"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-border/50 rounded w-20"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-border/50 rounded w-48"></div></td>
                    <td className="px-6 py-4"></td>
                  </tr>
                ))
              ) : filteredEvents?.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-text-muted">
                    Log vacío. Aún no se han firmado eventos en este espacio.
                  </td>
                </tr>
              ) : (
                filteredEvents?.map((evt: any) => (
                  <tr key={evt.id} className="hover:bg-surface-raised/50 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-text-primary">
                      {evt.createdAt ? format(new Date(evt.createdAt), "dd MMM, yyyy HH:mm:ss") : 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-text-primary px-2 py-1 bg-surface-raised border border-border rounded-md text-xs">{evt.eventType}</span>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-text-muted">
                      {evt.streamId}
                    </td>
                    <td className="px-6 py-4 font-mono text-[11px] text-text-muted">
                      {evt.hash}
                    </td>
                    <td className="px-6 py-4 text-right">
                       <button 
                         onClick={() => alert(JSON.stringify(evt.data, null, 2))}
                         className="text-xs text-primary hover:text-primary-hover font-medium underline underline-offset-2"
                        >
                          Ver JSON
                       </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

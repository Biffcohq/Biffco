/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-undef */
"use client"

import React, { useState } from 'react'
import { trpc } from '@/lib/trpc'
import { IconSearch, IconPlus, IconArrowRight, IconShape } from '@tabler/icons-react'
import Link from 'next/link'
import { format } from 'date-fns'
// @ts-ignore
import { Button, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, Input, Label, toast } from '@biffco/ui'

export default function GroupsPage({ params }: { params: { wsId: string } }) {
  const trpcUtils = trpc.useUtils()
  const [searchTerm, setSearchTerm] = useState('')
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [newGroupName, setNewGroupName] = useState('')

  // Query al router de Agrupaciones
  const { data: groups, isLoading } = trpc.assetGroups.getWithAssets.useQuery({
    verticalId: 'livestock' // hardcoded por ahora, asumimos Ganadería como vertical default en esta fase
  })

  const createMutation = trpc.assetGroups.create.useMutation({
    onSuccess: () => {
      toast.success("Agrupación creada exitosamente")
      setIsCreateOpen(false)
      setNewGroupName("")
      trpcUtils.assetGroups.getWithAssets.invalidate()
    },
    onError: (err: any) => toast.error(err.message || "Error al crear la agrupación")
  })

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newGroupName) return
    createMutation.mutate({ name: newGroupName, verticalId: 'livestock' })
  }

  const filteredGroups = groups?.filter((g: any) => 
    !searchTerm || 
    g.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    g.id.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300 h-[calc(100vh-6rem)]">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6 shrink-0">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
            <IconShape size={24} className="text-primary" />
            Agrupaciones (Lotes)
          </h1>
          <p className="text-text-secondary text-sm">Gestiona lotes, corrales o despachos para operar masivamente sobre tus activos.</p>
        </div>
        
        <div className="flex gap-3">
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button variant="primary">
                <IconPlus size={18} />
                Nuevo Lote
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Crear Agrupación / Lote</DialogTitle>
                <DialogDescription>
                  Inicia un nuevo contenedor logístico para agrupar activos físicos del workspace.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreate} className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name" className="text-text-primary">Nombre o Código del Lote</Label>
                  <Input 
                    id="name" 
                    placeholder="Ej. Corral Norte o Lote-A2" 
                    value={newGroupName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewGroupName(e.target.value)}
                    required
                  />
                </div>
                <DialogFooter className="mt-4">
                  <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)} disabled={createMutation.isPending}>
                    Cancelar
                  </Button>
                  <Button type="submit" variant="primary" disabled={createMutation.isPending || !newGroupName}>
                    {createMutation.isPending ? "Creando..." : "Crear Agrupación"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Toolbar: Filtros & Búsqueda */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between shrink-0 bg-surface p-4 rounded-xl border border-border shadow-sm">
        <div className="relative w-full sm:max-w-xs">
          <IconSearch size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input 
            type="text" 
            placeholder="Buscar por nombre..." 
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
                <th className="px-6 py-4 font-semibold tracking-wider">Nombre del Lote</th>
                <th className="px-6 py-4 font-semibold tracking-wider">ID Interno</th>
                <th className="px-6 py-4 font-semibold tracking-wider text-center">Cant. Activos</th>
                <th className="px-6 py-4 font-semibold tracking-wider">Creado</th>
                <th className="px-6 py-4 font-semibold tracking-wider text-right">Detalle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4"><div className="h-4 bg-border/50 rounded w-32"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-border/50 rounded w-24"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-border/50 rounded w-16 mx-auto"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-border/50 rounded w-32"></div></td>
                    <td className="px-6 py-4"></td>
                  </tr>
                ))
              ) : filteredGroups?.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-text-muted">
                    No hay agrupaciones creadas en este contexto.
                  </td>
                </tr>
              ) : (
                filteredGroups?.map((group: any) => (
                  <tr key={group.id} className="hover:bg-surface-raised/50 transition-colors group">
                    <td className="px-6 py-4 font-medium text-text-primary">
                      {group.name}
                    </td>
                    <td className="px-6 py-4 font-mono text-text-muted text-xs">
                      {group.id.split('-')[0]}...
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="font-mono bg-bg border border-border px-2 py-1 rounded text-xs">
                        {group.totalActive} / {group.assets?.length}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs">
                      {group.createdAt ? format(new Date(group.createdAt), "dd MMM, yyyy") : 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link 
                        href={`/${params.wsId}/groups/${group.id}`}
                        className="inline-flex items-center justify-center p-2 text-text-muted hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                        title="Gestionar este lote"
                      >
                        <IconArrowRight size={18} />
                      </Link>
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

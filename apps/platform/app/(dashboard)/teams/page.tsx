/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-undef */
"use client"

import React, { useState } from 'react'
import { trpc } from '@/lib/trpc'
import { IconUsersGroup, IconPlus, IconTrash } from '@tabler/icons-react'
// @ts-ignore
import { Skeleton, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, Button, Input, Label, toast, Card, Combobox, type ComboboxOption } from '@biffco/ui'

export default function TeamsPage() {
  const trpcUtils = trpc.useUtils()
  const { data: teams, isLoading: isLoadingTeams } = trpc.teams.list.useQuery()
  const { data: members, isLoading: isLoadingMembers } = trpc.workspaceMembers.list.useQuery()

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [newTeamName, setNewTeamName] = useState("")
  const [newTeamDesc, setNewTeamDesc] = useState("")

  const createMutation = trpc.teams.create.useMutation({
    onSuccess: () => {
      toast.success("Equipo creado exitosamente")
      setIsCreateOpen(false)
      setNewTeamName("")
      setNewTeamDesc("")
      trpcUtils.teams.list.invalidate()
    },
    onError: (err: any) => toast.error(err.message || "Error al crear equipo")
  })

  const deleteMutation = trpc.teams.delete.useMutation({
    onSuccess: () => {
      toast.success("Equipo eliminado")
      trpcUtils.teams.list.invalidate()
    },
    onError: (err: any) => toast.error(err.message || "Error al eliminar equipo")
  })

  const addMemberMutation = trpc.teams.addMember.useMutation({
    onSuccess: () => {
      trpcUtils.teams.list.invalidate()
    },
    onError: (err: any) => toast.error(err.message || "Error agregando miembro")
  })

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTeamName) return
    createMutation.mutate({ name: newTeamName, description: newTeamDesc })
  }

  const handleDelete = (id: string) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este equipo?")) {
      deleteMutation.mutate({ id })
    }
  }

  // Prepara opciones para combobox de miembros (solo activos)
  const memberOptions: ComboboxOption[] = members 
    ? members.filter((m: any) => m.status === 'active').map((m: any) => ({
        label: m.publicKey.slice(0,16) + '...',
        value: m.id
      }))
    : []

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold flex items-center gap-2 text-slate-900">
            <IconUsersGroup size={24} className="text-primary" />
            Equipos
          </h1>
          <p className="text-slate-500 text-sm">Organiza a los miembros de tu espacio en grupos lógicos.</p>
        </div>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-white hover:bg-primary-hover px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2 whitespace-nowrap">
              <IconPlus size={18} />
              Crear Equipo
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Equipo</DialogTitle>
              <DialogDescription>
                Los equipos te permiten agrupar miembros y asignarles tareas fácilmente.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreate} className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name" className="text-slate-900">Nombre del equipo</Label>
                <Input 
                  id="name" 
                  type="text"
                  placeholder="Ej. Veterinarios" 
                  value={newTeamName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewTeamName(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="desc" className="text-slate-900">Descripción (opcional)</Label>
                <Input 
                  id="desc" 
                  type="text"
                  placeholder="Responsables de auditorías" 
                  value={newTeamDesc}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewTeamDesc(e.target.value)}
                />
              </div>
              <DialogFooter className="mt-4">
                <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)} disabled={createMutation.isPending}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={createMutation.isPending || !newTeamName}>
                  {createMutation.isPending ? "Creando..." : "Crear Equipo"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {isLoadingTeams || isLoadingMembers ? (
          <>
            <Skeleton className="h-48 w-full rounded-xl bg-slate-50" />
            <Skeleton className="h-48 w-full rounded-xl bg-slate-50" />
            <Skeleton className="h-48 w-full rounded-xl bg-slate-50" />
          </>
        ) : teams?.length === 0 ? (
          <div className="col-span-full py-12 text-center rounded-lg border flex flex-col items-center justify-center bg-white border-slate-200">
            <IconUsersGroup size={48} className="text-slate-400 opacity-40 mb-4" />
            <h3 className="text-lg font-medium text-slate-900">No hay equipos aún</h3>
            <p className="text-slate-500 mt-1 max-w-sm">Crea tu primer equipo para organizar los miembros del espacio de trabajo.</p>
          </div>
        ) : teams?.map((team: any) => (
          <Card key={team.id} className="bg-white border border-slate-200 overflow-hidden flex flex-col shadow-sm">
            <div className="p-5 border-b border-slate-200 flex justify-between items-start bg-white">
              <div>
                <h3 className="font-semibold text-slate-900 text-lg">{team.name}</h3>
                <p className="text-slate-500 text-sm mt-1">{team.description || "Sin descripción"}</p>
              </div>
              <button onClick={() => handleDelete(team.id)} className="text-slate-400 hover:text-red-500 transition-colors">
                 <IconTrash size={18} />
              </button>
            </div>
            <div className="p-5 flex-1 bg-slate-50">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Miembros ({team.memberIds?.length || 0})</h4>
              
              {team.memberIds && team.memberIds.length > 0 ? (
                <ul className="space-y-2 mb-4">
                  {team.memberIds.map((mid: string) => {
                    const m = members?.find((x: any) => x.id === mid)
                    return (
                      <li key={mid} className="text-sm text-slate-500 flex items-center gap-2 font-medium">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                           {m ? m.publicKey.slice(0, 2).toUpperCase() : '?'}
                        </div>
                        {m ? m.publicKey.slice(0, 16) + '...' : mid}
                      </li>
                    )
                  })}
                </ul>
              ) : (
                <p className="text-sm text-slate-400 italic mb-4">No hay miembros en este equipo</p>
              )}
            </div>
            
            <div className="p-4 border-t border-slate-200 bg-white flex items-center gap-2">
              <Combobox 
                options={memberOptions.filter(o => !team.memberIds?.includes(o.value))} 
                placeholder="Seleccionar miembro..." 
                emptyText="Todos agregados"
                className="flex-1"
                onChange={(val: string | null) => {
                  if (val) addMemberMutation.mutate({ teamId: team.id, memberId: val })
                }}
              />
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

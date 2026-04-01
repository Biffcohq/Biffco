"use client"

import { trpc } from '@/lib/trpc'
import { IconUsers, IconUserPlus, IconSearch } from '@tabler/icons-react'
import { Skeleton } from '@/app/components/ui/Skeleton'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, Button, Input, Label, toast } from '@biffco/ui'
import { useState } from 'react'

export default function MembersPage() {
  const trpcUtils = trpc.useUtils()
  const { data: members, isLoading } = trpc.workspaceMembers.list.useQuery()
  const inviteMutation = trpc.workspaceMembers.invite.useMutation({
    onSuccess: () => {
      toast.success("Invitación enviada exitosamente")
      setIsInviteOpen(false)
      setInviteEmail("")
      trpcUtils.workspaceMembers.list.invalidate()
    },
    onError: (err) => {
      toast.error(err.message || "Error al enviar la invitación")
    }
  })

  const [isInviteOpen, setIsInviteOpen] = useState(false)
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteRole, setInviteRole] = useState("member")

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inviteEmail) return
    inviteMutation.mutate({
      email: inviteEmail,
      roles: [inviteRole]
    })
  }

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
            <IconUsers size={24} className="text-primary" />
            Equipo (Members)
          </h1>
          <p className="text-text-secondary text-sm">Gestiona los miembros y permisos de tu espacio de trabajo.</p>
        </div>
          <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
            <DialogTrigger asChild>
              <button className="whitespace-nowrap">
                <IconUserPlus size={18} />
                Invitar Miembro
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Invitar al Equipo</DialogTitle>
                <DialogDescription>
                  Ingresa el correo electrónico del usuario que deseas invitar a Biffco.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleInvite} className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="email" className="text-text-primary]">Correo electrónico</Label>
                  <Input 
                    id="email" 
                    type="email"
                    placeholder="ejemplo@organizacion.com" 
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="role" className="text-text-primary]">Rol asignado</Label>
                  <select 
                    id="role"
                    className="flex h-10 w-full rounded-md border border-border] bg-[var(--color-surface)] px-3 py-2 text-sm text-text-primary] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/50] disabled:cursor-not-allowed disabled:opacity-50"
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value)}
                  >
                    <option value="member">Miembro Operativo</option>
                    <option value="admin">Administrador</option>
                    <option value="auditor">Auditor (Solo lectura)</option>
                  </select>
                </div>
                <DialogFooter className="mt-4">
                  <Button type="button" variant="outline" onClick={() => setIsInviteOpen(false)} disabled={inviteMutation.isPending}>
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={inviteMutation.isPending || !inviteEmail}>
                    {inviteMutation.isPending ? "Enviando..." : "Enviar Invitación"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
      </div>

      {/* Main Content Area */}
      <div className="bg-surface border border-border rounded-xl shadow-sm flex flex-col overflow-hidden">
        {/* Table Top Toolbar */}
        <div className="p-4 border-b border-border border-dashed bg-surface-raised flex items-center justify-between gap-4">
          <div className="relative w-full max-w-sm">
            <IconSearch size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input 
              type="text" 
              placeholder="Buscar por nombre o email..." 
              className="w-full bg-surface border border-border text-sm rounded-md pl-9 pr-4 py-2 focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 text-text-primary transition-all placeholder:text-text-muted"
            />
          </div>
          <div className="text-sm text-text-secondary font-medium whitespace-nowrap">
            {isLoading ? <Skeleton className="h-4 w-20" /> : `${members?.length || 0} Miembros totales`}
          </div>
        </div>

        {/* Table List */}
        <div className="overflow-x-auto min-h-[300px]">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-surface-raised border-b border-border text-text-secondary text-xs uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-6 py-3">Usuario (ID)</th>
                <th className="px-6 py-3">Roles</th>
                <th className="px-6 py-3">Estado</th>
                <th className="px-6 py-3">Fecha de Ingreso</th>
                <th className="px-6 py-3 flex justify-end">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                 Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i} className="hover:bg-surface-raised/30 transition-colors">
                    <td className="px-6 py-4"><Skeleton className="h-5 w-40" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-5 w-20" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-5 w-16" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-5 w-24" /></td>
                    <td className="px-6 py-4 flex justify-end"><Skeleton className="h-5 w-8" /></td>
                  </tr>
                ))
              ) : members?.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center gap-2">
                       <IconUsers size={32} stroke={1.5} className="text-text-muted" />
                       <span className="text-text-primary font-medium text-sm mt-2">No hay miembros registrados</span>
                       <span className="text-text-secondary text-xs text-balance max-w-sm">
                         Empieza por invitar usuarios de tu equipo o de organizaciones acreditadas.
                       </span>
                    </div>
                  </td>
                </tr>
              ) : (
                members?.map((member: any) => (
                  <tr key={member.id} className="hover:bg-surface-raised/30 transition-colors cursor-default">
                    <td className="px-6 py-4 font-medium text-text-primary">
                      {member.personId}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {member.roles.map((role: string) => (
                          <span key={role} className="inline-flex items-center rounded-md bg-surface-raised border border-border px-2.5 py-0.5 text-xs font-semibold text-text-primary shadow-sm">
                            {role}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {member.status === "active" ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-2.5 py-0.5 text-xs font-semibold text-success">
                          <span className="size-1.5 rounded-full bg-success"></span>
                          Activo
                        </span>
                      ) : member.status === "invited" ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-semibold text-blue-500">
                          <span className="size-1.5 rounded-full bg-blue-500"></span>
                          Pendiente
                        </span>
                      ) : (
                         <span className="inline-flex items-center gap-1.5 rounded-full bg-error/10 px-2.5 py-0.5 text-xs font-semibold text-error">
                          <span className="size-1.5 rounded-full bg-error"></span>
                          Inactivo
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-text-secondary">
                      {member.acceptedAt ? new Date(member.acceptedAt).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-6 py-4 flex justify-end">
                       <button className="text-primary hover:text-primary-hover font-medium text-sm">
                         Gestionar
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

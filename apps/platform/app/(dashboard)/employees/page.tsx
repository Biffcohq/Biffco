"use client"

import { useState } from 'react'
import { trpc } from '@/lib/trpc'
import { IconIdBadge2, IconPlus, IconUserOff, IconSearch } from '@tabler/icons-react'
import { Skeleton, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, Button, Input, Label, toast, Badge } from '@biffco/ui'

export default function EmployeesPage() {
  const trpcUtils = trpc.useUtils()
  const { data: employees, isLoading } = trpc.employees.list.useQuery()

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [newName, setNewName] = useState("")
  const [newRole, setNewRole] = useState("")
  const [newDni, setNewDni] = useState("")

  const createMutation = trpc.employees.create.useMutation({
    onSuccess: () => {
      toast.success("Personal registrado exitosamente")
      setIsCreateOpen(false)
      setNewName("")
      setNewRole("")
      setNewDni("")
      trpcUtils.employees.list.invalidate()
    },
    onError: (err) => toast.error(err.message || "Error al registrar")
  })

  const deactivateMutation = trpc.employees.deactivate.useMutation({
    onSuccess: () => {
      toast.success("Actualizado a Inactivo")
      trpcUtils.employees.list.invalidate()
    },
    onError: (err) => toast.error(err.message || "Error al desactivar")
  })

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newName || !newRole) return
    createMutation.mutate({ name: newName, role: newRole, dni: newDni })
  }

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <IconIdBadge2 size={24} className="text-primary" />
            Personal
          </h1>
          <p className="text-text-secondary text-sm">Gestiona el personal operativo y en terreno de tu organización.</p>
        </div>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-white hover:bg-primary-hover px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2 whitespace-nowrap">
              <IconPlus size={18} />
              Registrar Personal
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Registrar Personal</DialogTitle>
              <DialogDescription>
                Añade operarios, conductores o personal de campo que interviene en tus operaciones sin requerir acceso al sistema.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreate} className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name" className="text-white">Nombre Completo</Label>
                <Input 
                  id="name" 
                  type="text"
                  placeholder="Ej. Juan Pérez" 
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="role" className="text-white">Cargo / Rol</Label>
                  <Input 
                    id="role" 
                    type="text"
                    placeholder="Ej. Conductor, Peón" 
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="dni" className="text-white">DNI / Identificación</Label>
                  <Input 
                    id="dni" 
                    type="text"
                    placeholder="Ej. 12345678" 
                    value={newDni}
                    onChange={(e) => setNewDni(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter className="mt-4">
                <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)} disabled={createMutation.isPending}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={createMutation.isPending || !newName || !newRole}>
                  {createMutation.isPending ? "Registrando..." : "Registrar Personal"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border border-white/10 rounded-lg overflow-hidden bg-zinc-950">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-black text-zinc-400 border-b border-white/5">
              <tr>
                <th scope="col" className="px-6 py-4 font-medium">Nombre</th>
                <th scope="col" className="px-6 py-4 font-medium">Cargo</th>
                <th scope="col" className="px-6 py-4 font-medium">DNI</th>
                <th scope="col" className="px-6 py-4 font-medium">Estado</th>
                <th scope="col" className="px-6 py-4 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                Array(3).fill(0).map((_, i) => (
                  <tr key={i} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4"><Skeleton className="h-4 w-32" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-4 w-24" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-4 w-20" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-6 w-16 rounded-full" /></td>
                    <td className="px-6 py-4 text-right"><Skeleton className="h-8 w-8 rounded-md ml-auto" /></td>
                  </tr>
                ))
              ) : employees?.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-zinc-500">
                    No hay personal registrado en este espacio de trabajo.
                  </td>
                </tr>
              ) : (
                employees?.map(emp => (
                  <tr key={emp.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4 font-medium text-white">
                      {emp.name}
                    </td>
                    <td className="px-6 py-4 text-zinc-300">
                      {emp.role}
                    </td>
                    <td className="px-6 py-4 text-zinc-400 font-mono text-xs">
                      {emp.dni || "-"}
                    </td>
                    <td className="px-6 py-4">
                      {emp.isActive ? (
                        <Badge variant="green">Activo</Badge>
                      ) : (
                        <Badge variant="gray">Inactivo</Badge>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {emp.isActive && (
                        <button 
                          onClick={() => {
                            if (confirm(`¿Marcar a ${emp.name} como inactivo?`)) {
                              deactivateMutation.mutate({ id: emp.id })
                            }
                          }}
                          className="text-zinc-500 hover:text-yellow-500 transition-colors p-2 rounded-md hover:bg-white/5"
                          title="Desactivar personal"
                        >
                          <IconUserOff size={16} />
                        </button>
                      )}
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

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-undef */
"use client"

import React, { useState } from 'react'
import { trpc } from '@/lib/trpc'
import { IconIdBadge2, IconPlus, IconUserOff } from '@tabler/icons-react'
// @ts-ignore
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
    onError: (err: any) => toast.error(err.message || "Error al registrar")
  })

  const deactivateMutation = trpc.employees.deactivate.useMutation({
    onSuccess: () => {
      toast.success("Actualizado a Inactivo")
      trpcUtils.employees.list.invalidate()
    },
    onError: (err: any) => toast.error(err.message || "Error al desactivar")
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
          <h1 className="text-2xl font-bold flex items-center gap-2 text-slate-900">
            <IconIdBadge2 size={24} className="text-primary" />
            Personal
          </h1>
          <p className="text-slate-500 text-sm">Gestiona el personal operativo y en terreno de tu organización.</p>
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
                <Label htmlFor="name" className="text-slate-900">Nombre Completo</Label>
                <Input 
                  id="name" 
                  type="text"
                  placeholder="Ej. Juan Pérez" 
                  value={newName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewName(e.target.value)}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="role" className="text-slate-900">Cargo / Rol</Label>
                  <Input 
                    id="role" 
                    type="text"
                    placeholder="Ej. Conductor, Peón" 
                    value={newRole}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewRole(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="dni" className="text-slate-900">DNI / Identificación</Label>
                  <Input 
                    id="dni" 
                    type="text"
                    placeholder="Ej. 12345678" 
                    value={newDni}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewDni(e.target.value)}
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

      <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-slate-50 text-slate-500 border-b border-slate-200 font-semibold">
              <tr>
                <th scope="col" className="px-6 py-4 font-semibold">Nombre</th>
                <th scope="col" className="px-6 py-4 font-semibold">Cargo</th>
                <th scope="col" className="px-6 py-4 font-semibold">DNI</th>
                <th scope="col" className="px-6 py-4 font-semibold">Estado</th>
                <th scope="col" className="px-6 py-4 font-semibold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                Array(3).fill(0).map((_, i) => (
                  <tr key={i} className="hover:bg-slate-100 transition-colors">
                    <td className="px-6 py-4"><Skeleton className="h-4 w-32 bg-slate-50" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-4 w-24 bg-slate-50" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-4 w-20 bg-slate-50" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-6 w-16 rounded-full bg-slate-50" /></td>
                    <td className="px-6 py-4 text-right"><Skeleton className="h-8 w-8 rounded-md ml-auto bg-slate-50" /></td>
                  </tr>
                ))
              ) : employees?.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    No hay personal registrado en este espacio de trabajo.
                  </td>
                </tr>
              ) : (
                employees?.map((emp: any) => (
                  <tr key={emp.id} className="hover:bg-slate-100 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">
                      {emp.name}
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {emp.role}
                    </td>
                    <td className="px-6 py-4 text-slate-500 font-mono text-xs">
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
                            if (window.confirm(`¿Marcar a ${emp.name} como inactivo?`)) {
                              deactivateMutation.mutate({ id: emp.id })
                            }
                          }}
                          className="text-slate-400 hover:text-warning transition-colors p-2 rounded-md hover:bg-slate-50"
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

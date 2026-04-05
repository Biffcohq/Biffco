"use client"
import React, { useEffect } from 'react'
import { trpc } from '@/lib/trpc'
import { Skeleton } from '@/app/components/ui/Skeleton'
import { IconBuilding, IconBox, IconTruck, IconBuildingFactory, IconEye } from '@tabler/icons-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function PlatformRoot({ params }: { params: { workspaceId: string } }) {
  const router = useRouter()
  const { data: workspace, isLoading } = trpc.workspaces.getProfile.useQuery()

  useEffect(() => {
    if (workspace?.roles && workspace.roles.length === 1) {
      // Smart Auto-Routing for single-role tenants
      router.push(`/w/${params.workspaceId}/roles/${workspace.roles[0].toLowerCase()}`);
    }
  }, [workspace, router, params.workspaceId])

  if (isLoading || (workspace?.roles?.length === 1)) {
     return (
        <div className="flex flex-col gap-6 animate-in fade-in duration-300">
           <Skeleton className="h-9 w-64 rounded-md" />
           <Skeleton className="h-[400px] w-full rounded-xl" />
        </div>
     )
  }

  const roleLabels: Record<string, string> = {
    'PRODUCER': 'Productor / Origen',
    'TRANSPORTER': 'Logística / Transportista',
    'PROCESSOR': 'Manufactura / Procesador',
    'AUDITOR': 'Auditor Independiente'
  }

  const roleIcons: Record<string, React.ElementType> = {
    'PRODUCER': IconBox,
    'TRANSPORTER': IconTruck,
    'PROCESSOR': IconBuildingFactory,
    'AUDITOR': IconEye
  }

  return (
    <div className="flex flex-col gap-10 animate-in fade-in duration-300">
      
      {/* Header section */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold text-text-primary tracking-tight">Mis Roles (Hub Gerencial)</h1>
        <p className="text-text-secondary text-base">Tu organización opera múltiples roles. Selecciona el panel al que deseas acceder.</p>
      </div>

      {workspace && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {workspace.roles.map(role => {
              const Icon = roleIcons[role] || IconBuilding;
              return (
                 <Link href={`/w/${params.workspaceId}/roles/${role.toLowerCase()}`} key={role} className="bg-surface border border-border group hover:border-primary/50 hover:shadow-md transition-all rounded-2xl p-6 flex flex-col gap-4">
                    <div className="size-12 rounded-xl bg-surface-raised border border-border flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                       <Icon stroke={1.5} size={28} className="text-text-secondary group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-text-primary">{roleLabels[role] || role}</h3>
                      <p className="text-sm text-text-secondary mt-1">Acceder a las herramientas, inventarios y configuraciones específicas de este rol.</p>
                    </div>
                    <div className="mt-auto pt-4 flex justify-end">
                       <span className="text-sm font-medium text-primary group-hover:text-primary-hover">Entrar al panel -&gt;</span>
                    </div>
                 </Link>
              )
           })}
           
           {workspace.roles.length === 0 && (
             <div className="col-span-full p-12 text-center text-text-muted bg-surface-raised border border-border rounded-xl">
               <IconBuilding size={48} className="mx-auto mb-4 opacity-50 text-text-secondary" />
               <h2 className="text-xl font-bold text-text-primary mb-2">Workspace sin roles definidos</h2>
               <p className="max-w-md mx-auto">Dirígete a Configuración para asignar los roles comerciales de tu organización (Productor, Transportista, Transformador, etc.).</p>
             </div>
           )}
        </div>
      )}
    </div>
  );
}

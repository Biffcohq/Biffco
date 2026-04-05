"use client"

import { trpc } from '@/lib/trpc'
import { Skeleton } from '@/app/components/ui/Skeleton'
import { ProducerDashboard } from '@/app/components/dashboards/ProducerDashboard'
import { TransporterDashboard } from '@/app/components/dashboards/TransporterDashboard'
import { ProcessorDashboard } from '@/app/components/dashboards/ProcessorDashboard'
import { AuditorDashboard } from '@/app/components/dashboards/AuditorDashboard'
import { IconLock } from '@tabler/icons-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default function RoleContextPage({ params }: { params: { workspaceId: string, roleId: string } }) {
  const { data: workspace, isLoading } = trpc.workspaces.getProfile.useQuery()
  const currentRole = params.roleId.toUpperCase();

  if (isLoading) {
     return (
        <div className="flex flex-col gap-6 animate-in fade-in duration-300">
           <Skeleton className="h-9 w-64 rounded-md" />
           <Skeleton className="h-[400px] w-full rounded-xl" />
        </div>
     )
  }

  if (!workspace) return null;

  // Security: Check if workspace actually has this role assigned
  if (!workspace.roles.includes(currentRole)) {
     return (
       <div className="flex flex-col gap-4 items-center justify-center p-12 bg-error/5 border border-error/20 rounded-2xl text-center">
         <IconLock size={48} className="text-error opacity-80" />
         <h2 className="text-xl font-bold text-text-primary">Acceso Restringido</h2>
         <p className="text-sm text-text-secondary">Tu organización no tiene habilitado el rol de {currentRole}. Si crees que esto es un error, contacta a tu administrador.</p>
         <Link href={`/w/${params.workspaceId}`} className="mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover font-medium">
            Volver al Hub
         </Link>
       </div>
     )
  }

  // Dashboard Context Router
  return (
    <div className="animate-in fade-in zoom-in-95 duration-300">
       {currentRole === 'PRODUCER' && <ProducerDashboard workspace={workspace} />}
       {currentRole === 'TRANSPORTER' && <TransporterDashboard workspace={workspace} />}
       {currentRole === 'PROCESSOR' && <ProcessorDashboard workspace={workspace} />}
       {currentRole === 'AUDITOR' && <AuditorDashboard workspace={workspace} />}
       
       {/* Si es un rol futuro que aun no tiene un dashboard UI programado */}
       {!['PRODUCER', 'TRANSPORTER', 'PROCESSOR', 'AUDITOR'].includes(currentRole) && (
          <div className="p-8 border border-border bg-surface rounded-xl">
             <h2 className="text-lg font-bold text-text-primary uppercase flex gap-2">
                Panel de {currentRole}
             </h2>
             <p className="text-sm text-text-muted mt-2">Módulo en construcción para tu vertical. Utiliza la barra lateral para gestionar tus activos y reportes.</p>
          </div>
       )}
    </div>
  )
}

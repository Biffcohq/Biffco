'use client'

import { trpc } from '@/lib/trpc'
import { Skeleton } from '@/app/components/ui/Skeleton'
// eslint-disable-next-line no-restricted-imports
import { VerticalRoleFeature } from '@/app/lib/verticals/registry'
import { IconLock } from '@tabler/icons-react'
import { notFound } from 'next/navigation'

export default function RoleFeatureContextPage({ params }: { params: { workspaceId: string, roleId: string, featureId: string } }) {
  const { data: workspace, isLoading } = trpc.workspaces.getProfile.useQuery()
  const { data: profile, isLoading: isProfileLoading } = trpc.auth.me.useQuery()

  if (isLoading || isProfileLoading) {
    return (
      <div className="flex flex-col gap-6 animate-pulse p-4">
        <Skeleton className="h-[200px] w-full rounded-xl" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    )
  }

  if (!workspace || !profile) {
    return notFound()
  }

  const currentRole = params.roleId.toUpperCase();
  const globalRolesStr = (profile.globalRoles || []) as unknown as string[];
  const hasRole = globalRolesStr.includes(currentRole) || 
                  workspace.members?.some((m: { user?: { id: string }, roles?: unknown[] }) => 
                     m.user?.id === profile.id && (m.roles as string[])?.includes(currentRole)) || 
                  workspace.metadata?.simulatedRole;

  if (!hasRole) {
     return (
        <div className="flex flex-col items-center justify-center p-12 text-center border border-border rounded-xl bg-surface-raised/40 mt-12">
            <div className="size-16 rounded-full bg-error/10 text-error flex items-center justify-center mb-4">
               <IconLock size={32} />
            </div>
            <h2 className="text-xl font-bold text-text-primary">Acceso Restringido</h2>
            <p className="text-sm text-text-secondary mt-2 max-w-sm">
                No tienes permisos para acceder a las utilidades funcionales del rol {currentRole} en la cadena {workspace.name}.
            </p>
        </div>
     )
  }

  return (
    <div className="animate-in fade-in zoom-in-95 duration-300">
       <VerticalRoleFeature 
          verticalId={workspace.verticalId || 'agnostic'} 
          roleId={currentRole} 
          featureId={params.featureId}
          workspace={workspace} 
       />
    </div>
  )
}

"use client"

import Link from 'next/link'
import { IconBuilding, IconPackage, IconArrowRight } from '@tabler/icons-react'
import { trpc } from '../../lib/trpc'
import { Skeleton } from '../components/ui/Skeleton'

export default function HubPage() {
  const { data: workspace, isLoading } = trpc.workspaces.getProfile.useQuery()

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      
      {/* Header section */}
      <div className="flex flex-col gap-1">
        {isLoading ? (
          <Skeleton className="h-9 w-64 rounded-md bg-surface-raised" />
        ) : (
          <h1 className="text-3xl font-bold text-text-primary tracking-tight">Mis Cadenas Productivas</h1>
        )}
        <p className="text-text-secondary text-base">Selecciona un workspace para acceder a la operativa de esa vertical.</p>
      </div>

      {/* Workspace Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
        {isLoading ? (
          <Skeleton className="h-40 w-full rounded-xl bg-surface-raised" />
        ) : (
          <Link href={`/w/${workspace?.id || 'default'}`} className="block group">
            <div className="bg-surface border border-border rounded-xl p-6 shadow-sm hover:shadow-md hover:border-primary/50 transition-all cursor-pointer flex flex-col justify-between h-40 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
              <div className="flex justify-between items-start">
                <div className="size-10 rounded-md bg-primary/10 flex items-center justify-center text-primary">
                  <IconBuilding size={24} stroke={1.5} />
                </div>
                <span className="text-[10px] font-bold tracking-wider uppercase text-primary bg-primary/10 px-2 py-1 rounded-full">
                  Ganadería
                </span>
              </div>
              <div className="mt-auto flex justify-between items-end">
                 <div>
                    <h2 className="text-lg font-bold text-text-primary group-hover:text-primary transition-colors">{workspace?.name || 'Estancia Registrada'}</h2>
                    <p className="text-sm text-text-secondary mt-1 font-mono text-[11px] uppercase tracking-wider">ID: {workspace?.id || 'WK_12345'}</p>
                 </div>
                 <div className="size-8 rounded-full bg-surface-raised flex items-center justify-center text-text-muted group-hover:bg-primary group-hover:text-white transition-colors">
                    <IconArrowRight size={16} stroke={2}/>
                 </div>
              </div>
            </div>
          </Link>
        )}

        <div className="bg-surface border border-dashed border-border-strong rounded-xl p-6 shadow-sm hover:border-primary hover:bg-surface-raised cursor-pointer transition-all flex flex-col items-center justify-center h-40 text-center gap-2 group">
           <div className="size-10 rounded-full bg-surface-raised flex items-center justify-center text-text-muted group-hover:text-primary transition-colors">
              <IconPackage size={24} stroke={1.5} />
           </div>
           <div>
             <h3 className="text-sm font-semibold text-text-primary">Registrar Nueva Cadena</h3>
             <p className="text-xs text-text-secondary">Agregar vertical de Minería, Agro, etc.</p>
           </div>
        </div>
      </div>
    </div>
  );
}

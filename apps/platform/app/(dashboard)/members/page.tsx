"use client"

import { useState } from 'react'
import { IconUsers, IconUsersGroup, IconIdBadge2 } from '@tabler/icons-react'
import { MembersTab } from './components/MembersTab'
import { TeamsTab } from './components/TeamsTab'
import { EmployeesTab } from './components/EmployeesTab'

export default function UnifiedMembersPage() {
  const [activeTab, setActiveTab] = useState<'members' | 'teams' | 'employees'>('members')

  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto">
      {/* Header section */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-text-primary tracking-tight">Equipo y Roles</h1>
        <p className="text-text-secondary text-sm">
          Administra quién tiene acceso, agrupa personas en equipos y registra al personal operativo de tu organización.
        </p>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-border">
        <nav className="-mb-px flex gap-6" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('members')}
            className={`
              flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap
              ${activeTab === 'members' 
                ? 'border-primary text-primary' 
                : 'border-transparent text-text-secondary hover:text-text-primary hover:border-text-muted'
              }
            `}
          >
            <IconUsers size={18} />
            Miembros Invitados
          </button>
          
          <button
            onClick={() => setActiveTab('teams')}
            className={`
              flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap
              ${activeTab === 'teams' 
                ? 'border-primary text-primary' 
                : 'border-transparent text-text-secondary hover:text-text-primary hover:border-text-muted'
              }
            `}
          >
            <IconUsersGroup size={18} />
            Equipos y Roles
          </button>

          <button
            onClick={() => setActiveTab('employees')}
            className={`
              flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap
              ${activeTab === 'employees' 
                ? 'border-primary text-primary' 
                : 'border-transparent text-text-secondary hover:text-text-primary hover:border-text-muted'
              }
            `}
          >
            <IconIdBadge2 size={18} />
            Personal de Campo
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="pt-2 animate-in fade-in duration-300">
        {activeTab === 'members' && <MembersTab />}
        {activeTab === 'teams' && <TeamsTab />}
        {activeTab === 'employees' && <EmployeesTab />}
      </div>
    </div>
  )
}

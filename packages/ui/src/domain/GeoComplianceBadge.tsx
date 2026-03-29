// @ts-nocheck
import * as React from "react"
import { IconLeaf, IconAlertTriangle, IconShieldCheck, IconInfoCircle } from "@tabler/icons-react"
import { cn } from "../lib/utils"

export type GeoComplianceStatus = "compliant" | "non_compliant" | "pending" | "not_assessed"

export interface GeoComplianceBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  status: GeoComplianceStatus
  details?: string
  lastCheckedAt?: Date
}

export function GeoComplianceBadge({ status, details, lastCheckedAt, className, ...props }: GeoComplianceBadgeProps) {
  const isCompliant = status === "compliant"
  const isNonCompliant = status === "non_compliant"
  const isPending = status === "pending"

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors cursor-help",
        isCompliant && "border-green-500/30 bg-green-500/10 text-green-400",
        isNonCompliant && "border-red-500/30 bg-red-500/10 text-red-400",
        isPending && "border-yellow-500/30 bg-yellow-500/10 text-yellow-400",
        status === "not_assessed" && "border-zinc-500/30 bg-zinc-500/10 text-zinc-400",
        className
      )}
      title={details || `Estado EUDR: ${status}`}
      {...props}
    >
      {isCompliant ? (
        <IconShieldCheck size={14} />
      ) : isNonCompliant ? (
        <IconAlertTriangle size={14} />
      ) : isPending ? (
        <IconInfoCircle size={14} className="animate-pulse" />
      ) : (
        <IconLeaf size={14} className="opacity-50" />
      )}
      
      <span>
        {isCompliant && "EUDR Compliant"}
        {isNonCompliant && "No Compliant (EUDR)"}
        {isPending && "GFW Check Pendiente"}
        {status === "not_assessed" && "Sin Evaluar"}
      </span>

      {lastCheckedAt && (
         <span className="hidden opacity-60 ml-1 group-hover:inline">
           (v.{lastCheckedAt.toLocaleDateString()})
         </span>
      )}
    </div>
  )
}

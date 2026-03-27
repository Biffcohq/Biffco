import React from 'react';
import { cn } from '../lib/utils';
import { SignatureBadge, SignatureStatus } from './SignatureBadge';
import { Avatar, AvatarFallback } from '../components/Avatar';
import { IconAnchor, IconFileCheck } from '@tabler/icons-react';

export interface MockActor {
  id: string;
  name: string;
}

export interface MockDomainEvent {
  id: string;
  type: string;
  occurredAt: string;
  actor: MockActor;
  payloadSummary: string;
  signatureStatus: SignatureStatus;
  txHash?: string;
}

export interface EventTimelineProps extends React.HTMLAttributes<HTMLDivElement> {
  events: MockDomainEvent[];
}

export function EventTimeline({ events, className, ...props }: EventTimelineProps) {
  return (
    <div className={cn("space-y-6 relative before:absolute before:inset-0 before:ml-4 before:-translate-x-px before:h-full before:w-0.5 before:bg-[var(--color-border)]", className)} {...props}>
      {events.map((event) => (
        <div key={event.id} className="relative flex items-start gap-4 group">
          {/* Icon marker */}
          <div className="flex items-center justify-center w-8 h-8 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-primary)] shadow shrink-0 z-10 transition-transform group-hover:scale-110 mt-1">
            <IconFileCheck className="w-4 h-4" />
          </div>
          
          {/* Card */}
          <div className="flex-1 min-w-0 bg-[var(--color-surface)] p-4 rounded-xl border border-[var(--color-border)] shadow-sm hover:shadow-md transition-shadow">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
              <div className="flex flex-col min-w-0">
                <span className="text-[var(--color-text-primary)] font-semibold text-sm truncate">{event.type}</span>
                <span className="font-mono text-[11px] text-[var(--color-text-secondary)] whitespace-nowrap">{event.occurredAt}</span>
              </div>
              <div className="shrink-0">
                <SignatureBadge status={event.signatureStatus} />
              </div>
            </div>
            
            <div className="text-xs text-[var(--color-text-secondary)] mb-4 p-2.5 bg-[var(--color-surface-raised)] rounded-md border border-dashed border-[var(--color-border)] overflow-x-auto whitespace-pre-wrap break-words font-mono">
              {event.payloadSummary}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-3 border-t border-[var(--color-border)] gap-3 sm:gap-0">
              <div className="flex items-center gap-2 shrink-0">
                <Avatar className="h-5 w-5">
                  <AvatarFallback className="text-[9px]">{event.actor.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <span className="text-[11px] font-medium text-[var(--color-text-primary)] truncate">{event.actor.name}</span>
              </div>
              
              {event.txHash && (
                <div className="flex items-center gap-1.5 text-[var(--color-teal)] bg-teal-50 px-2 py-1 rounded-md text-[10px] sm:text-[11px] font-medium font-mono border border-teal-100 transition-colors hover:bg-teal-100 cursor-pointer overflow-hidden min-w-0">
                  <IconAnchor className="w-3 h-3 shrink-0" />
                  <span className="truncate">{event.txHash}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

"use client";

import { useState } from 'react';
import { DAGVisualizer, DAGAsset } from './DAGVisualizer';
import { EventTimeline, MockDomainEvent } from './EventTimeline';
import { Node, Edge } from 'reactflow';

export interface ChainOfCustodyViewProps {
  nodes: Node<DAGAsset>[];
  edges: Edge[];
  // Diccionario: a un ID de node le corresponde su timeline
  eventsByNode: Record<string, MockDomainEvent[]>;
}

export function ChainOfCustodyView({ nodes, edges, eventsByNode }: ChainOfCustodyViewProps) {
  const [selectedNodeId, setSelectedNodeId] = useState<string | undefined>(nodes[0]?.id);

  const selectedEvents = selectedNodeId ? eventsByNode[selectedNodeId] || [] : [];
  const selectedNodeData = nodes.find(n => n.id === selectedNodeId)?.data;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full min-h-[700px]">
      {/* Columna Izquierda / Visor DAG (Ocupa 2 cols en Desktop) */}
      <div className="lg:col-span-2 flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-[var(--color-text-primary)]">
            Cadena de custodia
          </h2>
          {selectedNodeData && (
            <div className="font-mono text-sm bg-[var(--color-surface-raised)] border border-[var(--color-border)] px-3 py-1 rounded-md text-[var(--color-text-secondary)] shadow-sm">
              ID: {selectedNodeId}
            </div>
          )}
        </div>
        <div className="flex-grow rounded-xl overflow-hidden shadow-sm h-[600px] border border-[var(--color-border)]">
          <DAGVisualizer 
            nodes={nodes} 
            edges={edges} 
            onNodeClick={setSelectedNodeId}
            selectedNodeId={selectedNodeId}
          />
        </div>
      </div>

      {/* Columna Derecha / Timeline Drawer-like */}
      <div className="lg:col-span-1 border border-[var(--color-border)] bg-[var(--color-surface)] rounded-xl shadow-sm p-6 overflow-y-auto max-h-[700px] mt-[48px] lg:mt-[52px]">
        <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-6 pb-4 border-b border-[var(--color-border)]">
          Eventos Firmados
        </h3>
        
        {selectedEvents.length > 0 ? (
          <EventTimeline events={selectedEvents} />
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="text-[var(--color-text-muted)] mb-4 opacity-50 bg-[var(--color-surface-raised)] p-4 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 3v4a1 1 0 0 0 1 1h4"/><path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z"/><path d="M9 17h6"/><path d="M9 13h6"/></svg>
            </div>
            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed px-4">
              Selecciona un Nodo en el grafo para visualizar su línea de eventos criptográficos.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

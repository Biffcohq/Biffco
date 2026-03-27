import { useCallback, useEffect, useState } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Handle,
  Position,
  NodeProps,
  Edge,
  Node,
  MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';
import dagre from 'dagre';
import { cn } from '../lib/utils';
import { IconPackage, IconDog, IconDiamond } from '@tabler/icons-react';

export interface DAGAsset {
  id: string;
  type: 'animal' | 'mineral' | 'generic';
  status: 'active' | 'locked' | 'quarantine' | 'closed';
}

export interface DAGVisualizerProps {
  nodes: Node<DAGAsset>[];
  edges: Edge[];
  onNodeClick?: (nodeId: string) => void;
  selectedNodeId?: string | undefined;
}

const CustomAssetNode = ({ data, selected }: NodeProps<DAGAsset>) => {
  const icons = {
    animal: <IconDog className="w-5 h-5 text-[var(--color-primary)]" />,
    mineral: <IconDiamond className="w-5 h-5 text-[var(--color-purple)]" />,
    generic: <IconPackage className="w-5 h-5 text-[var(--color-orange)]" />
  };

  const statusColors = {
    active: "bg-[var(--color-success-subtle)] text-[var(--color-success)]",
    locked: "bg-[var(--color-error-subtle)] text-[var(--color-error)]",
    quarantine: "bg-[var(--color-warning-subtle)] text-[var(--color-warning)]",
    closed: "bg-[var(--color-surface-raised)] text-[var(--color-text-secondary)]",
  };

  return (
    <div className={cn(
      "px-4 py-3 shadow-md rounded-xl border-2 bg-[var(--color-surface)] min-w-[220px] transition-all",
      selected ? "border-[var(--color-primary)] shadow-lg shadow-[var(--color-primary)]/20 scale-105" : "border-[var(--color-border)] hover:border-[var(--color-border-strong)]"
    )}>
      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-[var(--color-border-strong)]" />
      
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-[var(--color-surface-raised)]">
          {icons[data.type] || icons.generic}
        </div>
        <div className="min-w-0">
          <div className="text-xs text-[var(--color-text-secondary)] font-medium uppercase tracking-wider mb-0.5">
            {data.type}
          </div>
          <div className="font-mono text-sm font-semibold text-[var(--color-text-primary)] truncate" title={data.id}>
            {data.id}
          </div>
        </div>
      </div>

      <div className="mt-3 flex justify-end">
        <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-bold uppercase", statusColors[data.status])}>
          {data.status}
        </span>
      </div>

      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-[var(--color-border-strong)]" />
    </div>
  );
};

const nodeTypes = {
  assetNode: CustomAssetNode,
};

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const getLayoutedElements = (nodes: Node[], edges: Edge[], direction = 'TB') => {
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node) => {
    // Estimación del tamaño del Custom Node (ampliado para evitar recortes)
    dagreGraph.setNode(node.id, { width: 240, height: 100 });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    // Movemos el punto central a la esquina top-left para ReactFlow
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - 200 / 2,
        y: nodeWithPosition.y - 100 / 2,
      },
    };
  });

  return { nodes: layoutedNodes, edges };
};

export function DAGVisualizer({ nodes: initialNodes, edges: initialEdges, onNodeClick, selectedNodeId }: DAGVisualizerProps) {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  useEffect(() => {
    // Aplicamos el layout automático con dagre
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      initialNodes,
      initialEdges,
      'TB' // Top-to-Bottom
    );

    // Marcamos el nodo seleccionado y estilo a las edges
    const finalNodes = layoutedNodes.map(n => ({
      ...n,
      selected: n.id === selectedNodeId,
      type: 'assetNode' // Forzamos nuestro custom-node
    }));

    const finalEdges = layoutedEdges.map(e => ({
      ...e,
      style: { stroke: 'var(--color-border-strong)', strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, color: 'var(--color-border-strong)' },
      animated: true // Sutil animación indicando movimiento de la custodia
    }));

    setNodes(finalNodes);
    setEdges(finalEdges);
  }, [initialNodes, initialEdges, selectedNodeId]);

  const onNodeClickInternal = useCallback((_: React.MouseEvent, node: Node) => {
    if (onNodeClick) onNodeClick(node.id);
  }, [onNodeClick]);

  return (
    <div className="w-full h-full min-h-[500px] border border-[var(--color-border)] rounded-xl overflow-hidden bg-[var(--color-bg)]">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodeClick={onNodeClickInternal}
        fitView
        minZoom={0.5}
        maxZoom={1.5}
        attributionPosition="bottom-left"
      >
        <Background color="var(--color-text-muted)" gap={16} size={1} />
        <Controls className="!bg-[var(--color-surface)] !border-[var(--color-border)] !shadow-md fill-[var(--color-text-primary)]" />
        <MiniMap 
          nodeColor={(n) => {
            if (n.data?.status === 'error' || n.data?.status === 'locked') return 'var(--color-error)';
            if (n.data?.type === 'animal') return 'var(--color-primary)';
            return 'var(--color-orange)';
          }} 
          className="!bg-[var(--color-surface)] !border-[var(--color-border)] rounded-md overflow-hidden shadow-sm"
        />
      </ReactFlow>
    </div>
  );
}

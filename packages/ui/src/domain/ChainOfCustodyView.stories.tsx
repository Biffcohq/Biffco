import type { Meta, StoryObj } from '@storybook/react';
import { ChainOfCustodyView } from './ChainOfCustodyView';

const meta: Meta<typeof ChainOfCustodyView> = {
  title: 'Domain Components/ChainOfCustodyView',
  component: ChainOfCustodyView,
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof ChainOfCustodyView>;

const mockNodes = [
  {
    id: 'AR-2024-001',
    data: { id: 'AR-2024-001', type: 'animal' as const, status: 'closed' as const },
    position: { x: 0, y: 0 },
  },
  {
    id: 'AR-2024-002',
    data: { id: 'AR-2024-002', type: 'animal' as const, status: 'closed' as const },
    position: { x: 0, y: 0 },
  },
  {
    id: 'BATCH-LA-2024',
    data: { id: 'BATCH-LA-2024', type: 'generic' as const, status: 'active' as const },
    position: { x: 0, y: 0 },
  },
];

const mockEdges = [
  { id: 'e1', source: 'AR-2024-001', target: 'BATCH-LA-2024' },
  { id: 'e2', source: 'AR-2024-002', target: 'BATCH-LA-2024' },
];

const mockEvents = {
  'AR-2024-001': [
    {
      id: 'ev-1',
      type: 'AnimalRegistered',
      occurredAt: '2024-03-25T10:00:00Z',
      actor: { id: 'a1', name: 'Estancia La Paz' },
      payloadSummary: '{"weight_kg": 240, "breed": "Angus"}',
      signatureStatus: 'valid' as const,
      txHash: '0x4f2d8a1e9b0c...5c8b',
    }
  ],
  'AR-2024-002': [
    {
      id: 'ev-2',
      type: 'AnimalRegistered',
      occurredAt: '2024-03-25T11:00:00Z',
      actor: { id: 'a1', name: 'Estancia La Paz' },
      payloadSummary: '{"weight_kg": 260, "breed": "Angus"}',
      signatureStatus: 'valid' as const,
      txHash: '0x8b2d7f4a1e9b...3e9a',
    }
  ],
  'BATCH-LA-2024': [
    {
      id: 'ev-3',
      type: 'MergeAssets',
      occurredAt: '2024-03-28T14:30:00Z',
      actor: { id: 'a2', name: 'Frigorífico Sur' },
      payloadSummary: '{"new_asset_type": "generic"}',
      signatureStatus: 'pending' as const,
    }
  ],
};

export const Default: Story = {
  args: {
    nodes: mockNodes,
    edges: mockEdges,
    eventsByNode: mockEvents,
  },
};

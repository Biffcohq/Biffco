
import type { Meta, StoryObj } from '@storybook/react';
import { EventTimeline, MockDomainEvent } from './EventTimeline';

const meta: Meta<typeof EventTimeline> = {
  title: 'Domain Components/EventTimeline',
  component: EventTimeline,
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof EventTimeline>;

const mockEvents: MockDomainEvent[] = [
  {
    id: 'e1',
    type: 'AnimalRegistered',
    occurredAt: '2024-03-27T10:00:00Z',
    actor: { id: 'a1', name: 'Estancia La Paz' },
    payloadSummary: '{"weight_kg": 240, "breed": "Angus", "origin_zone": "-34.1, -64.2"}',
    signatureStatus: 'valid',
    txHash: '0x4f2d8a1e9b0c3e9a5c8b2d7f4a1e9b0c3e9a5c8b2d7f4a1e9b0c3e9a5c8b',
  },
  {
    id: 'e2',
    type: 'HealthInspectionCompleted',
    occurredAt: '2024-03-28T14:30:00Z',
    actor: { id: 'a2', name: 'SENASA Inspector #41' },
    payloadSummary: '{"vaccine": "FMD", "batch": "A-8821", "result": "PASS"}',
    signatureStatus: 'pending',
  },
  {
    id: 'e3',
    type: 'AssetTransferred',
    occurredAt: '2024-03-29T08:15:00Z',
    actor: { id: 'a3', name: 'Transporte Acme' },
    payloadSummary: '{"destination_facility": "FAC-8890", "carrier_id": "CAR-01"}',
    signatureStatus: 'invalid',
  },
];

export const Default: Story = {
  args: {
    events: mockEvents,
  },
};

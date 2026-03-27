import type { Meta, StoryObj } from '@storybook/react';
import { SyncStatusBadge } from './SyncStatusBadge';

const meta: Meta<typeof SyncStatusBadge> = {
  title: 'Domain Components/SyncStatusBadge',
  component: SyncStatusBadge,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof SyncStatusBadge>;

export const Synced: Story = {
  args: {
    status: 'synced',
  },
};

export const Syncing: Story = {
  args: {
    status: 'syncing',
    pendingCount: 14,
  },
};

export const Pending: Story = {
  args: {
    status: 'pending',
    pendingCount: 5,
  },
};

export const Error: Story = {
  args: {
    status: 'error',
  },
};

export const Offline: Story = {
  args: {
    status: 'offline',
  },
};

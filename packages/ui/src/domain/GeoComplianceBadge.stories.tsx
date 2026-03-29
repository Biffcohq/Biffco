import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GeoComplianceBadge } from './GeoComplianceBadge';

const meta = {
  title: 'Domain Components/GeoComplianceBadge',
  component: GeoComplianceBadge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof GeoComplianceBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Compliant: Story = {
  args: {
    status: 'compliant',
    details: 'EUDR Compliant - Evaluado sin alertas',
    lastCheckedAt: new Date(),
  },
};

export const NonCompliant: Story = {
  args: {
    status: 'non_compliant',
    details: 'Alerta de deforestación reciente detectada en la zona',
  },
};

export const Pending: Story = {
  args: {
    status: 'pending',
  },
};

export const NotAssessed: Story = {
  args: {
    status: 'not_assessed',
  },
};

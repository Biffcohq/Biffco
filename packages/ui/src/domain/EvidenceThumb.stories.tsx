import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { EvidenceThumb } from './EvidenceThumb';

const meta = {
  title: 'Domain Components/EvidenceThumb',
  component: EvidenceThumb,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof EvidenceThumb>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    s3Key: 'test-workspace/doc-123.pdf',
    mimeType: 'application/pdf',
    sizeBytes: 1048576, // 1MB
    clamavStatus: 'clean',
    filename: 'Certificado_Sanitario_2026.pdf',
    documentUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
  },
};

export const PendingScan: Story = {
  args: {
    ...Default.args,
    clamavStatus: 'pending',
  },
};

export const Infected: Story = {
  args: {
    ...Default.args,
    clamavStatus: 'infected',
  },
};

export const ImagePreview: Story = {
  args: {
    hash: 'a9f0e611311b...',
    s3Key: 'test-workspace/photo-123.jpg',
    mimeType: 'image/jpeg',
    sizeBytes: 2048576, // 2MB
    clamavStatus: 'clean',
    filename: 'Evidencia_Vacunacion.jpg',
    documentUrl: 'https://images.unsplash.com/photo-1544026220-43890f845a7c?q=80&w=600&auto=format&fit=crop'
  },
};

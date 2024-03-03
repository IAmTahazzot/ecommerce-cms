import type { Meta, StoryObj } from '@storybook/react';
import { Sidebar } from './Sidebar';

type Story = StoryObj<typeof Sidebar>;

const meta: Meta<typeof Sidebar> = {
  title: 'Sidebar',
  component: Sidebar,
}

export const Default: Story = {}

export default meta;

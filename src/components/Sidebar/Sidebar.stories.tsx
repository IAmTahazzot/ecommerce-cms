import type { Meta, StoryObj } from '@storybook/react';
import { Sidebar } from './Sidebar';
import { Navigation } from '@/lib/navigations';

type Story = StoryObj<typeof Sidebar>;

const meta: Meta<typeof Sidebar> = {
  title: 'Components/Sidebar',
  component: Sidebar,
}

export const Default: Story = {
  args: {
    navigation: Navigation
  }
}

export default meta;

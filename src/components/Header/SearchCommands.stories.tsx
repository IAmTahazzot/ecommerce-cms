import type { Meta, StoryObj } from '@storybook/react';
import { SearchCommands } from './SearchCommands';

type Story = StoryObj<typeof SearchCommands>;

const meta: Meta<typeof SearchCommands> = {
  title: 'Components/SearchCommands',
  component: SearchCommands,
}

export const Default: Story = {
  render: () => (
    <div className='flex items-center justify-center h-screen'>
      <SearchCommands />
    </div>
  )
}

export default meta;
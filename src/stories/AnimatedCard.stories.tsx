import type { Meta, StoryObj } from '@storybook/react'
import { AnimatedCard } from '@/components/AnimatedCard'

const meta: Meta<typeof AnimatedCard> = {
  title: 'Forge/AnimatedCard',
  component: AnimatedCard,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'primary', 'accent', 'warning'],
    },
  },
}

export default meta
type Story = StoryObj<typeof AnimatedCard>

export const Default: Story = {
  args: {
    variant: 'default',
    title: 'Component Card',
    description: 'Token-driven, animated with Framer Motion. Hover to see the lift effect.',
  },
}

export const Primary: Story = {
  args: {
    variant: 'primary',
    title: 'Primary Card',
    description: 'Uses the brand primary token.',
  },
}

export const Accent: Story = {
  args: {
    variant: 'accent',
    title: 'Accent Card',
    description: 'Uses the brand accent token.',
  },
}

export const Warning: Story = {
  args: {
    variant: 'warning',
    title: 'Warning Card',
    description: 'Uses the brand warning token.',
  },
}

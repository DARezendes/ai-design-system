import type { Meta, StoryObj } from '@storybook/react'
import { Checkbox } from '@/components/ui/checkbox'

const meta: Meta<typeof Checkbox> = {
  title: 'Forge/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Checkbox>

export const Default: Story = {
  args: { checked: false },
}

export const Checked: Story = {
  args: { checked: true },
}

export const WithLabel: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Checkbox id="story-terms" />
      <label htmlFor="story-terms" className="text-sm cursor-pointer">
        Accept terms and conditions
      </label>
    </div>
  ),
}

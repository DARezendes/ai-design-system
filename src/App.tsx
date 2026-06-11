import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { AnimatedCard } from '@/components/AnimatedCard'
import { AIScaffolder } from '@/components/AIScaffolder'

const variants = ['default', 'primary', 'accent', 'warning'] as const

export default function App() {
  const [checked, setChecked] = useState(false)
  const [activeVariant, setActiveVariant] = useState<typeof variants[number]>('default')

  const [dark, setDark] = useState(true)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <header className="border-b border-border px-12 py-4 flex items-center justify-between">
        <div>
          <span className="font-semibold text-sm">AI Design System</span>
          <span className="text-muted-foreground text-sm ml-2">/ Forge Component Library</span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setDark(!dark)}
            className="text-xs border border-border rounded-md px-3 py-1.5 text-muted-foreground hover:text-foreground hover:border-foreground transition-colors cursor-pointer"
          >
            {dark ? '☀ Light' : '☾ Dark'}
          </button>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[oklch(0.75_0.18_160)]" />
            <span className="text-xs text-muted-foreground">Token pipeline active</span>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-12 py-12 space-y-16">

        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Forge Component Library</h1>
          <p className="text-muted-foreground text-lg">
            Token-driven components with AI-assisted scaffolding.
          </p>
        </div>

        {/* Tokens */}
        <section className="space-y-4">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-4">Design Tokens</h2>
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: 'Primary', style: { background: 'var(--primary)' } },
                { label: 'Destructive', style: { background: 'var(--destructive)' } },
                { label: 'Accent', style: { background: 'var(--brand-accent)' } },
                { label: 'Warning', style: { background: 'var(--brand-warning)' } },
              ].map(({ label, style }) => (
                <div key={label} className="space-y-2">
                  <div className="h-16 rounded-lg border" style={style} />
                  <p className="text-xs text-muted-foreground font-mono">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Button */}
        <section className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Button</h2>
          <div className="p-8 rounded-xl border border-border bg-card flex gap-3 flex-wrap items-center">
            <Button variant="default" className="cursor-pointer">Default</Button>
            <Button variant="secondary" className="cursor-pointer">Secondary</Button>
            <Button variant="destructive" className="cursor-pointer">Destructive</Button>
            <Button variant="outline" className="cursor-pointer">Outline</Button>
            <Button variant="ghost" className="cursor-pointer">Ghost</Button>
          </div>
        </section>

        {/* Checkbox */}
        <section className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Checkbox</h2>
          <div className="p-8 rounded-xl border border-border bg-card flex items-center gap-3">
            <Checkbox
              id="terms"
              checked={checked}
              onCheckedChange={(val) => setChecked(!!val)}
              className="cursor-pointer"
            />
            <label htmlFor="terms" className="text-sm cursor-pointer select-none">
              {checked ? '✓ Agreed to terms' : 'Accept terms and conditions'}
            </label>
          </div>
        </section>

        {/* Animated Card */}
        <section className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Animated Card</h2>
          <div className="p-8 rounded-xl border border-border bg-card space-y-4">
            <div className="flex gap-2 flex-wrap">
              {variants.map((v) => (
                <Button
                  key={v}
                  variant={activeVariant === v ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveVariant(v)}
                  className="cursor-pointer capitalize"
                >
                  {v}
                </Button>
              ))}
            </div>
            <AnimatedCard
              key={activeVariant}
              variant={activeVariant}
              title="Component Card"
              description="Token-driven, animated with Framer Motion. Hover to see the lift effect."
            />
          </div>
        </section>

        {/* AI Scaffolder */}
        <AIScaffolder />

      </div>
    </main>
  )
}

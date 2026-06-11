import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'

export function AIScaffolder() {
  const [prompt, setPrompt] = useState('')
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleGenerate() {
    if (!prompt.trim()) return
    setLoading(true)
    setOutput('')

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-5',
          max_tokens: 1000,
          messages: [
            {
              role: 'user',
              content: `You are a design system engineer. Generate a React TypeScript component using shadcn/ui, Radix UI, Tailwind CSS, and CSS custom property tokens.

The component should follow this token system:
- Colors: --primary, --secondary, --destructive, --brand-accent, --brand-warning
- All values are CSS custom properties
- Use Tailwind utility classes where possible
- Use class-variance-authority for variants if applicable

Request: ${prompt}

Return ONLY the component code, no explanation, no markdown fences.`,
            },
          ],
        }),
      })

      const data = await response.json()
      const raw = data.content?.[0]?.text ?? 'No output generated.'
      const text = raw.replace(/^```[\w]*\n?/, '').replace(/\n?```$/, '').trim()
      setOutput(text)
    } catch {
      setOutput('Error generating component. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">AI Component Scaffolder</h2>
        <p className="text-sm text-muted-foreground mt-2">
          Describe a component and generate production-ready code using your token system.
        </p>
      </div>

      <div className="p-8 rounded-xl border border-border bg-card space-y-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
            placeholder="e.g. a primary badge with destructive variant"
            className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring cursor-text"
          />
          <Button onClick={handleGenerate} disabled={loading} className="cursor-pointer">
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin" />
                Generating
              </span>
            ) : 'Generate'}
          </Button>
        </div>

        <AnimatePresence>
          {output && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-muted-foreground">Generated Component</span>
                <button
                  onClick={() => navigator.clipboard.writeText(output)}
                  className="text-xs text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                >
                  Copy
                </button>
              </div>
              <pre className="rounded-lg bg-muted border border-border p-4 text-xs overflow-x-auto whitespace-pre-wrap text-foreground font-mono leading-relaxed">
                {output}
              </pre>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}

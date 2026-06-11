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
          max_tokens: 3000,
          messages: [
            {
              role: 'user',
              content: `You are a design system engineer. Generate a single self-contained HTML snippet that visually demonstrates a UI component using these brand colors:

--primary: #3B5BDB
--destructive: #E03131  
--accent: #12B886
--warning: #F59F00

Request: ${prompt}

Rules:
- Return ONLY a valid HTML snippet, no explanation, no markdown fences
- Use inline styles or a <style> tag with the colors above
- Make it look polished and professional
- Keep interactions simple — no fetch calls, no external data, no complex JavaScript
- Dropdowns and selects should use static hardcoded options
- Forms should be purely visual demonstrations, not functional
- Avoid any code that requires a server or external dependencies
- Focus on visual quality — spacing, typography, color, and layout matter
- The component should render completely on its own with no missing pieces,
- Do not use max-width on the main container — let it fill 100% of available width
- Use padding on the container instead of max-width to control spacing
- Generate a single isolated component, not a full page layout
- No body background gradients or full-page wrappers — just the component itself
- Keep it compact and focused on one component only`
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

  const previewSrc = output
    ? URL.createObjectURL(
        new Blob(
        [`<html><body style="margin:0;padding:0;font-family:system-ui,sans-serif;background:#0a0a0f;color:#f5f5f5;box-sizing:border-box;">${output}</body></html>`],
          { type: 'text/html' }
        )
      )
    : ''

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
              className="grid grid-cols-2 gap-4"
            >
              {/* Code */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-muted-foreground">Generated Code</span>
                  <button
                    onClick={() => navigator.clipboard.writeText(output)}
                    className="text-xs text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                  >
                    Copy
                  </button>
                </div>
                <pre className="rounded-lg bg-muted border border-border p-4 text-xs overflow-x-auto whitespace-pre-wrap text-foreground font-mono leading-relaxed h-96">
                  {output}
                </pre>
              </div>

            {/* Preview */}
                <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-muted-foreground">Live Preview</span>
                </div>
                <div className="rounded-lg border border-border overflow-auto h-96">
                    <iframe
                        src={previewSrc}
                        className="w-full"
                        style={{ height: '600px', minWidth: '100%' }}
                        title="Component Preview"
                        sandbox="allow-scripts allow-same-origin"
                        scrolling="yes"
                    />
                </div>
            </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}

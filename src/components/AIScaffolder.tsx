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
              content: `You are a design system engineer. Generate a single self-contained HTML snippet (no React, no imports) that visually demonstrates a UI component using these CSS custom properties as inline styles or a style tag:

--primary: #3B5BDB
--destructive: #E03131  
--accent: #12B886
--warning: #F59F00

Request: ${prompt}

Rules:
- Return ONLY a valid HTML snippet, no explanation, no markdown fences
- Use inline styles or a <style> tag
- Make it look polished and professional
- Use the brand colors above
- No external dependencies`,
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
          [`<html><body style="margin:0;padding:24px;font-family:system-ui,sans-serif;background:#0a0a0f;color:#f5f5f5;display:flex;align-items:center;justify-content:center;min-height:100vh;box-sizing:border-box;">${output}</body></html>`],
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
                <pre className="rounded-lg bg-muted border border-border p-4 text-xs overflow-x-auto whitespace-pre-wrap text-foreground font-mono leading-relaxed h-64">
                  {output}
                </pre>
              </div>

            {/* Preview */}
                <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-muted-foreground">Live Preview</span>
                </div>
                <div className="rounded-lg border border-border overflow-hidden h-64">
                    <iframe
                    src={previewSrc}
                    className="w-full h-full"
                    title="Component Preview"
                    sandbox="allow-scripts"
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

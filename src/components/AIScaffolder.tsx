import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'

interface ComponentDoc {
  description: string
  props: { name: string; type: string; default: string; description: string }[]
  usage: string[]
  accessibility: string[]
}

export function AIScaffolder() {
  const [prompt, setPrompt] = useState('')
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'preview' | 'docs' | 'codeConnect'>('preview')
  const [docs, setDocs] = useState<ComponentDoc | null>(null)
  const [docsLoading, setDocsLoading] = useState(false)
  const [codeConnect, setCodeConnect] = useState<string | null>(null)
  const [codeConnectLoading, setCodeConnectLoading] = useState(false)

  async function generateDocs(componentCode: string, componentPrompt: string) {
    setDocsLoading(true)
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-5',
          max_tokens: 1000,
          messages: [{
            role: 'user',
            content: `You are a design system documentation writer. Given this UI component HTML and the prompt that generated it, produce structured documentation.

Component prompt: "${componentPrompt}"
Component HTML: ${componentCode}

Return ONLY valid JSON, no markdown, no fences:
{
  "description": "One sentence summary of the component",
  "props": [{ "name": "variant", "type": "string", "default": "primary", "description": "Visual style" }],
  "usage": ["Use when...", "Avoid when..."],
  "accessibility": ["Color contrast note...", "Keyboard note..."]
}
Infer 2–4 props from the HTML. Be specific to this component, not generic.`
          }],
        }),
      })
      const data = await response.json()
      const raw = data.content?.[0]?.text ?? '{}'
      const clean = raw.replace(/^```[\w]*\n?/, '').replace(/\n?```$/, '').trim()
      setDocs(JSON.parse(clean))
    } catch {
      setDocs({ description: 'Documentation unavailable.', props: [], usage: [], accessibility: [] })
    } finally {
      setDocsLoading(false)
    }
  }

  async function generateCodeConnect(componentCode: string, componentPrompt: string) {
    setCodeConnectLoading(true)
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-5',
          max_tokens: 1000,
          messages: [{
            role: 'user',
            content: `You are a design system engineer generating a Figma Code Connect file.

Component prompt: "${componentPrompt}"
Component HTML: ${componentCode}

Generate a valid @figma/code-connect stub. Return ONLY the TypeScript code, no explanation, no markdown fences.

Use this exact structure:
import figma from '@figma/code-connect'

figma.connect(
  'https://www.figma.com/design/FORGE_DESIGN_SYSTEM/Forge?node-id=COMPONENT_NODE',
  {
    props: {
      // map inferred props here using figma.enum or figma.boolean
    },
    example: ({ ...props }) => <ComponentName {...props} />,
  }
)

Rules:
- Derive the component name from the prompt (PascalCase)
- Use figma.enum() for string variant props, figma.boolean() for boolean props
- Keep the Figma URL placeholder exactly as shown, only change COMPONENT_NODE to a slugified version of the component name
- The example should be a realistic JSX usage`
          }],
        }),
      })
      const data = await response.json()
      const raw = data.content?.[0]?.text ?? ''
      const clean = raw.replace(/^```[\w]*\n?/, '').replace(/\n?```$/, '').trim()
      setCodeConnect(clean)
    } catch {
      setCodeConnect('// Code Connect generation failed.')
    } finally {
      setCodeConnectLoading(false)
    }
  }

  async function handleGenerate() {
    if (!prompt.trim()) return
    setLoading(true)
    setOutput('')
    setDocs(null)
    setCodeConnect(null)
    setActiveTab('preview')

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
      generateDocs(text, prompt)
      generateCodeConnect(text, prompt)
    } catch {
      setOutput('Error generating component. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const previewSrc = output
    ? URL.createObjectURL(
        new Blob(
        [`<html><body style="margin:0;padding:0;font-family:system-ui,sans-serif;background:#ffffff;color:#f5f5f5;box-sizing:border-box;">${output}</body></html>`],
          { type: 'text/html' }
        )
      )
    : ''

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">AI Component Scaffolder</h2>
        <p className="text-sm text-muted-foreground mt-2">
          Describe a component and generate scaffolded code, documentation, and a Code Connect file using the Forge token system.
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
              className="space-y-3"
            >
              {/* Tab bar */}
              <div className="flex gap-1 border-b border-border">
                {(['preview', 'docs', 'codeConnect'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 text-xs font-medium capitalize transition-colors cursor-pointer border-b-2 -mb-px ${
                      activeTab === tab
                        ? 'border-primary text-foreground'
                        : 'border-transparent text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {tab === 'codeConnect' ? 'Code Connect' : tab}
                    {tab === 'docs' && docsLoading && (
                      <span className="ml-1.5 inline-block w-2 h-2 rounded-full border border-current border-t-transparent animate-spin align-middle" />
                    )}
                    {tab === 'codeConnect' && codeConnectLoading && (
                      <span className="ml-1.5 inline-block w-2 h-2 rounded-full border border-current border-t-transparent animate-spin align-middle" />
                    )}
                  </button>
                ))}
              </div>

              {/* Preview tab */}
              {activeTab === 'preview' && (
              <div className="grid grid-cols-2 gap-4"
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
            </div>
              )}

              {/* Docs tab */}
              {activeTab === 'docs' && (
                <div className="min-h-96 space-y-6 p-2">
                  {docsLoading && !docs && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="w-3 h-3 rounded-full border-2 border-muted-foreground border-t-transparent animate-spin" />
                      Generating documentation…
                    </div>
                  )}
                  {docs && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                      <p className="text-sm text-foreground">{docs.description}</p>

                      {docs.props.length > 0 && (
                        <div className="space-y-2">
                          <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Props</h3>
                          <div className="rounded-lg border border-border overflow-hidden">
                            <table className="w-full text-xs">
                              <thead className="bg-muted">
                                <tr>{['Name','Type','Default','Description'].map(h => (
                                  <th key={h} className="text-left px-3 py-2 font-medium text-muted-foreground">{h}</th>
                                ))}</tr>
                              </thead>
                              <tbody>
                                {docs.props.map((p, i) => (
                                  <tr key={i} className="border-t border-border">
                                    <td className="px-3 py-2 font-mono text-primary">{p.name}</td>
                                    <td className="px-3 py-2 font-mono text-muted-foreground">{p.type}</td>
                                    <td className="px-3 py-2 font-mono text-muted-foreground">{p.default}</td>
                                    <td className="px-3 py-2">{p.description}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}

                      {docs.usage.length > 0 && (
                        <div className="space-y-2">
                          <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Usage</h3>
                          <ul className="space-y-1">
                            {docs.usage.map((note, i) => (
                              <li key={i} className="text-sm flex gap-2"><span className="text-accent">›</span>{note}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {docs.accessibility.length > 0 && (
                        <div className="space-y-2">
                          <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Accessibility</h3>
                          <ul className="space-y-1">
                            {docs.accessibility.map((note, i) => (
                              <li key={i} className="text-sm flex gap-2"><span className="text-warning">›</span>{note}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>
              )}
              {/* Code Connect tab */}
              {activeTab === 'codeConnect' && (
                <div className="min-h-96 space-y-3 p-2">
                  {codeConnectLoading && !codeConnect && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="w-3 h-3 rounded-full border-2 border-muted-foreground border-t-transparent animate-spin" />
                      Generating Code Connect file…
                    </div>
                  )}
                  {codeConnect && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono text-muted-foreground">figma.connect() stub</span>
                        <div className="flex gap-3">
                          <button
                            onClick={() => navigator.clipboard.writeText(codeConnect)}
                            className="text-xs text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                          >
                            Copy
                          </button>
                          <button
                            onClick={() => {
                              const blob = new Blob([codeConnect], { type: 'text/plain' })
                              const a = document.createElement('a')
                              a.href = URL.createObjectURL(blob)
                              a.download = `${prompt.trim().toLowerCase().replace(/\s+/g, '-')}.figma.ts`
                              a.click()
                            }}
                            className="text-xs text-primary hover:text-primary/80 cursor-pointer transition-colors"
                          >
                            Download .figma.ts
                          </button>
                        </div>
                      </div>
                      <pre className="rounded-lg bg-muted border border-border p-4 text-xs overflow-x-auto whitespace-pre-wrap text-foreground font-mono leading-relaxed h-96">
                        {codeConnect}
                      </pre>
                    </motion.div>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}

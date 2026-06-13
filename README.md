# Forge — AI-Powered Design System

A token-driven component library with an AI-assisted scaffolding pipeline. Built to demonstrate the intersection of design systems engineering, LLM-powered tooling, and modern frontend architecture.

## Token Architecture

Tokens are defined as CSS custom properties in layers:

Figma Variables → tokens.css (brand layer) → index.css (base + overrides) → Tailwind → Components

Brand tokens (`--brand-primary`, `--brand-accent`, `--brand-warning`) override shadcn base tokens, demonstrating how a brand layer sits on top of a base system. The Figma side maps variable collections 1:1 to these CSS custom properties via Code Connect.

## AI Scaffolding Pipeline

Describe a component in plain language → the pipeline generates three outputs in parallel:

1. **Component code** — production-ready HTML using the Forge token system
2. **Documentation** — auto-generated props table, usage guidelines, and accessibility notes
3. **Code Connect stub** — a `.figma.ts` file ready to drop into the repo, linking the component to its Figma node

**Example:** `a warning badge with label and icon` → scaffolded component, docs, and a downloadable `warning-badge-with-label-and-icon.figma.ts`

## Token Sync

Tokens can be synced directly from Figma Variables to `src/tokens.css` using the sync script:

```bash
npm run sync-tokens
```

Requires a Figma Enterprise plan and a personal access token with `file_content:read` scope. Add to `.env`:

```
FIGMA_TOKEN=your_token_here
FIGMA_FILE_ID=Wlb0SV32WtyJf6wfHDen1H
```

This closes the Figma → code token loop: designer updates a variable in Figma, run the sync, every token-wired component updates automatically.

## Stack

React 18 · TypeScript · Vite · Radix UI · shadcn/ui · Tailwind CSS v4 · Framer Motion · Storybook 10 · Claude API

## Figma

[View Forge Design System in Figma](https://www.figma.com/design/Wlb0SV32WtyJf6wfHDen1H/Forge-Design-System?node-id=0-1&t=SAcMRlJ8mqtVtDTY-1)

The Figma file defines three variable collections: `Primitives` (raw brand values), `Tokens` (semantic aliases with Light/Dark modes), and `Radius`. Components are built using `Tokens` variables — the same token names appear in both Figma and code. The Button component uses variant and disabled component properties wired to the token system.

## Running Locally

```bash
npm install
npm install -g vercel
vercel login
vercel link
vercel env pull .env.local  # pulls API key from Vercel
vercel dev                  # runs frontend + AI API together
```

Or without Vercel CLI, create a `.env` file manually:

```
ANTHROPIC_API_KEY=your_key_here
```

Then run `node server.js` in one tab and `npm run dev` in another.

```bash
npm run storybook  # component docs (separate tab, port 6006)
```

Requires `ANTHROPIC_API_KEY` in `.env` or pull from Vercel with `vercel env pull`.

---

Built by [Derek Rezendes](https://github.com/DARezendes)

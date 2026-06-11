# Forge — AI-Powered Design System

A token-driven component library with an AI-assisted scaffolding pipeline. Built to demonstrate the intersection of design systems engineering, LLM-powered tooling, and modern frontend architecture.

## Token Architecture

Tokens are defined as CSS custom properties in layers:

Figma Variables → tokens.css (brand layer) → index.css (base + overrides) → Tailwind → Components

Brand tokens (`--brand-primary`, `--brand-accent`, `--brand-warning`) override shadcn base tokens, demonstrating how a brand layer sits on top of a base system. The Figma side maps variable collections 1:1 to these CSS custom properties via Code Connect.

## AI Scaffolding Pipeline

Describe a component in plain language → Claude generates a production-ready TypeScript component using the Forge token system, shadcn/ui, Radix UI, CVA, and Tailwind. No boilerplate, no manual scaffolding.

**Example:** `a warning badge with label and icon` → fully typed `WarningBadge` with CVA variants, Lucide icons, and `--brand-warning` token.

## Stack

React 18 · TypeScript · Vite · Radix UI · shadcn/ui · Tailwind CSS v4 · Framer Motion · Storybook 10 · Claude API

## Figma

[View Forge Design System in Figma](https://www.figma.com/design/Wlb0SV32WtyJf6wfHDen1H/Forge-Design-System?node-id=0-1&t=SAcMRlJ8mqtVtDTY-1)

The Figma file defines the brand token layer with a `Brand Tokens` variable collection that maps 1:1 to the CSS custom properties in `tokens.css`. Components are built using those variables — the same token names appear in both Figma and code.

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

ANTHROPIC_API_KEY=your_key_here

Then run `node server.js` in one tab and `npm run dev` in another.

```bash
npm run storybook  # component docs (separate tab, port 6006)
```

Requires `ANTHROPIC_API_KEY` in `.env` or pull from Vercel with `vercel env pull`.

---

Built by [Derek Rezendes](https://github.com/DARezendes)

# Aerous Labs

The public site and internal control panel for Aerous Labs — an obsidian-and-cyan, glassmorphic showcase of the studio's on-device AI products, its live tool-transparency matrix, and its product roadmap.

## What this is

A single-page marketing site (hero, product showcase, transparency matrix, roadmap, contact) backed by a fully dynamic admin panel. Every piece of visible content — hero copy, the announcement banner, the system status label, the app catalogue, the AI tool list, per-app tool allocations, and the roadmap — is stored in a shared cloud database and edited from `/admin`, with no code changes or redeploys required. The public site polls for fresh content every few seconds so edits show up for visitors without a manual refresh.

## Key technologies

- **TanStack Start** (React 19 + TanStack Router) for file-based routing, server functions, and SSR
- **Tailwind CSS v4** for styling, with a custom obsidian/cyan/emerald design system and glassmorphism utilities
- **Framer Motion** for scroll reveals, hover tilt/glow, magnetic buttons, and other micro-interactions
- **Lucide Icons** for iconography
- **Netlify Database** (managed Postgres via Drizzle ORM) for apps, tools, tool allocations, roadmap items, site settings, and feedback
- **Netlify Blobs** for uploaded app icon images, served through a small Netlify Function at `/api/image/:key`
- **Netlify Functions / Vite plugin** for deployment on Netlify

## Running locally

```bash
npm install
npm run dev
```

This starts the Vite dev server on port 3000. To exercise Netlify-specific features (Database, Blobs, Functions) locally, run the project through the Netlify CLI instead:

```bash
netlify dev
```

## Admin panel

Visit `/admin` and sign in with the studio credentials to manage hero copy, the announcement banner, the system status label, the app catalogue (with image upload and per-tool percentage allocation), the tracked tool list, the roadmap, and incoming feedback.

# Suzy Parker Games — Website

The marketing website for Suzy Parker Games.

## Tech stack

| Tool | Purpose |
|---|---|
| [Vite](https://vitejs.dev) | Dev server and bundler |
| [TypeScript](https://www.typescriptlang.org) | Type-safe JS |
| [Tailwind CSS](https://tailwindcss.com) | Utility-first styling |
| [Cloudflare Pages](https://pages.cloudflare.com) | Hosting (via Wrangler) |

## Project structure

```
sp-website/
├── assets/
│   ├── cards/          # Playing card images (1.png–5.png, back_1.png, back_2.png)
│   └── sp-logo-header.png  # Brand logo
├── src/
│   ├── card.ts         # CardDeck class — scroll-driven card flip logic
│   ├── main.ts         # Entry point — Aurora background, CardDeck initialisation
│   └── style.css       # Tailwind base + custom component styles
├── index.html          # Home — scroll-driven playing card experience
├── privacy.html        # Privacy Policy — canonical for the whole game suite
├── terms.html          # Terms of Service — canonical for the whole game suite
├── vite.config.ts      # Multi-page build config
├── tailwind.config.js  # Custom fonts and brand colours
└── wrangler.jsonc      # Cloudflare Pages deployment config
```

## Getting started

**Prerequisites:** Node.js 18+

```bash
npm install
npm run dev
```

The dev server starts at `http://localhost:5173`.

## Available scripts

| Script | What it does |
|---|---|
| `npm run dev` | Start local dev server with HMR |
| `npm run build` | Type-check then build to `dist/` |
| `npm run preview` | Preview the production build locally |

## Deploying

The site deploys to Cloudflare Pages. Build output goes to `dist/`.

```bash
npm run build
npx wrangler pages deploy
```

Wrangler reads `wrangler.jsonc` and serves the `dist/` directory.

## Adding pages

1. Create a new `.html` file at the project root.
2. Add it to the `rollupOptions.input` object in `vite.config.ts`.
3. Copy the header/footer markup from an existing page.
4. Add it to the Project structure block above. There are six pages; if that
   block and `rollupOptions.input` disagree, the block is the one that is wrong.

## Legal pages

`privacy.html` and `terms.html` are the **canonical** Privacy Policy and Terms
of Service for every game Suzy Parker Games Limited makes, not just this site.
The apps link to them by URL (`the-middle-bit.co.uk/privacy.html` and
`/terms.html` 301 here), and app-store submissions pin these URLs, so the paths
must not change. Every claim on them is traced to code; see
`middlebit/docs/superpowers/notes/2026-10-06-legal-and-lockout-status.md` before
editing either one.

## Playing card — how it works

The home page (`index.html`) renders a 3D card that flips as the user scrolls. The logic lives in `src/card.ts`.

### `CardDeck`

```ts
new CardDeck(wrapperEl, frontImgEl, backImgEl, {
  frontFaces: [ { src: '...', alt: '...' }, ... ],
  backFaces:  [ { src: '...', alt: '...' }, ... ],
  totalRotations: 5, // optional, defaults to frontFaces.length
})
```

- Scroll progress (0–100%) maps to `totalRotations × 360°` of `rotateY` on the card wrapper.
- The front image advances by one each full rotation, cycling through `frontFaces`.
- The back image alternates through `backFaces` on the same cycle.
- Image swaps happen mid-flip (when the back face is visible) so the transition is invisible to the user.

To add more card faces, extend the `frontFaces` or `backFaces` arrays in `src/main.ts` — no other changes needed.

## Brand colours

Defined in `tailwind.config.js`:

| Name | Hex |
|---|---|
| `brand-pink` | `#EA98DA` |
| `brand-peach` | `#F3A9CA` |
| `brand-coral` | `#FFBEB6` |

These make up the header gradient used across all non-home pages.

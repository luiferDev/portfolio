# Contributing to LuiferDev Portfolio

Thank you for your interest in contributing! This document explains how to work with this project.

## 🏗️ Architecture

This project uses **Feature-Sliced Design (FSD)**. Before making changes, read [ARCHITECTURE.md](./ARCHITECTURE.md) to understand the structure.

**Quick rule**: Components live in layers based on responsibility:
- `shared/` → utilities, config, global styles
- `entities/` → domain objects (Project, Experience, Profile)
- `features/` → interactive user actions (LanguageSwitcher)
- `widgets/` → composite sections (Navbar, ProjectsSection)
- `app/` → layout wrappers

**Never** import from a higher layer into a lower layer (e.g., `shared` → `widgets`).

## 🚀 Getting Started

```bash
# Install dependencies
bun install

# Start dev server
bun dev

# Build for production
bun run build

# Preview production build
bun preview
```

## 📝 Making Changes

### Adding a New Component

1. **Decide the layer** based on responsibility (see Architecture above)
2. **Create the file** in the appropriate directory:
   ```bash
   # Example: adding a new entity component
   src/entities/my-entity/MyComponent.astro
   ```
3. **Export from barrel** in the layer's `index.ts`:
   ```typescript
   export { default as MyComponent } from './my-entity/MyComponent.astro';
   ```
4. **Import from the layer**, not the file directly:
   ```typescript
   import { MyComponent } from '../entities';
   ```

### Adding New Content

1. Add a `.md` file to the appropriate folder in `src/content/`
2. The schema in `src/content.config.ts` validates your content at build time
3. Content is fetched in widget components via `getCollection()`

### Styling Guidelines

- **Use inline Tailwind utilities** in templates for layout, spacing, typography
- **Use CSS variables** (`--glass-bg`, `--palette-accent`) for theme tokens
- **`@apply` only for element-level resets** in `global.css`
- **`.glass-*` classes** are the only exception — they use CSS variables for reusability

### TypeScript

- Project uses `astro/tsconfigs/strict` — maximum strictness
- **No `any` types** — always define proper interfaces
- Use `?.` and `??` for optional values
- Content schemas use Zod — types are inferred via `z.infer`

## 🧪 Testing

Currently no automated test framework is configured. Manual testing checklist:

- [ ] `bun dev` starts without errors
- [ ] `bun run build` completes successfully (all pages)
- [ ] All locales render correctly (`/`, `/en/`, `/fr/`)
- [ ] Animations work on first load (GSAP + ScrollTrigger)
- [ ] Navigation between sections works
- [ ] Mobile responsive layout is correct
- [ ] No console errors in browser DevTools

## 📦 Commit Convention

Use conventional commits:

```
feat: add certifications section
fix: correct hero image aspect ratio on mobile
docs: update architecture diagram
style: standardize button hover states
refactor: extract ProjectCard to entities layer
chore: update dependencies
```

## 🔧 Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

See `.env.example` for required variables (Sentry configuration).

## 📐 Code Style

- **Components**: PascalCase (`ProjectCard.astro`)
- **Files**: kebab-case for directories, PascalCase for components
- **Imports order**: Astro built-ins → external → internal → styles
- **Accessibility**: Always include `aria-label` on interactive elements, `alt` on images, `aria-hidden` on decorative SVGs

## 🐛 Reporting Issues

When reporting a bug, include:
1. Steps to reproduce
2. Expected vs actual behavior
3. Browser and OS
4. Screenshot if visual

## 📚 Resources

- [ARCHITECTURE.md](./ARCHITECTURE.md) — Project structure and conventions
- [Astro Docs](https://docs.astro.build) — Framework reference
- [Tailwind CSS Docs](https://tailwindcss.com/docs) — Styling reference
- [GSAP Docs](https://greensock.com/docs/) — Animation reference

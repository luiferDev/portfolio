# AGENTS.md - Portfolio Project Guidelines

## Project Overview
- **Type**: Static portfolio/resume website built with Astro 5
- **Package Manager**: bun
- **Key Dependencies**: Astro 5, Tailwind CSS 4, Zod, Astro Icon, Sharp

## Build Commands

### Development
```bash
bun dev        # Start dev server with hot reload
```

### Production
```bash
bun build      # Build for production (outputs to dist/)
bun preview    # Preview production build locally
```

### Astro CLI
```bash
bun astro <command>  # Run Astro commands (add, sync, etc.)
```

## Project Structure

```
src/
├── pages/           # Astro pages (file-based routing)
│   └── index.astro  # Main entry page
├── components/      # Reusable Astro components
│   └── *.astro      # Component files
├── layouts/         # Page layouts
│   └── Layout.astro
├── content/         # Content collections (Markdown)
│   ├── sections/    # About, intro sections
│   ├── experiences/ # Work experience entries
│   └── projects/    # Project entries
├── styles/          # Global CSS
│   └── global.css   # Tailwind + custom styles
└── assets/          # Images, SVGs, fonts
```

## Code Style Guidelines

### Astro Components
- Use frontmatter `---` fences at the top for logic
- Prefer template-first: minimal TypeScript in frontmatter
- Import ordering: Astro built-ins → external → internal components → styles

```astro
---
// Frontmatter (TypeScript)
import Layout from '../layouts/Layout.astro';
import { getCollection } from 'astro:content';
---

<!-- Template -->
<Layout>
  <!-- Use Tailwind classes directly -->
  <section class="max-w-2xl">
    <!-- ... -->
  </section>
</Layout>
```

### TypeScript
- Project uses `astro/tsconfigs/strict` - maximum strictness
- Always define types for props and data
- Use optional chaining and nullish coalescing for safety

### Tailwind CSS v4
- Use utility classes directly in templates
- Import Tailwind via `@import 'tailwindcss'` in global.css
- Common pattern: `@apply text-gray-300 pb-4;` in global.css for reusable styles
- Responsive: use `md:`, `lg:` prefixes

### Content Collections (Zod Schema)
- Define schemas in `src/content.config.ts`
- Use Zod for validation with meaningful error messages

```typescript
const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: 'src/content/projects' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    link: z.string().url().optional(),
  }),
});
```

### Naming Conventions
- **Components**: PascalCase (e.g., `About.astro`, `LuiferDev.astro`)
- **Files**: kebab-case for regular files
- **Content**: Use descriptive names (e.g., `Experience-1.md`)
- **CSS Classes**: Tailwind utilities - no custom CSS unless necessary

### Imports
```typescript
// Built-in Astro
import { getCollection, getEntry, render } from 'astro:content';

// External
import { defineConfig } from 'astro/config';
import { z } from 'astro:content';

// Internal
import Layout from '../layouts/Layout.astro';
import About from '../components/About.astro';
```

### Error Handling
- Throw descriptive errors in content loading
- Use optional chaining: `content?.data?.title`
- Validate content at build time via Zod schemas

### Accessibility
- Always include `aria-label` on interactive sections
- Use semantic HTML (`<section>`, `<article>`, `<h1>`-`<h6>`)

## TypeScript Strict Mode
The project enables strict TypeScript. Common rules:
- No implicit `any` - always type explicitly
- Null checks enabled (`strictNullChecks: true`)
- Use `?.` and `??` for optional values

## Testing
- This project does not currently have a test framework configured
- If adding tests, use Vitest (Astro's recommended test runner)
- Run single test: `bun run vitest --test-name-pattern="test name"`

## Configuration Files

### astro.config.mjs
- Uses `@tailwindcss/vite` plugin for Tailwind v4
- Includes `astro-icon` integration

### tsconfig.json
- Extends `astro/tsconfigs/strict`
- Strict null checks enabled

## Common Tasks

### Add New Content
1. Add `.md` file to appropriate folder in `src/content/`
2. Update schema in `src/content.config.ts` if new fields needed

### Add New Component
1. Create `src/components/NewComponent.astro`
2. Import and use in a page

### Modify Styles
- Global: Edit `src/styles/global.css`
- Per-component: Use Tailwind classes inline

## Dependencies
- **@tailwindcss/vite**: Tailwind CSS v4 integration
- **astro-icon**: Icon component
- **sharp**: Image optimization
- **@iconify-json/***: Icon sets (devicon, mdi, simple-icons)
- **gsap**: Animation library (install: `bun add gsap`, loaded via CDN in Layout)

---

# AI Agent Skills & Tools

This project uses AI agent skills that must be loaded automatically when working on specific tasks.

## Skill Auto-Loading Rules

When working on these contexts, you **MUST** load the corresponding skill FIRST:

| Context | Skill to Load | Trigger |
|---------|---------------|---------|
| Tailwind CSS styling | `tailwind-4` | Any CSS/Tailwind work |
| TypeScript code | `typescript` | Any TypeScript code |
| GSAP animations | `gsap` | Any animations, tweens, timelines |
| E2E testing | `playwright` | Writing browser tests |
| Security changes | `security-checklist` | New features, APIs, auth |
| Astro testing | `astro-testing` | Adding tests to Astro |

### How to Load Skills

```markdown
Use the `/skill` tool to load:
- skill(name: "tailwind-4")
- skill(name: "typescript")
- skill(name: "gsap")
- skill(name: "playwright")
- skill(name: "security-checklist")
- skill(name: "astro-testing")
```

## External Tools Integration

### Context7 - Best Practices
Use Context7 to get up-to-date documentation and best practices:

```
1. context7_resolve_library_id - Get library ID
2. context7_query_docs - Query specific patterns
```

**Common queries for this project:**
- "Astro 5 component patterns best practices"
- "TypeScript strict mode patterns"
- "Tailwind CSS v4 utility classes"
- "GSAP v3 animations with ScrollTrigger"
- "GSAP timeline sequencing best practices"

### Sentry - Error Tracking
If Sentry is integrated, use these tools for debugging:

```
- sentry_search_issues - Find issues
- sentry_get_sentry_resource - Get issue details
- sentry_analyze_issue_with_seer - AI root cause analysis
```

**When to use:**
- Investigating production errors
- Analyzing crash reports
- Getting fix recommendations from AI

### Playwright - E2E Testing
For browser automation and testing:

```
- playwright_browser_navigate
- playwright_browser_snapshot
- playwright_browser_click
- playwright_browser_fill_form
```

**When to use:**
- Visual regression testing
- Form interaction testing
- Cross-browser validation

## Testing Guidelines

### Unit/Component Tests
- Use **Vitest** (Astro's recommended)
- Run single test: `vitest run --test-name-pattern="test name"`

### E2E Tests
- Use **Playwright** for browser automation
- This project: no E2E tests yet, but Playwright is available globally

### Test Execution
```bash
# Single test
bun run vitest --test-name-pattern="component name"

# E2E with Playwright (if configured)
bunx playwright test
```

---

## Quick Reference

| Task | Skill | Tools |
|------|-------|-------|
| CSS/Tailwind work | `tailwind-4` | Context7 |
| TypeScript code | `typescript` | Context7 |
| GSAP animations | `gsap` | GSAP docs |
| Add tests | `astro-testing` | Vitest |
| E2E testing | `playwright` | Playwright CLI |
| Security features | `security-checklist` | - |
| Debug errors | - | Sentry tools |
| Research patterns | - | Context7 |

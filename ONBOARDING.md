# Onboarding Guide — LuiferDev Portfolio

Welcome! This guide will get you up and running with the portfolio project quickly.

## ⚡ 5-Minute Setup

```bash
# 1. Clone and install
git clone https://github.com/luiferDev/portfolio.git
cd portfolio
bun install

# 2. Set up environment (optional, for Sentry)
cp .env.example .env
# Edit .env with your Sentry credentials

# 3. Start developing
bun dev
```

Open `http://localhost:4321` — you should see the portfolio.

## 🗺️ Project Map

```
src/
├── app/layout/          → Main Layout.astro (HTML shell, meta tags, GSAP CDN)
├── entities/            → Domain components (ProjectCard, LuiferDev)
├── features/            → Interactive features (LanguageSwitcher)
├── widgets/             → Page sections (Navbar, Footer, *Section)
├── shared/              → Config, styles, utilities, Sentry
├── pages/               → Astro pages (file-based routing)
└── content/             → Markdown content (experiences, projects, etc.)
```

**Key concept**: This is a **static site**. All content is fetched at build time from Markdown files. There's no runtime API, no database, no server-side rendering.

## 🎯 Your First Task

Try adding a new project to the portfolio:

1. Create `src/content/projects/es/my-project.md`:
   ```markdown
   ---
   title: "My Project"
   description: "A cool project I built"
   image: "/project-placeholder.jpg"
   technologies: ["Astro", "TypeScript", "Tailwind"]
   link: "https://example.com"
   github: "https://github.com/luiferDev/my-project"
   ---

   Project description in markdown...
   ```

2. Run `bun dev` — the project should appear in the Projects section.

3. If it doesn't, check `src/content.config.ts` for the schema requirements.

## 🔑 Key Patterns to Know

### Content Fetching
```astro
---
// In a widget component (e.g., ProjectsSection.astro)
import { getCollection } from 'astro:content';

const allProjects = await getCollection('projects');
const projects = allProjects.filter(p => p.id.startsWith('es/'));
---

{projects.map(project => <ProjectCard {...project.data} />)}
```

### Translations
```astro
---
import { useTranslations } from '../../shared/config/i18n';
const t = useTranslations('es'); // or 'en', 'fr'
---

<h2>{t.projects.title}</h2>
```

### Animations (GSAP)
```astro
<script is:inline>
  document.addEventListener('DOMContentLoaded', () => {
    if (typeof gsap !== 'undefined') {
      gsap.from('.my-element', { y: 30, opacity: 0, duration: 0.5 });
    }
  });
</script>
```

## 🚨 Common Gotchas

| Problem | Solution |
|---------|----------|
| Build fails with "Cannot find module" | Check import paths — FSD layers use relative paths |
| Animations don't work on first load | GSAP must be loaded before scripts run (check Layout.astro) |
| Content not showing up | Verify the Markdown file matches the Zod schema in `content.config.ts` |
| TypeScript shows errors in barrel exports | `.astro` imports in `.ts` files show LSP errors — this is normal, build works |
| View Transitions not working | Intentionally disabled — incompatible with GSAP |

## 📖 Further Reading

- [ARCHITECTURE.md](./ARCHITECTURE.md) — Full architecture documentation
- [CONTRIBUTING.md](./CONTRIBUTING.md) — How to contribute
- [docs/adr/](./docs/adr/) — Architecture decision records
- [Astro Islands](https://docs.astro.build/en/concepts/islands/) — Astro's core concept

## 💬 Need Help?

- Check existing [GitHub Issues](https://github.com/luiferDev/portfolio/issues)
- Review [ARCHITECTURE.md](./ARCHITECTURE.md) for structure questions
- Check [CONTRIBUTING.md](./CONTRIBUTING.md) for coding standards

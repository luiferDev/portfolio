# Architecture Decision Records

## ADR-001: Feature-Sliced Design over Atomic Design

**Status**: Accepted  
**Date**: 2026-03-31  
**Context**: Portfolio restructuring for scalability

### Problem
The portfolio had a flat `src/components/` directory with 12+ components mixed together. No clear boundaries between reusable UI, domain entities, features, or composite sections. Adding new content types would increase cognitive load.

### Decision
Adopt **Feature-Sliced Design (FSD)** with layers: `shared`, `entities`, `features`, `widgets`, `app`.

### Alternatives Considered
- **Atomic Design** (atoms/molecules/organisms): Too abstract for content-driven sites. "Molecule" doesn't map well to Astro components.
- **DDD-style folders** (domain/application/infrastructure): Overkill for a static portfolio. No backend services.
- **Flat structure** (current): Simple but doesn't scale. Hard to find components as the project grows.

### Rationale
FSD provides clear import direction rules (lower layers can't import from higher layers), maps naturally to Astro's component model, and scales well as new content types are added. The `entities/` layer maps directly to content collections (Project, Experience, Education), while `widgets/` handles composite sections.

### Consequences
- ✅ Clear boundaries reduce cognitive load when adding features
- ✅ Import rules prevent circular dependencies
- ❌ More directory nesting (trade-off for clarity)
- ❌ Initial migration effort for existing components

---

## ADR-002: Inline Tailwind Utilities over @apply Abstractions

**Status**: Accepted  
**Date**: 2026-03-31  
**Context**: Styling standardization

### Problem
Global CSS contained `@apply` directives for element-level resets (`p`, `body`, `section`) and custom `.glass-*` classes. Mix of utility classes and CSS abstractions created inconsistent patterns.

### Decision
- **Keep `@apply` for element-level resets only** (`p`, `body`, `section`) — these are global defaults, not component styles.
- **Keep `.glass-*` classes** — they use CSS variables (not `@apply`) and represent truly reusable design patterns.
- **Use inline Tailwind utilities** in all component templates for layout, spacing, and typography.

### Alternatives Considered
- **Full @apply elimination**: Would bloat templates with repeated utility combinations for glass effects.
- **CSS Modules**: Adds build complexity, loses Tailwind's utility benefits.
- **CSS-in-JS**: Not suitable for Astro's static-first model.

### Rationale
Element-level resets are inherently global and belong in `global.css`. The `.glass-*` classes use CSS custom properties for theming and are reused across multiple components — extracting them to utilities would create massive class strings. Everything else should use inline utilities for maximum clarity and zero CSS abstraction overhead.

### Consequences
- ✅ Consistent styling pattern across components
- ✅ Zero CSS abstraction overhead for most styles
- ✅ Glass effects remain DRY via CSS variables
- ❌ Some templates have longer class strings (acceptable trade-off)

---

## ADR-003: Disable View Transitions for GSAP Compatibility

**Status**: Accepted  
**Date**: 2026-03-31  
**Context**: Animation stability

### Problem
Astro's `<ClientRouter />` (View Transitions) conflicts with GSAP animations. After navigation, all GSAP animations (ScrollTrigger, timelines, hover effects) stop working. Neither `astro:page-load`, `astro:after-swap`, nor `data-astro-rerun` reliably reinitialize GSAP across all components.

### Decision
Disable `<ClientRouter />` by commenting it out in `Layout.astro`.

### Alternatives Considered
- **astro:page-load reinitialization**: Works for simple animations but fails with ScrollTrigger (duplicate triggers, state corruption).
- **astro:after-swap + full cleanup**: Requires killing all ScrollTrigger instances and recreating them — complex and error-prone.
- **data-astro-rerun on all scripts**: Re-runs scripts but doesn't clean up previous GSAP instances, causing memory leaks and duplicate animations.
- **window.location.reload() on navigation**: Defeats the purpose of View Transitions entirely.

### Rationale
The portfolio is a single-page experience with anchor navigation and minimal cross-page navigation. View Transitions provide a nice UX improvement but are not critical. GSAP animations (hero entrance, skill bands, timeline clock, scroll-triggered sections) are core to the portfolio's visual identity and must work reliably.

### Consequences
- ✅ All GSAP animations work reliably on every page load
- ✅ No animation state corruption or memory leaks
- ❌ Full page reload on navigation (no smooth transitions)
- ❌ Slightly slower perceived navigation speed

### Future Work
Revisit when Astro 5.x improves View Transitions + GSAP compatibility, or consider migrating to CSS transitions for simpler animations.

---

## ADR-004: Sentry for Error Tracking over Custom Logging

**Status**: Accepted  
**Date**: 2026-03-31  
**Context**: Observability

### Problem
No error monitoring was configured. Build errors and runtime issues went undetected until manually discovered.

### Decision
Use `@sentry/astro` for error tracking and performance monitoring.

### Alternatives Considered
- **Custom error logging**: Requires building infrastructure, storing logs, and creating dashboards.
- **LogRocket/FullStory**: Session replay is overkill for a static portfolio.
- **No monitoring**: Unacceptable for a production portfolio.

### Rationale
Sentry's Astro integration is officially supported, provides source map upload for accurate error locations, and includes performance monitoring out of the box. The free tier is sufficient for a personal portfolio's traffic.

### Consequences
- ✅ Automatic error capture with stack traces
- ✅ Performance monitoring for page loads
- ✅ Source maps for accurate error locations
- ❌ Requires environment variables for configuration
- ❌ External dependency on Sentry service

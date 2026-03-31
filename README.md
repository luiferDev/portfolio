# LuiferDev Portfolio

[![Astro](https://img.shields.io/badge/Astro-3.x-brightgreen.svg)](https://astro.build)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.x-38bdf8.svg)](https://tailwindcss.com)
[![GSAP](https://img.shields.io/badge/GSAP-3.x-88ce02.svg)](https://greensock.com/gsap/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> A modern, fast, and accessible portfolio website built with Astro 5, showcasing my skills as a Full Stack Developer specializing in React, TypeScript, .NET, and modern web technologies.

![LuiferDev Portfolio Preview](https://via.placeholder.com/1200x600/222222/ffffff?text=LuiferDev+Portfolio+Preview)

## ✨ Features

- 🚀 **Blazing Fast**: Built with Astro 5 for optimal performance (0 JavaScript by default)
- 🌓 **Dark Mode Elegant**: Sophisticated dark theme with glowing accents
- ⚡ **Smooth Animations**: Powered by GSAP for delightful micro-interactions
- 📱 **Fully Responsive**: Looks stunning on all devices from mobile to desktop
- ♿ **Accessibility First**: WCAG 2.1 compliant with proper ARIA labels and semantic HTML
- 🔍 **SEO Optimized**: Complete meta tags, structured data, and sitemap
- 🌐 **Multi-language Support**: Spanish, English, and French (i18n ready)
- 📱 **View Transitions**: Smooth page transitions (when compatible)
- 🎨 **Modern Design**: Glassmorphism effects, animated PS5-inspired navbar, and interactive skill bars

## 🛠️ Tech Stack

- **Framework**: [Astro 5](https://astro.build)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (strict mode)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com) with custom utilities
- **Animations**: [GSAP 3](https://greensock.com/gsap/) & [ScrollTrigger](https://greensock.com/gsap/)
- **Icons**: [Astro Icon](https://github.com/withastro/astro-icon) + Heroicons
- **Images**: Optimized with [Sharp](https://sharp.pixelplaza.com/)
- **Typography**: [Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk) & [Inter](https://rsms.me/inter/)
- **Deployment**: Vercel / Netlify / GitHub Pages

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [bun](https://bun.sh/) (recommended) or npm/pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/luiferDev/portfolio.git
cd portfolio

# Install dependencies with bun (recommended)
bun install

# Or with npm
# npm install
```

### Development Server

```bash
# Start the development server at http://localhost:4321
bun dev
```

### Production Build

```bash
# Build for production
bun build

# Preview the production build locally
bun preview
```

## 📁 Project Structure

```
src/
├── components/     # Reusable UI components
│   ├── About.astro
│   ├── Experience.astro
│   ├── Education.astro
│   ├── Projects.astro
│   ├── Certifications.astro
│   ├── Skills.astro
│   ├── Navbar.astro
│   ├── LanguageSwitcher.astro
│   ├── Footer.astro
│   ├── LuiferDev.astro
│   └── Welcome.astro
├── content/        # Content collections (Markdown)
│   ├── experiences/  # Work experience entries
│   ├── projects/     # Project showcases
│   └── sections/     # About, intro sections
├── layouts/        # Page layouts
│   └── Layout.astro
├── pages/          # Pages (file-based routing)
│   ├── index.astro         # Home page
│   ├── [locale]/index.astro # Localized home
│   └── projects/[locale]/[slug]/index.astro # Project pages
├── styles/         # Global styles
│   └── global.css  # Tailwind + custom styles
└── assets/         # Images, SVGs, fonts
```

## 🎯 Key Components

### 🖥️ PS5-Inspired Navbar
- Floating animated navbar with interactive power button
- Smooth color-shifting hover effects
- Mobile-friendly dropdown menu

### 📊 Interactive Skills Section
- Animated skill bands with hover pause
- Technology categorization and proficiency visualization

### ⏱️ Experience Timeline
- Animated clock timeline showing professional journey
- Detailed work descriptions with technologies used
- Visual progression through career milestones

### 💼 Projects Showcase
- Filterable project cards with live/code links
- Technology badges and deployment status
- Responsive grid layout with hover animations

### 🎓 Education & Certifications
- Academic background with institution details
- Professional certifications with verification links
- Timeline-based presentation

## 🌐 Multi-language Support

The portfolio supports three languages:
- **Spanish** (es) - Primary language
- **English** (en) - International audience
- **French** (fr) - Additional language support

Language detection happens automatically from browser settings or URL prefix (`/es/`, `/en/`, `/fr/`).

## 🔧 Customization

To personalize this portfolio for yourself:

1. **Update Content**: Edit Markdown files in `src/content/`
2. **Modify Styles**: Adjust `src/styles/global.css` for theme changes
3. **Update Configuration**: Modify `src/i18n/config.ts` for language strings
4. **Change Assets**: Replace images in `public/` and `src/assets/`
5. **Update Metadata**: Edit SEO information in `src/layouts/Layout.astro`

## 📱 Responsive Design Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px
- **Large Desktop**: > 1280px

## 🤝 Contributing

While this is a personal portfolio, I appreciate feedback and suggestions! If you find any issues or have ideas for improvement:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Astro Documentation](https://docs.astro.build) - For the incredible framework
- [Tailwind CSS](https://tailwindcss.com) - For the utility-first CSS framework
- [GSAP](https://greensock.com/gsap/) - For the animation library
- [Heroicons](https://heroicons.com) - For the beautiful SVG icons
- [Unsplash](https://unsplash.com) - For background inspiration (if applicable)

## 📬 Contact

[![Portfolio](https://img.shields.io/badge/Portfolio-luiferdev.com-222222.svg)](https://luiferdev.com)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Visit-blue.svg)](https://www.linkedin.com/in/jorge-morales-cruz/)
[![GitHub](https://img.shields.io/badge/GitHub-Follow-181717.svg)](https://github.com/luiferDev)
[![Email](https://img.shields.io/badge/Email-Contact-red.svg)](mailto:luifer991@protonmail.com)

---

⭐️ If you like this portfolio template, consider giving it a star! It helps others discover it.

**Built with passion by LuiferDev** 🚀
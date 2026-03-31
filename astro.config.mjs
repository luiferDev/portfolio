// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import icon from 'astro-icon';

import sitemap from '@astrojs/sitemap';

import sentryAstro from '@sentry/astro';

// https://astro.build/config
export default defineConfig({
	site: 'https://luiferdev.com',
	i18n: {
		defaultLocale: 'es',
		locales: ['es', 'en', 'fr'],
		routing: {
			prefixDefaultLocale: false,
		},
	},
	vite: {
		plugins: [tailwindcss()],
	},

	integrations: [
		icon(),
		sitemap(),
		sentryAstro({
			// Sentry options
			sourceMapsUploadOptions: {
				org: process.env.SENTRY_ORG,
				project: process.env.SENTRY_PROJECT,
				authToken: process.env.SENTRY_AUTH_TOKEN,
			},
		}),
	],
});

import { defineCollection, z } from 'astro:content';

import { glob } from 'astro/loaders';

const contents = defineCollection({
	loader: glob({
		pattern: '**/*.md',
		base: 'src/content/sections',
	}),
	schema: z.object({
		title: z.string(),
	}),
});

export const collections = { contents };

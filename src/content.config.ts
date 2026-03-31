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

enum workType {
	Remote = 'Remote',
	Onsite = 'Onsite',
	Hybrid = 'Hybrid',
}

const experiences = defineCollection({
	loader: glob({
		pattern: '**/*.md',
		base: 'src/content/experiences',
	}),
	schema: z.object({
		company: z.string(),
		role: z.string(),
		work: z
			.string()
			.refine(
				(val) => Object.values(workType).includes(val as workType),
				{
					message:
						'Work type must be one of Remote, Onsite, or Hybrid.',
				}
			),
		initial: z.string(),
		final: z.string(),
	}),
});

enum projectStatus {
	Completed = 'Completed',
	InProgress = 'InProgress',
	Planned = 'Planned',
}

const projects = defineCollection({
	loader: glob({
		pattern: '**/*.md',
		base: 'src/content/projects',
	}),
	schema: z.object({
		title: z.string(),
		title_en: z.string().optional(),
		title_fr: z.string().optional(),
		description: z.string(),
		description_en: z.string().optional(),
		description_fr: z.string().optional(),
		fullDescription: z.string(),
		fullDescription_en: z.string().optional(),
		fullDescription_fr: z.string().optional(),
		image: z.string(),
		technologies: z.array(z.string()),
		features: z.array(z.string()),
		features_en: z.array(z.string()).optional(),
		features_fr: z.array(z.string()).optional(),
		status: z
			.string()
			.refine(
				(val) => Object.values(projectStatus).includes(val as projectStatus),
				{
					message:
						'Status must be one of Completed, InProgress, or Planned.',
				}
			),
		year: z.number(),
		frontend: z.string().optional(),
		backend: z.string().optional(),
		link: z.string().url().optional(),
		github: z.string().url().optional(),
	}),
});

export const collections = { contents, experiences, projects };

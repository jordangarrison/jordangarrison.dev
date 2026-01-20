import type { PageServerLoad } from './$types';
import type { BlogPost, BlogCategory } from '$lib/blog/blog.model';
import { sortPostsByDate } from '$lib/blog/blog.utils';

export const load: PageServerLoad = async ({ url }) => {
	const postModules = import.meta.glob('/src/posts/*.md', { eager: true });

	const posts: BlogPost[] = [];

	for (const [path, module] of Object.entries(postModules)) {
		const slug = path.split('/').pop()?.replace('.md', '') ?? '';
		const mod = module as {
			metadata: {
				title: string;
				date: string;
				excerpt: string;
				categories: BlogCategory[];
				tags: string[];
				published: boolean;
				readingTime?: string;
			};
		};

		if (mod.metadata?.published) {
			posts.push({
				slug,
				title: mod.metadata.title,
				date: mod.metadata.date,
				excerpt: mod.metadata.excerpt,
				categories: mod.metadata.categories,
				tags: mod.metadata.tags,
				published: mod.metadata.published,
				readingTime: mod.metadata.readingTime ?? '3 min read'
			});
		}
	}

	const sortedPosts = sortPostsByDate(posts);

	// Get unique categories from posts
	const usedCategories = new Set<BlogCategory>();
	for (const post of posts) {
		for (const cat of post.categories) {
			usedCategories.add(cat);
		}
	}

	const category = url.searchParams.get('category') as BlogCategory | 'all' | null;
	const search = url.searchParams.get('search') ?? '';
	const page = parseInt(url.searchParams.get('page') ?? '1', 10);

	return {
		posts: sortedPosts,
		categories: Array.from(usedCategories),
		filters: {
			category: category ?? 'all',
			search,
			page
		}
	};
};

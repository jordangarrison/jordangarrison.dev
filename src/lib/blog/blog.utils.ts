import type { BlogPost, BlogCategory } from './blog.model';

export function calculateReadingTime(content: string): string {
	const wordsPerMinute = 200;
	const words = content.trim().split(/\s+/).length;
	const minutes = Math.ceil(words / wordsPerMinute);
	return `${minutes} min read`;
}

export function formatDate(dateString: string): string {
	const date = new Date(dateString);
	return date.toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	});
}

export function sortPostsByDate(posts: BlogPost[]): BlogPost[] {
	return [...posts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function filterPostsByCategory(
	posts: BlogPost[],
	category: BlogCategory | 'all'
): BlogPost[] {
	if (category === 'all') {
		return posts;
	}
	return posts.filter((post) => post.categories.includes(category));
}

export function searchPosts(posts: BlogPost[], query: string): BlogPost[] {
	if (!query.trim()) {
		return posts;
	}
	const lowerQuery = query.toLowerCase();
	return posts.filter(
		(post) =>
			post.title.toLowerCase().includes(lowerQuery) ||
			post.excerpt.toLowerCase().includes(lowerQuery) ||
			post.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
	);
}

export function paginatePosts(
	posts: BlogPost[],
	page: number,
	perPage: number = 6
): { posts: BlogPost[]; totalPages: number; currentPage: number } {
	const totalPages = Math.ceil(posts.length / perPage);
	const start = (page - 1) * perPage;
	const paginatedPosts = posts.slice(start, start + perPage);

	return {
		posts: paginatedPosts,
		totalPages,
		currentPage: page
	};
}

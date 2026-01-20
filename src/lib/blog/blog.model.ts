export type BlogCategory = 'engineering' | 'nix' | 'devops' | 'personal' | 'tutorial';

export interface BlogPost {
	slug: string;
	title: string;
	date: string;
	excerpt: string;
	categories: BlogCategory[];
	tags: string[];
	published: boolean;
	readingTime: string;
}

export interface BlogCategoryInfo {
	key: BlogCategory | 'all';
	title: string;
}

export const blogCategories: BlogCategoryInfo[] = [
	{ key: 'all', title: 'All' },
	{ key: 'engineering', title: 'Engineering' },
	{ key: 'nix', title: 'Nix' },
	{ key: 'devops', title: 'DevOps' },
	{ key: 'personal', title: 'Personal' },
	{ key: 'tutorial', title: 'Tutorial' }
];

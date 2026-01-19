export type PortfolioProject = {
	id: number;
	title: string;
	description: string;
	githubUrl: string;
	liveUrl: string | null;
	downloadUrl: string | null;
	techStack: string[];
	features: string[];
};

export type PortfolioCategory = 'tools' | 'nix' | 'ai';

export type PortfolioGroup = {
	key: PortfolioCategory;
	title: string;
	projects: PortfolioProject[];
};

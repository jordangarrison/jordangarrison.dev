import type { PortfolioProject, PortfolioGroup } from './portfolio.model';

export const toolsProjects: PortfolioProject[] = [
	{
		id: 1,
		title: 'yoink',
		description:
			'Automatically revoke exposed credentials before they can be exploited. A security automation tool with a plugin architecture for credential detection and revocation.',
		githubUrl: 'https://github.com/jordangarrison/yoink',
		liveUrl: null,
		downloadUrl: 'https://github.com/jordangarrison/yoink/releases/latest',
		techStack: ['Go', 'Plugin Architecture', 'Security'],
		features: [
			'Automatic credential detection',
			'Plugin-based revocation engines',
			'Multiple credential type support',
			'CI/CD integration ready',
			'Extensible architecture'
		]
	},
	{
		id: 2,
		title: 'hubctl',
		description:
			'A comprehensive CLI tool for GitHub Enterprise administration with full API integration, multiple output formats, and interactive prompts.',
		githubUrl: 'https://github.com/jordangarrison/hubctl',
		liveUrl: null,
		downloadUrl: 'https://github.com/jordangarrison/hubctl/releases/latest',
		techStack: ['Ruby', 'Thor', 'Octokit', 'TTY'],
		features: [
			'Full GitHub API integration',
			'Multiple output formats: table, JSON, list',
			'Interactive prompts and confirmations',
			'Batch operations support',
			'Enterprise-ready authentication'
		]
	},
	{
		id: 3,
		title: 'whats-my-status',
		description:
			'Multi-platform CLI tool to set your status on Slack and GitHub simultaneously from the command line.',
		githubUrl: 'https://github.com/jordangarrison/whats-my-status',
		liveUrl: null,
		downloadUrl: 'https://github.com/jordangarrison/whats-my-status/releases/latest',
		techStack: ['Go', 'CLI', 'YAML'],
		features: [
			'Multi-platform support (Windows, macOS, Linux)',
			'Slack and GitHub status sync',
			'Custom status aliases',
			'Time-based expiration',
			'YAML configuration'
		]
	},
	{
		id: 11,
		title: 'vitals',
		description:
			'Personal health data explorer - import, visualize, and own your health data from multiple sources.',
		githubUrl: 'https://github.com/jordangarrison/vitals',
		liveUrl: null,
		downloadUrl: null,
		techStack: ['TypeScript', 'Bun', 'Elysia', 'htmx', 'SQLite'],
		features: [
			'Import 4.6M+ Apple Health records',
			'MacroFactor nutrition analysis with 52 micronutrients',
			'Interactive charts for 100+ health metrics',
			'Workout GPS route visualization with Leaflet.js',
			'ECG waveform display and FHIR clinical records',
			'Multi-user support, self-hosted and privacy-focused'
		]
	},
	{
		id: 12,
		title: 'sweet-nothings',
		description:
			'Whisper sweet nothings to your Linux computer - terminal-based dictation tool powered by whisper.cpp.',
		githubUrl: 'https://github.com/jordangarrison/sweet-nothings',
		liveUrl: null,
		downloadUrl: null,
		techStack: ['Rust', 'whisper.cpp', 'TUI', 'Nix'],
		features: [
			'Local speech-to-text transcription',
			'No cloud required - fully offline',
			'TUI with visual feedback and audio level meter',
			'Auto-paste to clipboard with window manager integration',
			'Automatic model downloading and management',
			'XDG-compliant configuration with Nix flake packaging'
		]
	},
	{
		id: 15,
		title: 'greenlight',
		description:
			'GitHub Actions workflow visualizer built with Phoenix LiveView. View CI/CD pipelines as interactive DAGs.',
		githubUrl: 'https://github.com/jordangarrison/greenlight',
		liveUrl: null,
		downloadUrl: null,
		techStack: ['Elixir', 'Phoenix LiveView', 'Svelte', 'Nix'],
		features: [
			'Interactive DAG visualization of workflows',
			'Real-time polling of workflow run status',
			'Expandable job nodes with dependency graphs',
			'Dashboard for followed orgs and bookmarked repos',
			'Pipeline view per commit with dependency resolution'
		]
	}
];

export const nixProjects: PortfolioProject[] = [
	{
		id: 4,
		title: 'nix-config',
		description:
			'My personal nix configurations for the computers I use.',
		githubUrl: 'https://github.com/jordangarrison/nix-config',
		liveUrl: null,
		downloadUrl: null,
		techStack: ['Nix', 'NixOS', 'Home Manager', 'Flakes', 'Emacs Lisp'],
		features: [
			'Fully declarative system configuration',
			'Reproducible across machines',
			'Home Manager integration',
			'Flakes-based architecture',
			'Development environment shells'
		]
	},
	{
		id: 5,
		title: 'nix-packages',
		description:
			'Custom Nix packages and overlays for software not yet in nixpkgs or requiring custom configurations.',
		githubUrl: 'https://github.com/jordangarrison/nix-packages',
		liveUrl: null,
		downloadUrl: null,
		techStack: ['Nix', 'Flakes', 'Packaging'],
		features: [
			'Custom package definitions',
			'Flakes-based distribution',
			'Easy to consume as overlay',
			'Reproducible builds'
		]
	},
	{
		id: 6,
		title: 'warp-preview-flake',
		description:
			'Warp Terminal (preview) packaged from .deb on NixOS. Bringing modern terminal tools to the Nix ecosystem.',
		githubUrl: 'https://github.com/jordangarrison/warp-preview-flake',
		liveUrl: null,
		downloadUrl: null,
		techStack: ['Nix', 'Flakes', 'Packaging'],
		features: [
			'Warp Terminal on NixOS',
			'Automated .deb extraction',
			'Flake-based installation',
			'Preview version tracking'
		]
	},
	{
		id: 7,
		title: 'aws-tools',
		description:
			'A collection of CLI utilities for working with AWS services, packaged with Nix for reproducible environments.',
		githubUrl: 'https://github.com/jordangarrison/aws-tools',
		liveUrl: null,
		downloadUrl: null,
		techStack: ['Python', 'AWS', 'Nix', 'CLI'],
		features: [
			'Multiple AWS service utilities',
			'Nix-packaged for reproducibility',
			'SSO-friendly workflows',
			'Scripting-ready design'
		]
	},
	{
		id: 8,
		title: 'aws-use-sso',
		description:
			'Small utility to export AWS environment variables to your shell in an SSO environment.',
		githubUrl: 'https://github.com/jordangarrison/aws-use-sso',
		liveUrl: null,
		downloadUrl: null,
		techStack: ['Nix', 'AWS', 'SSO', 'Shell'],
		features: [
			'AWS SSO integration',
			'Environment variable export',
			'Shell-friendly output',
			'Nix flake packaging'
		]
	}
];

export const aiProjects: PortfolioProject[] = [
	{
		id: 9,
		title: 'agents',
		description:
			'Personal micro agents for productivity - agentic tools are the new dotfiles.',
		githubUrl: 'https://github.com/jordangarrison/agents',
		liveUrl: null,
		downloadUrl: null,
		techStack: ['TypeScript', 'Claude', 'Claude Code', 'Shell', 'Nix'],
		features: [
			'Composable micro agents',
			'AI-powered productivity tools',
			'Personal automation workflows',
			'MCP integration',
			'Extensible design'
		]
	},
	{
		id: 10,
		title: 'let-me-gpt-that-for-you',
		description:
			"A clone of 'Let me Google that for you' but for AI chats. Create shareable links with pre-filled prompts for ChatGPT, Gemini, and Claude.",
		githubUrl: 'https://github.com/jordangarrison/let-me-gpt-that-for-you',
		liveUrl: 'https://www.lmgpt4u.com/',
		downloadUrl: null,
		techStack: ['SvelteKit', 'TypeScript', 'TailwindCSS', 'Vercel'],
		features: [
			'Multiple AI providers supported',
			'Shareable pre-filled prompt links',
			'Realistic chat simulation',
			'Responsive modern UI'
		]
	},
	{
		id: 13,
		title: 'wiggle-puppy',
		description:
			'A Ralph Wiggum loop implementation - autonomous AI agent loop runner that repeatedly executes an AI agent until task completion.',
		githubUrl: 'https://github.com/jordangarrison/wiggle-puppy',
		liveUrl: null,
		downloadUrl: null,
		techStack: ['Rust', 'CLI', 'AI Agents', 'Nix'],
		features: [
			'Stateful prompts re-read each iteration',
			'PRD tracking with story-based progress',
			'Automatic completion detection',
			'Event-driven architecture for TUI/CLI',
			'Graceful cancellation support'
		]
	},
	{
		id: 14,
		title: 'panko',
		description:
			'Breadcrumbs for AI coding sessions - view and share Claude Code transcripts via web viewer and tunnels.',
		githubUrl: 'https://github.com/jordangarrison/panko',
		liveUrl: null,
		downloadUrl: null,
		techStack: ['Rust', 'Web', 'Cloudflare Tunnels', 'Nix'],
		features: [
			'View Claude Code sessions in web browser',
			'Share sessions via Cloudflare, ngrok, or Tailscale tunnels',
			'TUI for browsing session transcripts',
			'Nix flake with configurable tunnel providers'
		]
	}
];

export const projectGroups: PortfolioGroup[] = [
	{ key: 'tools', title: 'Tools', projects: toolsProjects },
	{ key: 'nix', title: 'Nix Ecosystem', projects: nixProjects },
	{ key: 'ai', title: 'AI & Fun', projects: aiProjects }
];

<script lang="ts">
	import {
		Card,
		CardBody,
		CardHeader,
		Badge,
		Button,
		Row,
		Col,
		Nav,
		NavItem,
		NavLink
	} from '@sveltestrap/sveltestrap';

	let activeFilter = $state('all');

	// Tools (CLI/DevOps)
	const toolsProjects = [
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
		}
	];

	// Nix Ecosystem
	const nixProjects = [
		{
			id: 4,
			title: 'nix-config',
			description:
				'My personal NixOS configurations for reproducible system setups across all my machines. Declarative, version-controlled infrastructure for personal computing.',
			githubUrl: 'https://github.com/jordangarrison/nix-config',
			liveUrl: null,
			downloadUrl: null,
			techStack: ['Nix', 'NixOS', 'Home Manager', 'Flakes'],
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
				'Warp Terminal (preview) packaged from .deb for NixOS. Bringing modern terminal tools to the Nix ecosystem.',
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

	// AI & Fun
	const aiProjects = [
		{
			id: 9,
			title: 'agents',
			description:
				'Personal micro agents for productivity. Agentic tools are the new dotfiles - small, composable AI-powered utilities for everyday tasks.',
			githubUrl: 'https://github.com/jordangarrison/agents',
			liveUrl: null,
			downloadUrl: null,
			techStack: ['TypeScript', 'AI', 'Claude', 'MCP'],
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
		}
	];

	const projectGroups = [
		{ key: 'tools', title: 'Tools', projects: toolsProjects },
		{ key: 'nix', title: 'Nix Ecosystem', projects: nixProjects },
		{ key: 'ai', title: 'AI & Fun', projects: aiProjects }
	];

	const filteredGroups = $derived(
		activeFilter === 'all' ? projectGroups : projectGroups.filter((g) => g.key === activeFilter)
	);
</script>

<svelte:head>
	<title>Portfolio - Jordan Garrison</title>
</svelte:head>

<div class="portfolio-container">
	<div class="title">
		<h1>My Portfolio</h1>
		<p class="lead">A collection of projects I've built and deployed</p>
	</div>

	<div class="filter-tabs">
		<Nav tabs>
			<NavItem>
				<NavLink active={activeFilter === 'all'} href="#" onclick={() => (activeFilter = 'all')}>
					All
				</NavLink>
			</NavItem>
			{#each projectGroups as group}
				<NavItem>
					<NavLink
						active={activeFilter === group.key}
						href="#"
						onclick={() => (activeFilter = group.key)}
					>
						{group.title}
					</NavLink>
				</NavItem>
			{/each}
		</Nav>
	</div>

	<div class="projects">
		{#each filteredGroups as group}
			<div class="project-group">
				<h3 class="group-title">{group.title}</h3>
				{#each group.projects as project}
					<Card class="mb-3 project-card">
						<CardHeader>
							<h4 class="project-title">{project.title}</h4>
						</CardHeader>
						<CardBody>
							<p class="project-description">{project.description}</p>

							<div class="features-section">
								<h5>Features:</h5>
								<ul class="features-list">
									{#each project.features as feature}
										<li>{feature}</li>
									{/each}
								</ul>
							</div>

							<div class="tech-stack">
								<h5>Tech Stack:</h5>
								<div class="badges">
									{#each project.techStack as tech}
										<Badge color="secondary" class="me-1 mb-1">{tech}</Badge>
									{/each}
								</div>
							</div>

							<Row class="mt-3">
								<Col>
									<Button
										color="primary"
										outline
										href={project.githubUrl}
										target="_blank"
										rel="noopener noreferrer"
										class={project.liveUrl || project.downloadUrl ? 'me-2' : ''}
									>
										View Source
									</Button>
									{#if project.liveUrl}
										<Button
											color="success"
											href={project.liveUrl}
											target="_blank"
											rel="noopener noreferrer"
										>
											Live Demo
										</Button>
									{/if}
									{#if project.downloadUrl}
										<Button
											color="info"
											href={project.downloadUrl}
											target="_blank"
											rel="noopener noreferrer"
										>
											Download
										</Button>
									{/if}
								</Col>
							</Row>
						</CardBody>
					</Card>
				{/each}
			</div>
		{/each}
	</div>
</div>

<style>
	.portfolio-container {
		padding: 1rem;
		align-self: center;
		align-items: center;
		flex: 1;
		display: flex;
		flex-direction: column;
		width: 100%;
		max-width: 1024px;
		margin: 0 auto;
		box-sizing: border-box;
	}

	.title {
		text-align: center;
		margin-top: 50px;
		margin-bottom: 50px;
	}

	.title h1 {
		font-size: 2.5rem;
		margin-bottom: 1rem;
	}

	.lead {
		font-size: 1.2rem;
		color: #6c757d;
		margin-bottom: 0;
	}

	.projects {
		width: 100%;
	}

	.filter-tabs {
		margin-bottom: 2rem;
	}

	.project-group {
		margin-bottom: 2.5rem;
	}

	.group-title {
		font-size: 1.5rem;
		font-weight: 600;
		color: #333;
		margin-bottom: 1rem;
		padding-bottom: 0.5rem;
		border-bottom: 2px solid #dee2e6;
	}

	:global(.project-card) {
		border: 1px solid #eaeaea;
		border-radius: 8px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		transition: box-shadow 0.3s ease;
	}

	:global(.project-card:hover) {
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
	}

	.project-title {
		font-size: 1.5rem;
		margin-bottom: 0;
		color: #333;
	}

	.project-description {
		font-size: 1rem;
		line-height: 1.6;
		margin-bottom: 1.5rem;
		color: #555;
	}

	.features-section {
		margin-bottom: 1.5rem;
	}

	.features-section h5 {
		font-size: 1.1rem;
		margin-bottom: 0.5rem;
		color: #333;
	}

	.features-list {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.features-list li {
		padding: 0.25rem 0;
		font-size: 0.9rem;
		color: #555;
	}

	.tech-stack {
		margin-bottom: 1rem;
	}

	.tech-stack h5 {
		font-size: 1.1rem;
		margin-bottom: 0.5rem;
		color: #333;
	}

	.badges {
		display: flex;
		flex-wrap: wrap;
		gap: 0.25rem;
	}

	@media (max-width: 768px) {
		.title h1 {
			font-size: 2rem;
		}

		.lead {
			font-size: 1rem;
		}
	}
</style>

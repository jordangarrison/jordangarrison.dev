<script lang="ts">
	import { Card, CardBody, CardHeader, Badge, Button, Row, Col } from '@sveltestrap/sveltestrap';

	const projects = [
		{
			id: 1,
			title: "hubctl",
			description: "A comprehensive, production-ready CLI tool for GitHub administration with full API integration, multiple output formats, interactive prompts, and beautiful error handling.",
			githubUrl: "https://github.com/jordangarrison/hubctl",
			liveUrl: null,
			downloadUrl: "https://github.com/jordangarrison/hubctl/releases/latest",
			techStack: ["Ruby", "Thor", "Octokit", "TTY-Prompt", "TTY-Table", "TTY-Spinner", "Pastel"],
			features: [
				"🚀 Full GitHub API integration (Octokit)",
				"🎨 Multiple output formats: table, JSON, list",
				"🛡️ Comprehensive error handling with helpful messages",
				"🎯 Interactive prompts and confirmation dialogs",
				"⚡ Loading spinners for long-running operations",
				"🔐 Flexible authentication via env vars or config file",
				"🔄 Batch operations and scripting-friendly design"
			]
		},
		{
			id: 2,
			title: "Let Me GPT That For You",
			description: "A modern clone of 'Let me Google that for you' but for AI chat interfaces! Create shareable links that demonstrate different AI providers (ChatGPT, Gemini, Claude) with custom questions.",
			githubUrl: "https://github.com/jordangarrison/let-me-gpt-that-for-you",
			liveUrl: "https://www.lmgpt4u.com/",
			techStack: ["SvelteKit", "TypeScript", "TailwindCSS", "DaisyUI", "Vercel"],
			features: [
				"🤖 Support for multiple AI providers (ChatGPT, Gemini, Claude)",
				"🔗 Generate unique shareable URLs for each query",
				"💬 Realistic chat interface simulation",
				"📱 Responsive design with modern UI",
				"⚡ Built with SvelteKit for fast performance",
				"🚀 Ready for Vercel deployment"
			]
		},
		{
			id: 3,
			title: "What's My Status?",
			description: "Multi-platform CLI tool that allows you to set your status on multiple platforms (Slack, GitHub) at once from the command line.",
			githubUrl: "https://github.com/jordangarrison/whats-my-status",
			liveUrl: null,
			downloadUrl: "https://github.com/jordangarrison/whats-my-status/releases/latest",
			techStack: ["Go", "CLI", "YAML"],
			features: [
				"🚀 Multi-platform support (Windows, macOS, Linux)",
				"💬 Slack workspace status management",
				"🐙 GitHub user status integration",
				"⚡ Custom status aliases for quick setup",
				"⏰ Time-based status expiration",
				"🔧 YAML-based configuration"
			]
		}
	];
</script>

<svelte:head>
	<title>Portfolio - Jordan Garrison</title>
</svelte:head>

<div class="portfolio-container">
	<div class="title">
		<h1>My Portfolio</h1>
		<p class="lead">A collection of projects I've built and deployed</p>
	</div>

	<div class="projects">
		{#each projects as project}
			<Card class="mb-4 project-card">
				<CardHeader>
					<h2 class="project-title">{project.title}</h2>
				</CardHeader>
				<CardBody>
					<p class="project-description">{project.description}</p>
					
					<div class="features-section">
						<h4>Features:</h4>
						<ul class="features-list">
							{#each project.features as feature}
								<li>{feature}</li>
							{/each}
						</ul>
					</div>

					<div class="tech-stack">
						<h4>Tech Stack:</h4>
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
								class={(project.liveUrl || project.downloadUrl) ? "me-2" : ""}
							>
								<i class="bi bi-github me-1"></i>
								View Source
							</Button>
							{#if project.liveUrl}
								<Button 
									color="success" 
									href={project.liveUrl} 
									target="_blank" 
									rel="noopener noreferrer"
								>
									<i class="bi bi-box-arrow-up-right me-1"></i>
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
									<i class="bi bi-download me-1"></i>
									Download
								</Button>
							{/if}
						</Col>
					</Row>
				</CardBody>
			</Card>
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

	:global(.project-card) {
		border: 1px solid #eaeaea;
		border-radius: 8px;
		box-shadow: 0 2px 4px rgba(0,0,0,0.1);
		transition: box-shadow 0.3s ease;
	}

	:global(.project-card:hover) {
		box-shadow: 0 4px 8px rgba(0,0,0,0.15);
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

	.features-section h4 {
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

	.tech-stack h4 {
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


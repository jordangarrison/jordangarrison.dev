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
	import { projectGroups } from '$lib/portfolio.data';

	let activeFilter = $state('all');

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

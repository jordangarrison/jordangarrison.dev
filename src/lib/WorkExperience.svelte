<script lang="ts">
	import {
		Card,
		CardBody,
		CardImg,
		CardSubtitle,
		CardTitle,
		Row,
		Col,
		CardHeader,
		CardFooter,
		Badge
	} from '@sveltestrap/sveltestrap';
	import type { WE } from '$lib/WorkExperience.model';

	interface Props {
		workExperience: WE;
	}

	let { workExperience }: Props = $props();
</script>

<div class="work-experience" id={workExperience.meta.id}>
	<Card class="work-experience-card">
		<CardHeader class="work-experience-header">
			<Row class="align-items-center">
				<Col xs={12} sm={2} class="text-center">
					<div class="company-logo">
						<CardImg src={workExperience.meta.image} alt={`${workExperience.meta.company} logo`} />
					</div>
				</Col>
				<Col xs={12} sm={10}>
					<div class="work-experience-info">
						<CardTitle class="position-title">{workExperience.meta.title}</CardTitle>
						<CardSubtitle class="company-name">
							<a href={workExperience.meta.url} target="_blank" rel="noopener noreferrer">
								{workExperience.meta.company}
							</a>
						</CardSubtitle>
						{#if workExperience.meta.promotions && workExperience.meta.promotions.length > 0}
							<div class="promotions">
								{#each workExperience.meta.promotions as promotion, i}
									<span class="promotion-item">
										{promotion.title} ({promotion.date}){#if i < workExperience.meta.promotions.length - 1}<span
												class="promotion-arrow"
											>
												→
											</span>{/if}
									</span>
								{/each}
							</div>
						{/if}
						<div class="employment-period">
							<Badge color="secondary" class="date-badge">
								{workExperience.meta.date.start} - {workExperience.meta.date.end}
							</Badge>
						</div>
					</div>
				</Col>
			</Row>
		</CardHeader>

		<CardBody class="work-experience-body">
			<div class="achievements">
				{#each workExperience.body as achievement}
					<div class="achievement-item">
						<h5 class="achievement-title">{achievement.title}</h5>
						<p class="achievement-description">{achievement.description}</p>
					</div>
				{/each}
			</div>
		</CardBody>
	</Card>
</div>

<style>
	.work-experience {
		width: 100%;
		max-width: 1200px;
		margin: 2rem auto;
		padding: 0 1rem;
	}

	:global(.work-experience-card) {
		border: 1px solid #dee2e6;
		border-radius: 8px;
		overflow: hidden;
		transition: all 0.3s ease;
	}

	:global(.work-experience-card:hover) {
		box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
		transform: translateY(-2px);
	}

	:global(.work-experience-header) {
		background-color: #f8f9fa;
		border-bottom: 1px solid #dee2e6;
		padding: 2rem 1.5rem;
	}

	.company-logo {
		width: 80px;
		height: 80px;
		border-radius: 8px;
		overflow: hidden;
		margin: 0 auto;
		background: white;
		padding: 8px;
		border: 1px solid #dee2e6;
	}

	.company-logo :global(img) {
		width: 100%;
		height: 100%;
		object-fit: contain;
		border-radius: 4px;
	}

	.work-experience-info {
		padding-left: 1rem;
	}

	:global(.position-title) {
		font-size: 1.5rem;
		font-weight: 700;
		margin-bottom: 0.5rem;
		color: #212529;
	}

	:global(.company-name) {
		font-size: 1.1rem;
		font-weight: 500;
		margin-bottom: 0.75rem;
		color: #6c757d;
	}

	:global(.company-name a) {
		color: #0d6efd;
		text-decoration: none;
		transition: color 0.2s ease;
	}

	:global(.company-name a:hover) {
		color: #0b5ed7;
		text-decoration: underline;
	}

	.promotions {
		margin-top: 0.5rem;
		margin-bottom: 0.5rem;
		font-size: 0.9rem;
		color: #495057;
		line-height: 1.6;
	}

	.promotion-item {
		white-space: nowrap;
	}

	.promotion-arrow {
		color: #6c757d;
	}

	.employment-period {
		margin-top: 0.5rem;
	}

	:global(.work-experience-body) {
		padding: 2rem;
	}

	.achievements {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.achievement-item {
		padding: 1.5rem;
		background: #ffffff;
		border-radius: 6px;
		border: 1px solid #e9ecef;
		transition: all 0.2s ease;
	}

	.achievement-item:hover {
		border-color: #dee2e6;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
		transform: translateX(2px);
	}

	.achievement-title {
		font-size: 1.125rem;
		font-weight: 600;
		color: #212529;
		margin-bottom: 0.75rem;
	}

	.achievement-description {
		color: #495057;
		line-height: 1.6;
		margin-bottom: 0;
		font-size: 0.95rem;
	}

	@media (max-width: 768px) {
		.work-experience-info {
			padding-left: 0;
			text-align: center;
			margin-top: 1rem;
		}

		:global(.position-title) {
			font-size: 1.25rem;
		}

		:global(.company-name) {
			font-size: 1rem;
		}

		.promotions {
			font-size: 0.8rem;
		}

		.promotion-item {
			display: block;
			white-space: normal;
		}

		.promotion-arrow {
			display: block;
			margin: 0.25rem 0;
		}

		:global(.work-experience-header) {
			padding: 1.5rem 1rem;
		}

		:global(.work-experience-body) {
			padding: 1.5rem;
		}

		.achievement-item {
			padding: 1rem;
		}
	}
</style>

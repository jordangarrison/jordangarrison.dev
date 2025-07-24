<script lang="ts">
	import { Col, Row, Image } from '@sveltestrap/sveltestrap';
	import WorkExperience from '$lib/WorkExperience.svelte';
	import { workExperiences } from '$lib/workExperience.data';
</script>

<svelte:head>
	<title>Hi I'm Jordan</title>
</svelte:head>

<div class="page-container">
	<div class="hero-section">
		<Row class="align-items-center">
			<Col xs={12} sm={6} md={4} lg={4}>
				<div class="profile-picture">
					<Image
						class="rounded-circle"
						fluid
						src="https://avatars.githubusercontent.com/u/22905777?v=4"
						alt="profile-picture"
					/>
				</div>
			</Col>

			<Col xs={12} sm={6} md={8} lg={8}>
				<div class="title">
					<h1>Hi I'm Jordan</h1>
					<h3>A Cloud Infrastructure Engineer</h3>
				</div>
			</Col>
		</Row>
	</div>

	<div class="work-experience-section">
		<h2 class="section-title">My Work Experience</h2>
		{#each workExperiences as workExperience}
			<WorkExperience {workExperience} />
		{/each}
	</div>
</div>

<style>
	.page-container {
		width: 100%;
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem 1rem;
	}

	.hero-section {
		margin-bottom: 4rem;
	}

	.profile-picture {
		width: 100%;
		max-width: 300px;
		margin: 0 auto;
	}

	.title {
		text-align: center;
		padding: 2rem 0;
	}

	.title h1 {
		font-size: 2.5rem;
		font-weight: 700;
		color: #212529;
		margin-bottom: 1rem;
	}

	.title h3 {
		font-size: 1.5rem;
		font-weight: 400;
		color: #6c757d;
		margin-bottom: 0;
	}

	.work-experience-section {
		margin-top: 2rem;
	}

	.section-title {
		font-size: 2rem;
		font-weight: 600;
		color: #212529;
		text-align: center;
		margin-bottom: 3rem;
		position: relative;
	}

	.section-title::after {
		content: '';
		position: absolute;
		bottom: -10px;
		left: 50%;
		transform: translateX(-50%);
		width: 80px;
		height: 3px;
		background: #6c757d;
		border-radius: 2px;
	}

	@media (max-width: 768px) {
		.page-container {
			padding: 1rem;
		}

		.title {
			padding: 1rem 0;
		}

		.title h1 {
			font-size: 2rem;
		}

		.title h3 {
			font-size: 1.25rem;
		}

		.section-title {
			font-size: 1.5rem;
			margin-bottom: 2rem;
		}
	}
</style>

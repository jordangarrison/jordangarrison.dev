<script lang="ts">
	import WorkExperience from '$lib/WorkExperience.svelte';
	import { workExperiences } from '$lib/workExperience.data';
</script>

<svelte:head>
	<title>Experience - Jordan Garrison</title>
</svelte:head>

<div class="experience-container">
	<div class="title">
		<h1>Work Experience</h1>
		<p class="lead">My professional journey through tech</p>
	</div>

	<div class="work-experience-section">
		{#each workExperiences as workExperience}
			<WorkExperience {workExperience} />
		{/each}
	</div>
</div>

<style>
	.experience-container {
		padding: 1rem;
		max-width: 900px;
		margin: 0 auto;
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

	.work-experience-section {
		margin-top: 2rem;
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

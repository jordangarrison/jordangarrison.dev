<script lang="ts">
	import { CardText, Col, Row } from 'sveltestrap'
	import WorkExperience from '$lib/WorkExperience.svelte'
	import { workExperiences } from '$lib/workExperience.data'

	export const prerender = true
</script>

<svelte:head>
	<title>Hi I'm Jordan</title>
</svelte:head>

<div class="title">
	<h1>Hi I'm Jordan</h1>
	<h3>A Cloud Infrastructure Engineer</h3>
</div>

<div class="work-experience">
	<h2 class="work-experience-h2">My Work Experience</h2>
	{#each workExperiences as workExperience}
		<WorkExperience workExperience={workExperience.meta}>
			{#each workExperience.body as line}
				<CardText>
					<Row>
						<Col class="col-lg-3 col-md-2 col-sm-12 col-12"
							><span class="we-item-title text-muted">{line.title}</span></Col
						>
						<Col class="col-lg-9 col-md-10 col-sm-12 col-12"
							><span class="we-item-description">{line.description}</span></Col
						>
					</Row>
				</CardText>
			{/each}
		</WorkExperience>
	{/each}
</div>

<style>
	.title {
		text-align: center;
		margin-top: 50px;
	}

	.work-experience {
		margin-top: 50px;
	}

	.we-item-title {
		font-size: 0.8em;
		float: left;
	}

	.we-item-description {
		float: left;
		font-size: 0.8em;
	}

	div {
		padding: 1rem;
		align-self: center;
		align-items: center;
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 1rem;
		width: 100%;
		max-width: 1024px;
		margin: 0 auto;
		box-sizing: border-box;
	}
</style>

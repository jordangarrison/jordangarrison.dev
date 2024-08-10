<script lang="ts">
	import { CardText, Col, Row, Image } from '@sveltestrap/sveltestrap';
	import WorkExperience from '$lib/WorkExperience.svelte';
	import { workExperiences } from '$lib/workExperience.data';
</script>

<svelte:head>
	<title>Hi I'm Jordan</title>
</svelte:head>

<div>
	<Row>
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

<div class="work-experience">
	<h2 class="work-experience-h2">My Work Experience</h2>
	{#each workExperiences as workExperience}
		<WorkExperience workExperience={workExperience.meta}>
			{#each workExperience.body as line}
				<CardText>
					<Row>
						<Col xs={12} sm={12} md={2} lg={3}
							><span class="we-item-title text-muted">{line.title}</span></Col
						>
						<Col xs={12} sm={12} md={10} lg={9}
							><span class="we-item-description">{line.description}</span></Col
						>
					</Row>
				</CardText>
			{/each}
		</WorkExperience>
	{/each}
</div>

<style>
	.profile-picture {
		width: 100%;
		max-width: 300px;
	}
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

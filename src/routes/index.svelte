<script lang="ts">
	import { CardText, Col, Row } from 'sveltestrap'
	import WorkExperience from '$lib/WorkExperience.svelte'
	import type { WE } from '$lib/WorkExperience.model'
	import { listen } from 'svelte/internal'

	export const prerender = true

	const workExperiences: WE[] = [
		{
			meta: {
				title: 'Infrastructure Engineer',
				company: 'FloSports',
				image: 'https://www.flosports.tv/wp-content/uploads/2020/04/Hawk-ignite.png',
				url: 'https://www.flosports.tv',
				date: {
					start: 'November 2019',
					end: 'Present'
				}
			},
			body: [
				{ title: 'Load Testing Platform', description: 'test' },
				{ title: 'Traffic Replay', description: '' },
				{ title: 'Flo Deploy', description: 'test2' },
				{ title: 'Datadog', description: 'onboarding' }
			]
		},
		{
			meta: {
				title: 'Big Data Platform Engineer',
				company: 'General Motors',
				image:
					'https://media.gm.com/dld/content/dam/Shared/Images/Logos/gm/GM_Gradient_Brandmark_RGB-2021.jpg/_jcr_content/renditions/cq5dam.web.1280.1280.jpeg',
				url: 'https://www.gm.com',
				date: {
					start: 'May 2017',
					end: 'November 2019'
				}
			},
			body: [
				{ title: 'Toil', description: 'test2' },
				{ title: 'Yarn Queue Manager', description: 'test' },
				{ title: 'Ranger/Atlas', description: 'test3' }
			]
		},
		{
			meta: {
				title: 'Lab Technician',
				company: 'Lynntech',
				image:
					'https://res.cloudinary.com/crunchbase-production/image/upload/c_lpad,h_170,w_170,f_auto,b_white,q_auto:eco,dpr_1/ap98zhetk0hi50n2ilgd',
				url: 'https://www.lynntech.com',
				date: {
					start: 'May 2016',
					end: 'May 2017'
				}
			},
			body: [
				{ title: 'Iodine Detection Kit', description: 'test' },
				{ title: 'Desalination Monitor', description: 'test' }
			]
		}
	]
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
						<Col class="md-2"><span class="we-item-title text-muted">{line.title}</span></Col>
						<Col class="md-8"><span class="we-item-description">{line.description}</span></Col>
					</Row>
					<!-- {line} -->
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

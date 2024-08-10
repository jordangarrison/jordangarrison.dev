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
		CardFooter
	} from '@sveltestrap/sveltestrap';
	import type { WEMeta } from '$lib/WorkExperience.model';

	export let workExperience: WEMeta = {
		title: 'Job Name',
		company: 'Company Name',
		image: 'https://via.placeholder.com/150',
		url: 'https://www.google.com',
		date: {
			start: '01/01/2019',
			end: '01/01/2019'
		}
	};
	let title = workExperience.title;
	let company = workExperience.company;
	let image = workExperience.image;
</script>

<div class="we-row">
	<Card>
		<CardHeader>
			<div class="we-title">
				<CardTitle>{title}</CardTitle>
			</div>
			<div class="we-subtitle">
				<CardSubtitle class="text-muted">{company}</CardSubtitle>
			</div>
		</CardHeader>
		<Row>
			<Col xs={12} sm={2} md={2} lg={2}>
				<div class="we-image">
					<CardImg src={image} top alt="Work Experience Image" />
				</div>
			</Col>
			<Col xs={12} sm={10} md={10} lg={10}>
				<div class="we-body">
					<CardBody><slot /></CardBody>
				</div>
			</Col>
		</Row>
		<CardFooter class="text-muted">
			<CardSubtitle>
				<span class="we-date">
					<i class="fa fa-calendar-alt" />
					<span class="we-date-start">{workExperience.date.start}</span>
					<span class="we-date-end">{workExperience.date.end}</span>
				</span>
			</CardSubtitle>
		</CardFooter>
	</Card>
</div>

<style>
	.we-row {
		width: 90%;
		margin: 20px auto;
		text-align: left;
		max-width: 1000px;
	}

	.we-image {
		width: 100px;
		padding: 20px;
	}

	.we-title {
		font-size: 1.5em;
		font-weight: bold;
	}

	.we-subtitle {
		font-size: 1.2em;
		font-weight: bold;
	}

	.we-body {
		flex: 1;
		flex-direction: column;
		font-size: 1.1em;
		line-height: 1.1em;
		float: left;
	}

	.we-date {
		font-size: 0.8em;
	}

	.we-date-start {
		float: left;
	}
	.we-date-end {
		float: right;
	}
</style>

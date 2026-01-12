<script lang="ts">
	import { Card, CardBody, Badge, Row, Col, Image } from '@sveltestrap/sveltestrap';
</script>

<svelte:head>
	<title>Jordan Garrison</title>
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
					<h3>Engineer | Lifelong learner. Relentlessly curious.</h3>
				</div>
			</Col>
		</Row>
	</div>

	<section class="intro-section">
		<Card>
			<CardBody>
				<p class="intro-text">
					Passionate about my family, Open Source, Linux, Jiu Jitsu, and being actively involved in
					my local church.
				</p>
				<p class="philosophy">
					<a href="https://grugbrain.dev" target="_blank" rel="noopener noreferrer"
						>Complexity very bad. Say no to complexity.</a
					>
				</p>
			</CardBody>
		</Card>
	</section>

	<section class="journey-section">
		<h2>My Journey</h2>
		<div class="journey-timeline">
			<div class="journey-item">
				<div class="journey-year">2012-2017</div>
				<div class="journey-content">
					<strong>Texas A&M University</strong>
					<p>
						B.S. Physics with Math Minor. Started with Higgs Boson simulations in the Department of
						Physics and Astronomy, running C++ and Bash on distributed computing clusters.
					</p>
				</div>
			</div>
			<a href="/experience#lynntech" class="journey-item journey-link">
				<div class="journey-year">2016-2017</div>
				<div class="journey-content">
					<strong>Lynntech</strong>
					<p>
						Research Technician building IoT prototypes with Python, Arduino, and Raspberry Pi.
						Hardware meets software.
					</p>
				</div>
			</a>
			<a href="/experience#gm" class="journey-item journey-link">
				<div class="journey-year">2017-2019</div>
				<div class="journey-content">
					<strong>General Motors</strong>
					<p>
						Big Data Platform Engineer managing 15PB Hadoop clusters. Built monitoring systems,
						security frameworks, and automation tools in Go and Python.
					</p>
				</div>
			</a>
			<a href="/experience#flosports" class="journey-item journey-link">
				<div class="journey-year">2019-Present</div>
				<div class="journey-content">
					<strong>FloSports</strong>
					<p>
						From Infrastructure Engineer to Tech Lead, SRE. Building developer platforms, driving
						cloud migrations, and establishing SRE practices.
					</p>
				</div>
			</a>
		</div>
	</section>

	<section class="skills-section">
		<h2>Skills</h2>
		<Row>
			<Col md={6} class="mb-3">
				<Card class="skill-card">
					<CardBody>
						<h4>Languages</h4>
						<div class="skill-badges">
							<Badge color="primary">Go</Badge>
							<Badge color="primary">TypeScript</Badge>
							<Badge color="primary">Python</Badge>
							<Badge color="primary">Bash</Badge>
							<Badge color="primary">Ruby</Badge>
						</div>
					</CardBody>
				</Card>
			</Col>
			<Col md={6} class="mb-3">
				<Card class="skill-card">
					<CardBody>
						<h4>Platforms</h4>
						<div class="skill-badges">
							<Badge color="secondary">Kubernetes</Badge>
							<Badge color="secondary">Istio</Badge>
							<Badge color="secondary">Argo</Badge>
							<Badge color="secondary">Fastly</Badge>
							<Badge color="secondary">Kafka</Badge>
						</div>
					</CardBody>
				</Card>
			</Col>
			<Col md={6} class="mb-3">
				<Card class="skill-card">
					<CardBody>
						<h4>Infrastructure as Code</h4>
						<div class="skill-badges">
							<Badge color="info">Terraform</Badge>
							<Badge color="info">CDK</Badge>
							<Badge color="info">Helm</Badge>
							<Badge color="info">Kustomize</Badge>
							<Badge color="info">Nix</Badge>
						</div>
					</CardBody>
				</Card>
			</Col>
			<Col md={6} class="mb-3">
				<Card class="skill-card">
					<CardBody>
						<h4>Observability</h4>
						<div class="skill-badges">
							<Badge color="warning">Datadog</Badge>
							<Badge color="warning">Prometheus</Badge>
							<Badge color="warning">Grafana</Badge>
							<Badge color="warning">ELK</Badge>
						</div>
					</CardBody>
				</Card>
			</Col>
		</Row>
		<div class="linux-note">
			<Card>
				<CardBody>
					<strong>Linux?</strong> Yes please! Especially love NixOS.
				</CardBody>
			</Card>
		</div>
	</section>

	<section class="awards-section">
		<h2>Awards & Certifications</h2>
		<ul class="awards-list">
			<li><strong>Advanced GitOps Certification</strong> - Akuity, 2024</li>
			<li><strong>Promotion to Tech Lead</strong> - FloSports, 2023</li>
			<li><strong>Top Performer - Own It Award</strong> - FloSports, 2021</li>
			<li><strong>Promotion to Senior Infrastructure Engineer</strong> - FloSports, 2021</li>
			<li><strong>CEO Life Saving Award & CIO Safety Award</strong> - General Motors, 2019</li>
			<li><strong>Early Promotion from New College Hire Program</strong> - General Motors, 2019</li>
			<li><strong>CIO Distinguished New College Hire</strong> - General Motors, 2018 & 2019</li>
		</ul>
	</section>
</div>

<style>
	.page-container {
		padding: 1rem;
		max-width: 900px;
		margin: 0 auto;
	}

	.hero-section {
		margin-bottom: 3rem;
		margin-top: 2rem;
	}

	.profile-picture {
		width: 100%;
		max-width: 250px;
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

	section {
		margin-bottom: 3rem;
	}

	section h2 {
		font-size: 1.75rem;
		font-weight: 600;
		color: #333;
		margin-bottom: 1.5rem;
		padding-bottom: 0.5rem;
		border-bottom: 2px solid #dee2e6;
	}

	.intro-section :global(.card) {
		background: #f8f9fa;
		border: none;
	}

	.intro-text {
		font-size: 1.1rem;
		line-height: 1.8;
		color: #495057;
		margin-bottom: 1rem;
	}

	.philosophy {
		font-size: 1.2rem;
		color: #333;
		font-style: italic;
	}

	.philosophy a {
		color: #0d6efd;
		text-decoration: none;
	}

	.philosophy a:hover {
		text-decoration: underline;
	}

	.journey-timeline {
		position: relative;
		padding-left: 2rem;
		border-left: 3px solid #dee2e6;
	}

	.journey-item {
		position: relative;
		margin-bottom: 2rem;
		padding-left: 1rem;
		display: block;
		text-decoration: none;
		color: inherit;
	}

	.journey-link {
		cursor: pointer;
		transition: transform 0.2s ease;
	}

	.journey-link:hover {
		transform: translateX(5px);
	}

	.journey-link:hover .journey-content strong {
		color: #0d6efd;
	}

	.journey-item::before {
		content: '';
		position: absolute;
		left: -2.45rem;
		top: 0.25rem;
		width: 12px;
		height: 12px;
		background: #0d6efd;
		border-radius: 50%;
	}

	.journey-year {
		font-size: 0.9rem;
		font-weight: 600;
		color: #6c757d;
		margin-bottom: 0.25rem;
	}

	.journey-content strong {
		font-size: 1.1rem;
		color: #333;
		transition: color 0.2s ease;
	}

	.journey-content p {
		margin-top: 0.5rem;
		margin-bottom: 0;
		color: #495057;
		line-height: 1.6;
	}

	:global(.skill-card) {
		height: 100%;
		border: 1px solid #dee2e6;
	}

	:global(.skill-card) h4 {
		font-size: 1rem;
		font-weight: 600;
		margin-bottom: 0.75rem;
		color: #333;
	}

	.skill-badges {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.linux-note {
		margin-top: 1rem;
	}

	.linux-note :global(.card) {
		background: #f8f9fa;
		border: 1px dashed #dee2e6;
		text-align: center;
	}

	.awards-list {
		list-style: none;
		padding: 0;
	}

	.awards-list li {
		padding: 0.75rem 0;
		border-bottom: 1px solid #eee;
		color: #495057;
	}

	.awards-list li:last-child {
		border-bottom: none;
	}

	.awards-list strong {
		color: #333;
	}

	@media (max-width: 768px) {
		.title h1 {
			font-size: 2rem;
		}

		.title h3 {
			font-size: 1.25rem;
		}

		.journey-timeline {
			padding-left: 1.5rem;
		}

		.journey-item::before {
			left: -1.95rem;
		}
	}
</style>

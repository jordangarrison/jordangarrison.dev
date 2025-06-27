<script lang="ts">
	import { Image, Row, Col } from '@sveltestrap/sveltestrap';

	interface Props {
		page: any;
	}

	let { page }: Props = $props();
</script>

<Row>
	<Col xs={12} sm={6}>
		<div class="building-construction">
			<Image src="/building-construction.svg" fluid alt="building-construction" />
		</div>
	</Col>
	<Col xs={12} sm={6}>
		<div>
			<h1>This page</h1>
			<h1>
				<code>{page}</code>
			</h1>
			<h1>is under construction</h1>
		</div>
	</Col>
</Row>

<style>
	.building-construction {
		width: 50%;
		max-width: 150px;
		margin: 20px auto;
	}

	div {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		margin: 20px auto;
	}

	h1 {
		font-weight: bold;
		font-size: 1rem;
	}
</style>

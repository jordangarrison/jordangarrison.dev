<script lang="ts">
	import { Badge, Button } from '@sveltestrap/sveltestrap';
	import { formatDate } from '$lib/blog/blog.utils';

	let { data } = $props();

	const { content: Content, metadata, readingTime } = data;
</script>

<svelte:head>
	<title>{metadata.title} - Jordan Garrison</title>
</svelte:head>

<div class="post-container">
	<article class="post">
		<header class="post-header">
			<a href="/blog" class="back-link">Back to Blog</a>
			<h1>{metadata.title}</h1>
			<div class="post-meta">
				<span class="date">{formatDate(metadata.date)}</span>
				<span class="reading-time">{readingTime}</span>
			</div>
			<div class="badges">
				{#each metadata.categories as category}
					<Badge color="primary" class="me-1">{category}</Badge>
				{/each}
				{#each metadata.tags as tag}
					<Badge color="secondary" class="me-1">{tag}</Badge>
				{/each}
			</div>
		</header>

		<div class="post-content prose">
			<Content />
		</div>

		<footer class="post-footer">
			<Button color="secondary" outline href="/blog">Back to Blog</Button>
		</footer>
	</article>
</div>

<style>
	.post-container {
		padding: 1rem;
		width: 100%;
		max-width: 800px;
		margin: 0 auto;
		box-sizing: border-box;
	}

	.post {
		margin-top: 50px;
	}

	.post-header {
		margin-bottom: 2rem;
	}

	.back-link {
		display: inline-block;
		color: #6c757d;
		text-decoration: none;
		margin-bottom: 1rem;
		font-size: 0.9rem;
	}

	.back-link:hover {
		color: #333;
		text-decoration: underline;
	}

	.post-header h1 {
		font-size: 2.5rem;
		margin-bottom: 1rem;
		line-height: 1.2;
	}

	.post-meta {
		display: flex;
		gap: 1rem;
		font-size: 0.9rem;
		color: #6c757d;
		margin-bottom: 1rem;
	}

	.badges {
		display: flex;
		flex-wrap: wrap;
		gap: 0.25rem;
	}

	.post-content {
		line-height: 1.8;
		font-size: 1.1rem;
	}

	.post-content :global(h2) {
		font-size: 1.75rem;
		margin-top: 2rem;
		margin-bottom: 1rem;
	}

	.post-content :global(h3) {
		font-size: 1.4rem;
		margin-top: 1.5rem;
		margin-bottom: 0.75rem;
	}

	.post-content :global(p) {
		margin-bottom: 1.25rem;
	}

	.post-content :global(code) {
		background-color: #f4f4f4;
		padding: 0.2rem 0.4rem;
		border-radius: 4px;
		font-size: 0.9em;
	}

	.post-content :global(pre) {
		background-color: #1e1e1e;
		color: #d4d4d4;
		padding: 1rem;
		border-radius: 8px;
		overflow-x: auto;
		margin-bottom: 1.5rem;
	}

	.post-content :global(pre code) {
		background: none;
		padding: 0;
		color: inherit;
	}

	.post-content :global(blockquote) {
		border-left: 4px solid #dee2e6;
		padding-left: 1rem;
		margin-left: 0;
		color: #6c757d;
		font-style: italic;
	}

	.post-content :global(ul),
	.post-content :global(ol) {
		margin-bottom: 1.25rem;
		padding-left: 1.5rem;
	}

	.post-content :global(li) {
		margin-bottom: 0.5rem;
	}

	.post-content :global(a) {
		color: #0d6efd;
		text-decoration: none;
	}

	.post-content :global(a:hover) {
		text-decoration: underline;
	}

	.post-content :global(img) {
		max-width: 100%;
		height: auto;
		border-radius: 8px;
	}

	.post-footer {
		margin-top: 3rem;
		padding-top: 2rem;
		border-top: 1px solid #dee2e6;
	}

	@media (max-width: 768px) {
		.post-header h1 {
			font-size: 1.75rem;
		}

		.post-content {
			font-size: 1rem;
		}
	}
</style>

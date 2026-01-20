<script lang="ts">
	import { Card, CardBody, Badge } from '@sveltestrap/sveltestrap';
	import type { BlogPost } from './blog.model';
	import { formatDate } from './blog.utils';

	interface Props {
		post: BlogPost;
	}

	let { post }: Props = $props();
</script>

<a href="/blog/{post.slug}" class="blog-card-link">
	<Card class="mb-3 blog-card">
		<CardBody>
			<div class="post-meta">
				<span class="date">{formatDate(post.date)}</span>
				<span class="reading-time">{post.readingTime}</span>
			</div>
			<h3 class="post-title">{post.title}</h3>
			<p class="post-excerpt">{post.excerpt}</p>
			<div class="badges">
				{#each post.categories as category}
					<Badge color="primary" class="me-1 mb-1">{category}</Badge>
				{/each}
				{#each post.tags as tag}
					<Badge color="secondary" class="me-1 mb-1">{tag}</Badge>
				{/each}
			</div>
		</CardBody>
	</Card>
</a>

<style>
	.blog-card-link {
		text-decoration: none;
		color: inherit;
		display: block;
	}

	:global(.blog-card) {
		border: 1px solid #eaeaea;
		border-radius: 8px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		transition:
			box-shadow 0.3s ease,
			transform 0.3s ease;
	}

	:global(.blog-card:hover) {
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
		transform: translateY(-2px);
	}

	.post-meta {
		display: flex;
		gap: 1rem;
		font-size: 0.85rem;
		color: #6c757d;
		margin-bottom: 0.5rem;
	}

	.reading-time {
		color: #888;
	}

	.post-title {
		font-size: 1.25rem;
		margin-bottom: 0.75rem;
		color: #333;
		font-weight: 600;
	}

	.post-excerpt {
		font-size: 0.95rem;
		line-height: 1.6;
		margin-bottom: 1rem;
		color: #555;
	}

	.badges {
		display: flex;
		flex-wrap: wrap;
		gap: 0.25rem;
	}
</style>

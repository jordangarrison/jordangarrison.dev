<script lang="ts">
	import { Row, Col, Nav, NavItem, NavLink, Input, Button } from '@sveltestrap/sveltestrap';
	import { goto } from '$app/navigation';
	import BlogCard from '$lib/blog/BlogCard.svelte';
	import type { BlogCategory } from '$lib/blog/blog.model';
	import {
		filterPostsByCategory,
		searchPosts,
		paginatePosts
	} from '$lib/blog/blog.utils';

	function capitalize(str: string): string {
		return str.charAt(0).toUpperCase() + str.slice(1);
	}

	let { data } = $props();

	let activeCategory = $state<BlogCategory | 'all'>(data.filters.category);
	let searchQuery = $state(data.filters.search);
	let currentPage = $state(data.filters.page);

	const filteredPosts = $derived(() => {
		let posts = filterPostsByCategory(data.posts, activeCategory);
		posts = searchPosts(posts, searchQuery);
		return posts;
	});

	const paginatedData = $derived(() => {
		return paginatePosts(filteredPosts(), currentPage, 6);
	});

	function updateUrl() {
		const params = new URLSearchParams();
		if (activeCategory !== 'all') {
			params.set('category', activeCategory);
		}
		if (searchQuery) {
			params.set('search', searchQuery);
		}
		if (currentPage > 1) {
			params.set('page', currentPage.toString());
		}
		const query = params.toString();
		goto(`/blog${query ? '?' + query : ''}`, { replaceState: true });
	}

	function handleCategoryChange(category: BlogCategory | 'all') {
		activeCategory = category;
		currentPage = 1;
		updateUrl();
	}

	function handleSearch() {
		currentPage = 1;
		updateUrl();
	}

	function handlePageChange(newPage: number) {
		currentPage = newPage;
		updateUrl();
	}
</script>

<svelte:head>
	<title>Blog - Jordan Garrison</title>
</svelte:head>

<div class="blog-container">
	<div class="title">
		<h1>Blog</h1>
		<p class="lead">Thoughts on engineering, Nix, DevOps, and more</p>
	</div>

	<div class="search-container">
		<Input
			type="text"
			placeholder="Search posts..."
			bind:value={searchQuery}
			onkeyup={(e: KeyboardEvent) => e.key === 'Enter' && handleSearch()}
		/>
		<Button color="primary" onclick={handleSearch}>Search</Button>
	</div>

	{#if data.categories.length > 0}
		<div class="filter-tabs">
			<Nav tabs>
				<NavItem>
					<NavLink
						active={activeCategory === 'all'}
						href="#"
						onclick={() => handleCategoryChange('all')}
					>
						All
					</NavLink>
				</NavItem>
				{#each data.categories as category}
					<NavItem>
						<NavLink
							active={activeCategory === category}
							href="#"
							onclick={() => handleCategoryChange(category)}
						>
							{capitalize(category)}
						</NavLink>
					</NavItem>
				{/each}
			</Nav>
		</div>
	{/if}

	<div class="posts">
		{#if paginatedData().posts.length === 0}
			<div class="no-posts">
				<p>No posts found matching your criteria.</p>
			</div>
		{:else}
			<Row>
				{#each paginatedData().posts as post}
					<Col md={6}>
						<BlogCard {post} />
					</Col>
				{/each}
			</Row>
		{/if}
	</div>

	{#if paginatedData().totalPages > 1}
		<div class="pagination">
			<Button
				color="secondary"
				outline
				disabled={currentPage === 1}
				onclick={() => handlePageChange(currentPage - 1)}
			>
				Previous
			</Button>
			<span class="page-info">
				Page {paginatedData().currentPage} of {paginatedData().totalPages}
			</span>
			<Button
				color="secondary"
				outline
				disabled={currentPage === paginatedData().totalPages}
				onclick={() => handlePageChange(currentPage + 1)}
			>
				Next
			</Button>
		</div>
	{/if}
</div>

<style>
	.blog-container {
		padding: 1rem;
		align-self: center;
		align-items: center;
		flex: 1;
		display: flex;
		flex-direction: column;
		width: 100%;
		max-width: 1024px;
		margin: 0 auto;
		box-sizing: border-box;
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

	.search-container {
		display: flex;
		gap: 0.5rem;
		width: 100%;
		max-width: 500px;
		margin-bottom: 1.5rem;
	}

	.filter-tabs {
		margin-bottom: 2rem;
	}

	.posts {
		width: 100%;
	}

	.no-posts {
		text-align: center;
		padding: 3rem;
		color: #6c757d;
	}

	.pagination {
		display: flex;
		align-items: center;
		gap: 1rem;
		margin-top: 2rem;
		margin-bottom: 2rem;
	}

	.page-info {
		color: #6c757d;
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

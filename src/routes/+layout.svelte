<script lang="ts">
	import {
		Styles,
		Navbar,
		NavbarBrand,
		Nav,
		NavLink,
		NavbarToggler,
		NavItem
		// Dropdown,
		// DropdownToggle,
		// DropdownMenu,
		// DropdownItem
	} from '@sveltestrap/sveltestrap';
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();

	let isOpen = $state(false);

	function toggleNavbar() {
		isOpen = !isOpen;
	}
</script>

<Styles />

<header>
	<Navbar color="light" light expand="md" sticky="top">
		<NavbarBrand href="/">jordangarrison.dev</NavbarBrand>
		<NavbarToggler on:click={toggleNavbar} />
		<div class="collapse navbar-collapse" class:show={isOpen}>
			<Nav class="ms-auto" navbar>
				<NavItem>
					<NavLink href="/blog">Blog</NavLink>
				</NavItem>
				<NavItem>
					<NavLink href="/portfolio">Portfolio</NavLink>
				</NavItem>
				<NavItem>
					<NavLink href="/about">About</NavLink>
				</NavItem>
				<NavItem>
					<NavLink href="/contact">Contact</NavLink>
				</NavItem>
				<NavItem>
					<NavLink
						download="jordan-garrison-resume.pdf"
						href="https://raw.githubusercontent.com/jordangarrison/resume/main/resume.pdf"
						>Resume</NavLink
					>
				</NavItem>
			</Nav>
		</div>
	</Navbar>
</header>
<main>
	{@render children?.()}
</main>

<footer>
	<p>
		<!-- Github link with github logo -->
		<a href="https://github.com/jordangarrison" target="_blank" rel="noreferrer noopener" aria-label="GitHub Profile"
			><i class="bi-github" role="img" aria-label="GitHub"></i></a
		>
		<a href="https://linkedin.com/in/jordan-garrison" target="_blank" rel="noreferrer noopener" aria-label="LinkedIn Profile"
			><i class="bi bi-linkedin" aria-label="LinkedIn"></i></a
		>
		<a href="mailto:hello@jordangarrison.dev" aria-label="Send Email"><i class="bi bi-envelope" aria-label="Email"></i></a>
	</p>
	<p>
		&copy; {new Date().getFullYear()} <a href="https://jordangarrison.dev">jordangarrison.dev</a>
	</p>
</footer>

<style>
	main {
		/* flex: 1; */
		/* display: flex; */
		/* flex-direction: column; */
		padding: 1rem;
		width: 100%;
		max-width: 1024px;
		margin: 0 auto;
		box-sizing: border-box;
	}

	header {
		justify-content: space-between;
		align-items: center;
		padding: 1rem;
		background: #fafafa;
		border-bottom: 1px solid #eaeaea;
	}

	footer {
		padding: 1rem;
		background: #fafafa;
		border-top: 1px solid #eaeaea;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	footer a {
		font-weight: bold;
	}

	footer a i {
		font-size: 2rem;
		padding: 1rem;
	}

	@media (min-width: 480px) {
		footer {
			padding: 40px;
		}
	}
</style>

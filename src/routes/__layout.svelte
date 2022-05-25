<script lang="ts">
	import {
		Styles,
		Navbar,
		NavbarBrand,
		Nav,
		NavLink,
		NavbarToggler,
		Collapse,
		NavItem,
		Dropdown,
		DropdownToggle,
		DropdownMenu,
		DropdownItem
	} from 'sveltestrap'

	let isOpen = false
	const handleUpdate = (event) => {
		isOpen = event.detail.isOpen
	}
</script>

<Styles />

<header>
	<Navbar color="light" light expand="md" sticky="top">
		<NavbarBrand href="/">jordangarrison.dev</NavbarBrand>
		<NavbarToggler on:click={() => (isOpen = !isOpen)} />
		<Collapse {isOpen} navbar expand="md" on:update={handleUpdate}>
			<Nav class="ms-auto" navbar>
				<!-- <NavItem>
					 <NavLink href="/blog">Blog</NavLink>
					 </NavItem> -->
				<!-- <NavItem>
					 <NavLink href="/about">About</NavLink>
					 </NavItem> -->
				<NavItem>
					<NavLink href="/contact">Contact</NavLink>
				</NavItem>
			</Nav>
		</Collapse>
	</Navbar>
</header>
<main>
	<slot />
</main>

<footer>
	<p>
		<!-- Github link with github logo -->
		<a href="https://github.com/jordangarrison" target="_blank" rel="noreferrer noopener"
			><i class="bi-github" role="img" aria-label="GitHub" /></a
		>
		<a href="https://linkedin.com/in/jordan-garrison" target="_blank" rel="noreferrer noopener"
			><i class="bi bi-linkedin" aria-label="LinkedIn" /></a
		>
		<a href="mailto:hello@jordangarrison.dev"><i class="bi bi-envelope" aria-label="Email" /></a>
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

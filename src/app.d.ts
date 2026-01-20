// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
declare namespace App {
	// interface Error {}
	// interface Locals {}
	// interface PageData {}
	// interface Platform {}
}

declare module '*.md' {
	import type { Component } from 'svelte';

	export const metadata: {
		title: string;
		date: string;
		excerpt: string;
		categories: string[];
		tags: string[];
		published: boolean;
	};

	const component: Component;
	export default component;
}

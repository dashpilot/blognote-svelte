# blognote-svelte

Rewrite of the BlogNote application using Svelte

# Todo

Categories.svelte still needs some work

# Things I've learned about Svelte

I initially wanted to use a Svelte store for two-way binding between components, but that didn't work well with nested data objects and #each loops (<https://github.com/sveltejs/svelte/issues/4495>). Using props with bind:data={data} works like a charm, and is simpler too.

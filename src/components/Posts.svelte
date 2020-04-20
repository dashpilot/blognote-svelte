<script>
  export let data;
  export let current;

  function setEntry(item) {
    current = item.id;
  }
</script>

<div class="col-md-4" id="posts">
  {#each data.entries as item }
  <div class="item" on:click={setEntry(item)} class:active="{current === item.id}"
  	on:click="{() => current = item.id}" data-category="{item.category}">
  {item.title}
  </div>
  {/each}
</div>

<div class="col-md-6" id="main">

{#each data.entries as item }
  {#if current==item.id}
  <input bind:value={item.title} class="form-control">

  <select class="form-control" bind:value={item.category}>
  {#each data.categories as cat}
  <option value="{cat.slug}">{cat.name}</option>
  {/each}
  </select>

  <textarea class="form-control">{item.body}</textarea>
  {/if}
{/each}


</div>

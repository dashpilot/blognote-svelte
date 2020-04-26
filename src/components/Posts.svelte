<script>
  import TextEditor from './TextEditor.svelte';

  export let data;
  export let current;

  function setEntry(item) {
    current = item.id;
  }
</script>


<div class="row no-gutters" id="maincols">

<div class="col-md-4" id="posts">
  {#each data.entries as item }
  <div class="item" on:click={setEntry(item)} class:active="{current === item.id}"
  	on:click="{() => current = item.id}" data-category="{item.category}">
  {item.title}
  </div>
  {/each}
</div>

<div class="col-md-8" id="main">

{#each data.entries as item }
  {#if current==item.id}
  <input bind:value={item.title} class="form-control">

  <TextEditor bind:item={item}/>

  <select class="form-control" bind:value={item.category}>
  {#each data.categories as cat}
  <option value="{cat.slug}">{cat.name}</option>
  {/each}
  </select>

  <!-- <textarea class="form-control">{item.body}</textarea>-->
  {/if}
{/each}


</div>

</div>

<style>

</style>

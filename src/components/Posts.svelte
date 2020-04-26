
<script>
  //import { onMount } from 'svelte';
  import TextEditor from './TextEditor.svelte';

  export let data;
  export let current;

  function setEntry(item) {
    current = item.id;
  }

/*
  onMount(async () => {
    console.log('onmount called');
  var easyMDE = new EasyMDE({
    element: document.getElementById('mde'),
    spellChecker: false
  });

  easyMDE.codemirror.on("change", function(){
    item.body = easyMDE.value();
    console.log(easyMDE.value);
  });
  });
  */

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

<!--
  <textarea class="form-control" id="mde" bind:value={item.body}></textarea>
  -->

  <select class="form-control" bind:value={item.category}>
  {#each data.categories as cat}
  <option value="{cat.slug}">{cat.name}</option>
  {/each}
  </select>


  {/if}
{/each}


</div>

</div>



<style>
#main{
padding: 20px;
}
#posts{
	border-right: 1px solid #DDD;
}
</style>


<script>

  //import TextEditor from './TextEditor.svelte';
  import Quill from './Quill.svelte';
  import ImageUpload from './ImageUpload.svelte';


  export let data;
  export let current;
  let catIndex = 0;

  function setEntry(item) {
    current = item.id;
    getCatIndex(item.category)
  }

  function addField(index){

    let newitem = [];
  	data.categories[index].fields.push(newitem);
    data.categories[index].fields = data.categories[index].fields;
  }

  function getCatIndex(category){
    catIndex = data.categories.findIndex(x => x.slug == category)
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

  <!-- <TextEditor bind:item={item} /> -->


  <Quill bind:item={item} bind:current={current} />

  <label>Cover Image</label>
    <ImageUpload bind:item={item} />
    <div class="clear"></div>

<label>Category</label>
  <select class="form-control" bind:value={item.category} on:change={getCatIndex(item.category)}>
  {#each data.categories as cat, i}
  <option value="{cat.slug}">{cat.name}</option>
  {/each}
  </select>


<label>Custom Fields</label>
  {#each data.categories[catIndex].fields as field, i}
  <div class="row" style="height: auto;">
  <div class="col-md-4">
  <input type="text" placeholder="name" class="form-control" bind:value={data.categories[catIndex].fields[i]}>
  </div>
  <div class="col-md-8">
  <input type="text" placeholder="value" class="form-control" bind:value={item.meta[i]}>
  </div>
  </div>
  {/each}
<button class="btn btn-outline-dark" on:click={addField(catIndex)}><i class="fa fa-plus-square-o"></i> &nbsp;Add Custom Field</button>

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

label{
  display: block;
  margin-top: 20px;
  margin-bottom: 5px;
  text-transform: uppercase;
  font-size: 14px;
letter-spacing: 0.03em;
}

.clear{
  clear: both;

}
</style>

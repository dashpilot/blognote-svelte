
<script>

  import PellEditor from './PellEditor.svelte';
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


  function deleteEntry(){

    var r = confirm("Are you sure you want to delete this note?");
    if (r == true) {
      let arr = data.entries.filter(x => x.id !== current)
      data.entries = arr;
    }

  }


</script>


<div class="row no-gutters" id="maincols">

<div class="col-md-3" id="posts">
  {#each data.entries as item }
  <div class="item" on:click={setEntry(item)} class:active="{current === item.id}"
  	on:click="{() => current = item.id}" data-category="{item.category}">
  {item.title}
  </div>
  {/each}
</div>

<div class="col-md-7" id="main">



{#each data.entries as item }
  {#if current==item.id}
  <input bind:value={item.title} class="form-control">

  <!-- <TextEditor bind:item={item} /> -->


  <PellEditor bind:item={item} bind:current={current} />




<label>Category</label>
  <select class="form-control" bind:value={item.category} on:change={getCatIndex(item.category)}>
  {#each data.categories as cat, i}
  <option value="{cat.slug}">{cat.name}</option>
  {/each}
  </select>

{#if data.categories[catIndex]}
  {#if data.categories[catIndex].fields.length > 0}
    {#each data.categories[catIndex].fields as field, i}

    <label>{field.name}</label>
    {#if field.type == 'input'}
    <input type="text" class="form-control" bind:value={item.meta[i]}>
    {/if}

    {#if field.type == 'textarea'}
    <textarea class="form-control" bind:value={item.meta[i]}></textarea>
    {/if}

    {/each}
  {/if}
{/if}



  {/if}
{/each}


</div>
<div class="col-md-2" id="attachments">

{#each data.entries as item }
  {#if current==item.id}

<ImageUpload bind:item={item} />


<button class="btn btn-outline-dark mt-3" id="delete" on:click={deleteEntry}><i class="fa fa-trash"></i> delete note</button>

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

#attachments{
  padding: 20px;
  border-left: 1px solid #DDD;
  background-color: #F4F5F8;
}

#delete{
  position: fixed;
  bottom: 20px;
  right: 3%;
  border: none;
}

</style>

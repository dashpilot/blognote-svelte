<script>

export let data;
let addcat = false;

function setCategory(mycat){

  document.querySelectorAll('.item').forEach(function(el) {
     el.style.display = 'none';
  });

  document.querySelectorAll('[data-category='+mycat+']').forEach(function(el) {
     el.style.display = 'block';
  });

setActiveCat(mycat)

}

function setActiveCat(mycat){
  document.querySelectorAll('.cat').forEach(function(el) {
     el.classList.remove('active-cat')
  });

  document.querySelector('#cat-'+mycat).classList.add('active-cat');
}

function showAllEntries() {
  document.querySelectorAll('.item').forEach(function(el) {
    el.style.display = 'block';
  });

  setActiveCat('all')
}

function showAddCat(){
  addcat = true;
}

function addCategory(){

  let category = document.getElementById('add-category').value;

  if(category.length > 4){

  let newitem = {name:category, slug: slugify(category)};
  data.categories.push(newitem);

  data.categories = data.categories; // reassign, else it won't update

  // this fixes the fact that addcat doesn't get updated
  setTimeout(() => {
        addcat = false;
      });

  }else{
    alert('Category name should be at least 5 characters long');
  }

}

function slugify(string) {
  const a = 'àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìłḿñńǹňôöòóœøōõőṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·/_,:;'
  const b = 'aaaaaaaaaacccddeeeeeeeegghiiiiiilmnnnnoooooooooprrsssssttuuuuuuuuuwxyyzzz------'
  const p = new RegExp(a.split('').join('|'), 'g')

  return string.toString().toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(p, c => b.charAt(a.indexOf(c))) // Replace special characters
    .replace(/&/g, '-and-') // Replace & with 'and'
    .replace(/[^\w\-]+/g, '') // Remove all non-word characters
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, '') // Trim - from end of text
}

</script>

<nav>


<div class="add-cat">
{#if !addcat}
<h6>Categories</h6>
<button class="btn btn-outline-light nobrdr" on:click={showAddCat}><i class="fa fa-plus"></i></button>
{:else}
<div class="input-group mb-3">
  <input type="text" class="form-control" placeholder="Category Name" id="add-category">
  <div class="input-group-append">
    <button class="btn btn-outline-light" type="button" id="button-addon" on:click={addCategory}>Add</button>
  </div>
</div>
{/if}
</div>

</nav>


<div class="content">

<div class="cat active-cat" id="cat-all" on:click={showAllEntries}>All</div>

{#each data.categories as cat}
  <div class="cat" id="cat-{cat.slug}" href="#" on:click={setCategory(cat.slug)}>{cat.name}</div>
{/each}

</div>

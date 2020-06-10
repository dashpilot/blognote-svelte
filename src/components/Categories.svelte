<script>
  import AddCustomFields from "./AddCustomFields.svelte";

  export let data;
  let addcat = false;

  function setCategory(mycat) {
    document.querySelectorAll(".item").forEach(function(el) {
      el.style.display = "none";
    });

    document
      .querySelectorAll("[data-category=" + mycat + "]")
      .forEach(function(el) {
        el.style.display = "block";
      });

    setActiveCat(mycat);
  }

  function setActiveCat(mycat) {
    document.querySelectorAll(".cat").forEach(function(el) {
      el.classList.remove("active-cat");
    });

    document.querySelector("#cat-" + mycat).classList.add("active-cat");
  }

  function showAllEntries() {
    document.querySelectorAll(".item").forEach(function(el) {
      el.style.display = "block";
    });

    setActiveCat("all");
  }

  function showAddCat() {
    addcat = true;
  }

  function hideAddCat() {
    addcat = false;
  }

  function addCategory() {
    let category = document.getElementById("add-category").value;

    if (category.length > 4) {
      var form = document.querySelector("#custom-fields");
      var formData = serialize(form);
      //console.log(formData);

      let newitem = {
        name: category,
        slug: slugify(category),
        fields: formData
      };
      data.categories.push(newitem);

      data.categories = data.categories; // reassign, else it won't update

      console.log(data.categories);

      // this fixes the fact that addcat doesn't get updated
      setTimeout(() => {
        addcat = false;
      });
    } else {
      alert("Category name should be at least 5 characters long");
    }
  }

  function slugify(string) {
    const a =
      "àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìłḿñńǹňôöòóœøōõőṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·/_,:;";
    const b =
      "aaaaaaaaaacccddeeeeeeeegghiiiiiilmnnnnoooooooooprrsssssttuuuuuuuuuwxyyzzz------";
    const p = new RegExp(a.split("").join("|"), "g");

    return string
      .toString()
      .toLowerCase()
      .replace(/\s+/g, "-") // Replace spaces with -
      .replace(p, c => b.charAt(a.indexOf(c))) // Replace special characters
      .replace(/&/g, "-and-") // Replace & with 'and'
      .replace(/[^\w\-]+/g, "") // Remove all non-word characters
      .replace(/\-\-+/g, "-") // Replace multiple - with single -
      .replace(/^-+/, "") // Trim - from start of text
      .replace(/-+$/, ""); // Trim - from end of text
  }

  var serialize = function(form) {
    // Setup our serialized data
    var serialized = [];

    // Loop through each field in the form
    var i2 = 0;
    for (var i = 0; i < form.elements.length; i++) {
      var field = form.elements[i];

      if (field.name == "name") {
        serialized[i2] = {};

        serialized[i2].name = field.value;
      }
      if (field.name == "type") {
        serialized[i2].type = field.value;

        i2++;
      }
    }

    return serialized;
  };
</script>

<style>
  h5 {
    color: black;
  }
  .modal {
    margin-top: 4%;
  }
</style>

<nav>

  <div class="add-cat">

    <h6>Categories</h6>
    <button class="btn btn-outline-light nobrdr" on:click={showAddCat}>
      <i class="fa fa-plus" />
    </button>

  </div>

  {#if addcat}
    <div class="backdrop">
      <div class="modal" tabindex="-1" role="dialog" style="display: block;">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Add Category</h5>
              <button
                type="button"
                class="close"
                data-dismiss="modal"
                aria-label="Close">
                <span aria-hidden="true" on:click={hideAddCat}>&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <input
                type="text"
                class="form-control"
                placeholder="Category Name"
                id="add-category" />

              <AddCustomFields bind:categories={data.categories} />

              <!--
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
          -->

            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-primary"
                on:click={addCategory}>
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  {/if}

</nav>

<div class="content">

  <div class="cat active-cat" id="cat-all" on:click={showAllEntries}>All</div>

  {#each data.categories as cat}
    <div
      class="cat"
      id="cat-{cat.slug}"
      href="#"
      on:click={setCategory(cat.slug)}>
      {cat.name}
    </div>
  {/each}

</div>

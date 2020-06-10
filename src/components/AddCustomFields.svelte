<script>
  let items = [];

  function addField() {
    items.push({ name: "", type: "" });
    items = items;
  }
</script>

<form id="custom-fields">
  {#if items.length > 0}
    {#each items as { name, type }, i}
      <div class="row">
        <div class="col-md-6">
          <input
            type="text"
            name="name"
            class="form-control"
            placeholder="name"
            bind:value={name} />
        </div>
        <div class="col-md-6">
          <select name="type" class="form-control" bind:value={type}>
            <option value="input">input</option>
            <option value="textarea">textarea</option>
          </select>
        </div>
      </div>
    {/each}
  {/if}
</form>

<button class="btn btn-outline-dark" on:click={addField}>
  <i class="fa fa-plus-square-o" />
  &nbsp;Add Custom Field
</button>

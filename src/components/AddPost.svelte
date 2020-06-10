<script>
  export let data;
  export let current;

  function addEntry() {
    let newitem = { id: makeid(6), title: "Untitled", body: "" };
    data.entries.unshift(newitem);

    data.entries = data.entries; // reassign, else it won't update
    current = data.entries[0].id; // set the currently selected item
  }

  function makeid(length) {
    var result = "";
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
</script>

<button class="btn btn-outline-dark nobrdr" on:click={addEntry}>
  <i class="fa fa-plus" />
</button>

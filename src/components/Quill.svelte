<script>
  import { onMount } from "svelte";
  import Quill from "quill";

  let editor;
  export let item;
  export let current;

  let loaded = false;


	export let toolbarOptions = [
    ["bold", "italic", "underline", "link", { list: "bullet" }],
		// ["image"],
	];

  onMount(async () => {


  //window.setTimeout(function(){

      let quill = new Quill(editor, {
        modules: {
          toolbar: toolbarOptions
        },
        theme: "snow",
        placeholder: "Write your story..."
      });

      loaded = true;

  //}, 1000)

  });

  // manually make it reactive
  function updateValue(item){
    item.body = document.getElementById('editor').innerHTML;
  }
</script>


<!--
{#if !loaded}
<img src="/assets/img/spinner.gif" alt="loading" style="width: 25%;" />
{/if}
-->


<div class="editor-wrapper mb-3">
<div bind:this={editor} on:keyup={updateValue(item)} id="editor">{@html item.body}</div>
</div>

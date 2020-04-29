<script>
   // import the core component
  import ProsemirrorEditor from 'prosemirror-svelte';

  // import helpers to work with prosemirror state
  import { createRichTextEditor, toHTML, clear, toggleMark, replaceTextAtPosition, setBlockType } from 'prosemirror-svelte/state';
  import { getCurrentMarks, getNodeTypeAtSelectionHead } from "prosemirror-svelte/helpers";

  export let item;

  // create the initial editor state
  let editorState = createRichTextEditor(item.body);

  function preventDefault(event) {
   event.preventDefault();
 }

 function handleTransaction(event) {
  editorState = event.detail.editorState;
}

  function toggleBold(event) {
    editorState = toggleMark(editorState, 'strong');
    item.body = toHTML(editorState);
  }

  function toggleItalic(event) {
    editorState = toggleMark(editorState, 'em');
    item.body = toHTML(editorState);
  }

function insertLink(event) {
  console.log(editorState);
editorState = replaceTextAtPosition(editorState, editorState.selection.$anchor.pos, editorState.selection.$head.pos, '<a href="https://nu.nl">Nu</a>');
item.body = toHTML(editorState);
}


  function handleChange(event) {
    // get the new editor state from event.detail
    editorState = event.detail.editorState;
    item.body = toHTML(editorState);
  }






</script>

<div class="btn-group">
<button on:click={toggleBold} on:mousedown={preventDefault} class="btn btn-outline-dark btn-editor"><b>B</b></button>
<button on:click={toggleItalic} on:mousedown={preventDefault} class="btn btn-outline-dark btn-editor"><em>I</em></button>
<button on:click={insertLink} on:mousedown={preventDefault} class="btn btn-outline-dark btn-editor">Link</button>
</div>

<ProsemirrorEditor
  placeholder="Go ahead and type something"
  {editorState}
  on:transaction={handleTransaction}
  on:change={handleChange}
/>



<style>
.btn-group .btn{
  width: 45px;
  border-bottom: 0;
}
.btn-group .btn:first-child{
  border-bottom-left-radius: 0;
}
.btn-group .btn:last-child{
  border-bottom-right-radius: 0;
}


</style>

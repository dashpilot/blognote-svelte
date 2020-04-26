<script>


</script>

<ProsemirrorEditor
  placeholder="Go ahead and type something"
  {editorState}
  on:transaction={handleTransaction}
  on:change={handleChange}
/>

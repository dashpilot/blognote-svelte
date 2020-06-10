<script>
  import { onMount } from "svelte";
  import pell from "pell";

  export let item;

  onMount(async () => {
    const editor = pell.init({
      element: document.getElementById("editor"),
      onChange: html => {
        //document.getElementById("html-output").textContent = html;
        item.body = html;
      },
      defaultParagraphSeparator: "p",
      styleWithCSS: false,
      actions: [
        "bold",
        "underline",
        {
          name: "italic",
          result: () => pell.exec("italic")
        },
        {
          name: "image",
          icon: "<i class='fa fa-image'></i>",
          result: () => {
            const url = window.prompt("Enter the image URL");
            if (url) pell.exec("insertImage", url);
          }
        },
        {
          name: "link",
          icon: "<i class='fa fa-link'></i>",
          result: () => {
            const url = window.prompt("Enter the link URL");
            if (url) pell.exec("createLink", url);
          }
        }
      ]
    });

    editor.content.innerHTML = item.body;
  });
</script>

<div id="editor" class="pell" />

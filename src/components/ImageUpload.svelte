<script>
import { onMount } from "svelte";
import Compress from 'client-compress';

export let item;

// Firebase Storage
var storage = firebase.storage();
var storageRef = storage.ref();

onMount(async () => {




const options = {
  targetSize: 0.5,
  quality: 0.9,
  maxWidth: 800,
  maxHeight: 600
}

const compress = new Compress(options)
const upload = document.getElementById("upload")

upload.addEventListener(
  "change",
  (evt) => {
    const files = [...evt.target.files]
    compress.compress(files).then((conversions) => {
      // Conversions is an array of objects like { photo, info }.
      // 'photo' has the photo data while 'info' contains metadata
      // about that particular image compression (e.g. time taken).

      const { photo, info } = conversions[0]

      console.log({ photo, info })

      // Create an object URL which points to the photo Blob data
      const objectUrl = URL.createObjectURL(photo.data)


        // Upload to Firebase
        let userid = localStorage.getItem('userid');
        let imgName = 'users/'+userid+'/'+item.id+'.jpg';
        var imageRef = storageRef.child(imgName);
        imageRef.put(photo.data).then(function(snapshot) {
          console.log('Uploaded a blob or file!');
          storageRef.child(imgName).getDownloadURL().then(function(url) {

            item.image = url;


          });

        }).catch(function(error) {
          // Handle any errors
          console.log('Error: '+error);
        });

        // Revoke the object URL to free up memory
        URL.revokeObjectURL(objectUrl)

    })
  },
  false
)

});

function handleClick(){
  upload.click();
}

</script>


<div id="uploader">
<button class="btn btn-outline-dark" on:click={handleClick}><i class="fa fa-cloud-upload"></i> Select Image</button>

<input type="file" id="upload" name="myfile">
</div>

{#if item.image}<img src="{item.image}" id="preview" />{/if}

<style>
#upload{
  display: none;
}

#uploader{
  margin-bottom: 10px;
}

#preview{
  max-width: 25%;
}
</style>

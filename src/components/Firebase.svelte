<script>
  export let data;
  let spinner = true;
  let loggedin = false;

  var firebaseConfig = {
    apiKey: "AIzaSyBJQ3SttWZrZ7K7qKdwln7J57OjzXJ9CUc",
    authDomain: "blognote-ffbbb.firebaseapp.com",
    databaseURL: "https://blognote-ffbbb.firebaseio.com",
    projectId: "blognote-ffbbb",
    storageBucket: "blognote-ffbbb.appspot.com",
    messagingSenderId: "803950215522",
    appId: "1:803950215522:web:e7690ead619f6c7f84ac3b"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);


  var provider = new firebase.auth.GoogleAuthProvider();
  //provider.addScope('repo');
  var db = firebase.firestore();


  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
      loggedin = true;

      console.log(user.uid);

      console.log("User is signed in");

      /*
      docRef = db.collection("users").doc(user.uid);

      docRef.get().then(function(doc) {
        if (doc.exists) {
          let site = doc.data();
          console.log(site);
          $('#site-name').text(site.site_title);
        } else {
          console.log('site data not found');

          let data = {
            name: user.displayName,
            user: user.email
          };

          let setDoc = db.collection('users').doc(user.uid).set(data);

        }



      }).catch(function(error) {
        console.log("Error getting document:", error);


        let data = {
          name: user.displayName,
          user: user.email
        };

        let setDoc = db.collection('users').doc(user.uid).set(data);
        *


      });

      */

      //loadRemote(user.uid);

    } else {
      // No user is signed in.

      console.log("User not logged in");

    }
  });


  function login(){
      firebase.auth().signInWithRedirect(provider);
  }

  firebase.auth().getRedirectResult().then(function(result) {

    spinner = false;

    if (result.credential) {
      // This gives you a GitHub Access Token. You can use it to access the GitHub API.
      var token = result.credential.accessToken;

      /*
      let opts = {};
      opts.token = token;

      fetch('api/repos', {
        method: 'post',
        body: JSON.stringify(opts)
      }).then(function(response) {
        return response.json();
      }).then(function(data) {


        let repos = '';

        for (const item of data.result.data) {
          console.log(item.name);
          repos += `<option value="${item.name}">${item.name}</option>`;
        }


        $('#repos').html(repos);

        $('#publish').show();

        $('footer').hide();



      });

        */


    }
    // The signed-in user info.
    let user = result.user;

    console.log(user);
    localStorage.setItem('username', user.displayName);


    //  $('footer').html('<b>Choose a repo:</b>');

  }).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;

    console.log(errorMessage);
    // ...
  });


</script>

{#if !loggedin}
<div class="backdrop">
<div class="modal" style="display: block;">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Sign in with your Google Account</h5>
      </div>
      <div class="modal-body text-center">
      {#if spinner}
      <img src="/assets/img/spinner.gif" alt="loading" style="width: 25%;" />
      {:else}
      Sign in with your Google Account
      {/if}
      </div>
      <div class="modal-footer">
        <button class="btn btn-outline-dark" on:click="{login}">Sign in with your Google</button>
      </div>
    </div>
  </div>
</div>
</div>
{/if}

<style>
.backdrop{
position: fixed;
top: 0;
left: 0;
width: 100%;
height: 100%;
background: rgba(0,0,0,0.5);
z-index: 999;
}
</style>

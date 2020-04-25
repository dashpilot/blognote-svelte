<script>
import { fly } from 'svelte/transition';

  export let data;
  export let current;

  let spinner = true;
  let loggedin = false;
  let saving = false;

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
  var db = firebase.firestore();

  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
      loggedin = true;

      console.log(user.uid);
      console.log("User is signed in");

      // important! here we update the app data
      let docRef = db.collection('users').doc(user.uid);
      let getDoc = docRef.get()
      .then(doc => {
        if (!doc.exists) {
          console.log('No such document!');
        } else {
          console.log('Document data:', doc.data());

          // important! here we update the app data
          data = doc.data();

          current = data.entries[0].id;

        }
      })
      .catch(err => {
        console.log('Error getting document', err);
      });


    } else {

      console.log("User not logged in");

    }
  });


  function login(){
      firebase.auth().signInWithRedirect(provider);
  }

  function logout(){
    firebase.auth().signOut().then(function() {
    loggedin = false;
    }).catch(function(error) {
      // An error happened.
    });
  }


  firebase.auth().getRedirectResult().then(function(result) {



    if (result.credential) {
      // This gives you a GitHub Access Token. You can use it to access the GitHub API.
      var token = result.credential.accessToken;

    }
    // The signed-in user info.
    let user = result.user;

    console.log(user);
    localStorage.setItem('username', user.displayName);


spinner = false;

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

  });


  function save(){

    saving = true;

    let user = firebase.auth().currentUser;

    let setDoc = db.collection('users').doc(user.uid).set(data);

    setTimeout(function(){
      saving = false;
    }, 2000);

  }


</script>

{#if !loggedin}

<div class="loading-screen" out:fly={{ x:-400, duration: 1000 }}>
<div class="login-screen" style="display: block;">
<img src="/assets/img/logo.png" id="logo" />
<div>
{#if spinner}
<img src="/assets/img/spinner.gif" alt="loading" style="width: 25%;" />
{:else}

<button class="btn btn-outline-dark btn-bold" on:click="{login}"><i class="fa fa-google"></i> &nbsp;Sign in with Google</button>

{/if}
</div>



</div>
</div>
{:else}

<button class="btn btn-outline-dark" on:click={save}>{#if saving}<i class="fa fa-spinner fa-spin"></i> &nbsp;{:else}<i class="fa fa-save"></i> &nbsp;{/if}Save</button>

<button class="btn btn-outline-dark" on:click={logout}>Log Out</button>

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

.loading-screen{
position: fixed;
top: 0;
left: 0;
width: 100%;
height: 100%;
background: white;
z-index: 999;
}

.login-screen{
  width: 600px;
  margin: 0 auto;
  margin-top: 50px;
text-align: center;
}

#logo{
  width: 300px;
}

.btn-bold{
  border: 4px solid black;
  padding: 15px;
  border-radius: 15px;
}

</style>

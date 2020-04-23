/*

firebase
  .auth()
  .getRedirectResult()
  .then(function(result) {

    // The signed-in user info.
    var user = result.user;
    //console.log(result);

    if (result.credential) {
      // This gives you a Google Access Token. You can use it to access the Google API.
      var token = result.credential.accessToken;

      $("#logout").show();
      $("#logged_in").show();
    }

  })
  .catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;
    // ...
  });

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    $("#login").hide();
    $("#logout").show();
    $("#publish").show();
    $("#publish_s3").show();
    $("#logged_in").show();

    console.log(user.uid);

    console.log("Auth state changed");
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


    });

    loadRemote(user.uid);

  } else {
    // No user is signed in.
    $("#login").show();
    $("#logged_in").hide();

    loadLocal();
  }
});

*/

$(document).ready(function() {

  if (localStorage.getItem("username") === null) {

  } else {
    let username = localStorage.getItem("username");
    //  $('footer').html('Logged in as: ' + username);
    console.log(localStorage.getItem("token"));
  }

});

$("#login").on("click", function() {

  let data = {};
  data.title = $('#title').val();
  data.body = $('#body').val();

  localStorage.setItem('data', JSON.stringify(data));

  firebase.auth().signInWithRedirect(provider);



});

firebase.auth().getRedirectResult().then(function(result) {
  if (result.credential) {
    // This gives you a GitHub Access Token. You can use it to access the GitHub API.
    var token = result.credential.accessToken;

    //console.log(token);
    localStorage.setItem('token', token);


    let data = JSON.parse(localStorage.getItem('data'));

    console.log(data);

    $('#title').val(data.title);
    $('#body').val(data.body);

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


  }
  // The signed-in user info.
  var user = result.user;

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

$('#save').on('click', function() {

  let token = localStorage.getItem('token');

  let opts = {};
  opts.title = 'test';
  opts.token = token;


  fetch('api/save', {
    method: 'post',
    body: JSON.stringify(opts)
  }).then(function(response) {
    return response.json();
  }).then(function(data) {

  });

});

$("#logout").on("click", function() {
  firebase
    .auth()
    .signOut()
    .then(
      function() {
        // Sign-out successful.
        $("#logout").hide();
        $("#publish").hide();
        $("#publish_s3").hide();
        $("#login").show();

        loadLocal();

      },
      function(error) {
        // An error happened.
      }
    );
});
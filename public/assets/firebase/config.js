var firebaseConfig = {
  apiKey: "AIzaSyCEGqKRTYM6nV43ERaqPuyfeP78rWYrLv0",
  authDomain: "github-auth-d7ca4.firebaseapp.com",
  databaseURL: "https://github-auth-d7ca4.firebaseio.com",
  projectId: "github-auth-d7ca4",
  storageBucket: "github-auth-d7ca4.appspot.com",
  messagingSenderId: "881243932931",
  appId: "1:881243932931:web:f1fa46f91a4b4359990136"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var provider = new firebase.auth.GithubAuthProvider();
provider.addScope('repo');
var db = firebase.firestore();
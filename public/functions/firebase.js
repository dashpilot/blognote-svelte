const admin = require('firebase-admin');

// stored credentials file as base_64 encoded environment variable
// below, let's decode it and JSON.parse it
let creds = new Buffer(process.env.FIREBASE_64, 'base64').toString('binary');
const serviceAccount = JSON.parse(creds);

// Initialise the admin with the credentials
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://siteblocs.firebaseio.com'
})

const db = admin.firestore()


// exports.handler is required by netlify to process.
exports.handler = async (event, context, callback) => {
  // wait for the record to be added
  /*
  await db.collection('pages').add({
    name: 'Test Netlify'
  })
  */


  var docRef = db
    .collection("sites")
    .doc("testsite")
    .collection("pages")
    .doc("index");

  const userDoc = await docRef.get();
  const data = userDoc.data();



  // Return a callback witha 200 response and a message.
  return callback(null, {
    statusCode: 200,
    body: JSON.stringify({
      data: data
    })
  })


}
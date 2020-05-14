const admin = require('firebase-admin');
const dateTime = require('node-datetime');

// stored credentials file as base_64 encoded environment variable
// below, let's decode it and JSON.parse it
let creds = new Buffer.from(process.env.FIRE_BASE64, 'base64').toString('binary');
const serviceAccount = JSON.parse(creds);

// Initialise the admin with the credentials
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://blognote-ffbbb.firebaseio.com"
})

const db = admin.firestore()



module.exports = async (req, res) => {

  let data = req.body;
  var dt = dateTime.create();
  var now = dt.format('YmdHMS');
  let setDoc = db.collection('webhooks').doc(now).set(data);

  var userRef = db.collection('users').doc('cmyc5cGHi9gcE7s7fD4nbaciv4u2');

  var setWithMerge = userRef.set({
    pro: now
  }, {
    merge: true
  });


}
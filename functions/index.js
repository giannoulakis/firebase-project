const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//     // var db = firebase.database();
//     // console.log(db);

//     // db.collection("users").add();
//     const aux = {
//         name: "Cachorro",
//         country: "Tailandia",
//         status: "Comido"
//     };
    
    
//     // response.send("saved!");
// });

exports.saveNewUser = functions.auth.user().onCreate((user) => {
      var userObject = {
        name : user.displayName,
        email : user.email,
     };
    return admin.firestore().collection('users').add(userObject);
});
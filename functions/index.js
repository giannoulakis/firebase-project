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
    uid : user.uid,
  };
  return admin.firestore().collection('users').doc(user.uid).set(userObject);
});


exports.updateTaskTime = functions.firestore.document('projects/{projectId}/tasks/{taskId}/times/{timeId}').onWrite((change, context) => {
  let totalTime = 0;
  return admin.firestore().collection(`projects/${context.params.projectId}/tasks/${context.params.taskId}/times`).get().then(querySnapshot => {
    querySnapshot.forEach(doc => {
      let time = doc.data();
      if(time.dateEnd){
        var duration = new Date(time.dateEnd).getTime() - new Date(time.dateStart).getTime();
        totalTime += duration/1000;
      }
    });
    var taskObject = {
      totalTime : totalTime,
    };
    return admin.firestore().doc(`projects/${context.params.projectId}/tasks/${context.params.taskId}`).update(taskObject)
  }).catch((error) => {
    console.log(error);
  });
});
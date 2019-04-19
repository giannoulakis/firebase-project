import firebase from 'firebase';
// export default () => {
/*
    var config = {
        apiKey: "AIzaSyDzZ-WaQB7_HA0v8-CaMG8MY8jAt0n6y8g",
        authDomain: "tarefas-7b792.firebaseapp.com",
        databaseURL: "https://tarefas-7b792.firebaseio.com",
        projectId: "tarefas-7b792",
        storageBucket: "tarefas-7b792.appspot.com",
        messagingSenderId: "552921074809"
    };
    return  firebase.initializeApp(config);
// }
*/

var config = {
  apiKey: "AIzaSyDzZ-WaQB7_HA0v8-CaMG8MY8jAt0n6y8g",
  authDomain: "tarefas-7b792.firebaseapp.com",
  databaseURL: "https://tarefas-7b792.firebaseio.com",
  projectId: "tarefas-7b792",
  storageBucket: "tarefas-7b792.appspot.com",
  messagingSenderId: "552921074809"
};

export default firebase.initializeApp(config);
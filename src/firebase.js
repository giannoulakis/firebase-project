/* eslint-disable no-console */
import firebase from 'firebase';
import store from '@/store';

var config = {
  apiKey: "AIzaSyDzZ-WaQB7_HA0v8-CaMG8MY8jAt0n6y8g",
  authDomain: "tarefas-7b792.firebaseapp.com",
  databaseURL: "https://tarefas-7b792.firebaseio.com",
  projectId: "tarefas-7b792",
  storageBucket: "tarefas-7b792.appspot.com",
  messagingSenderId: "552921074809"
};
const appFirebase = firebase.initializeApp(config);

firebase.auth().onAuthStateChanged((user) => {
  store.dispatch('setLogin', {user:user});
});


// export { appFirebase as default, firebase };
export default appFirebase;
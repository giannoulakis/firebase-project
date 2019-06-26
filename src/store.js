/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
import Vue from 'vue'
import Vuex from 'vuex'
import firebase from '@/firebase'
import router from '@/router'


Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: null,
    isAuthenticated: false,
    intendedUrl:'/',
    isLoading: true,
    users: [],
    runningTimer: {},
  },
  mutations: {
    setUser(state, payload) {
      state.user = payload;
    },
    setIsAuthenticated(state, payload) {
      state.isAuthenticated = payload;
    },
    setIntendedUrl(state, payload) {
      state.intendedUrl = payload;
    },
    setUsersCache(state, users) {
      state.users = users
    },
    setIsLoading(state, payload) {
      state.isLoading = payload;
    },
    setRunningTimer(state, payload) {
      state.runningTimer = payload;
    }
  },
  actions: {
    userLogin({commit},{ email, password }) {
      firebase.auth().signInWithEmailAndPassword(email, password);
    },
    userSignOut({commit}) {
      firebase.auth().signOut();
    },
    setIntendedUrl({commit},{url}){
      commit('setIntendedUrl',url)
    },
    setLogin({ commit }, {user}) {
      commit('setIsLoading',false)
      if(user){
        commit('setUser', user);
        commit('setIsAuthenticated', true);
        this.dispatch('getUsers');
        this.dispatch('getRunningTime');
        router.push({path:this.state.intendedUrl});
      } else {
        commit('setUser', null);
        commit('setIsAuthenticated', false);
        router.push({name:'login'});
      }
    },
    setUsersCache({commit}, {users}) {
      commit('setUsersCache', users);
    },
    stopRunningTimer({commit} ) {
      const db = firebase.firestore();
      const timeRef = db.collection('projects').doc(this.state.runningTimer.projectId).collection('tasks').doc(this.state.runningTimer.taskId).collection('times').doc(this.state.runningTimer.timerId);

      timeRef.update({dateEnd:helpers.getCurrentDateTime()}).then(() => {
        console.log("SAVE");
      }).catch(function(error) {
        console.error("Error adding document: ", error);
      });
      commit('setRunningTimer', {});
    },
    getUsers({commit}){
      const db = firebase.firestore();
      const usersRef = db.collection('users').onSnapshot(querySnapshot => {
        let users = [];
        querySnapshot.forEach(doc => {
          users.push({ id:doc.id, ...doc.data() });
        });
        commit('setUsersCache', users);
      });
    },
    getRunningTime({commit}) {
      const db = firebase.firestore();
      const timesRef = db.collectionGroup('times');
      let query = timesRef.where('dateEnd','==','').where('member','==',this.getters.userId)
      query.onSnapshot(querySnapshot => {
        querySnapshot.forEach(register => {
          var timer = register.data();
          timer.id = register.id;

          let taskRef = register.ref.parent.parent;
          let projectRef = taskRef.parent.parent;

          taskRef.get().then((register) => {
            let task = register.data();

            let data = {
              projectId: projectRef.id,
              taskId: taskRef.id,
              timerId: timer.id,
              name: task.name,
              dateStart: timer.dateStart
            }
            commit('setRunningTimer',data);
          });

        });
      });
    }

  },
  getters:{
    userId: state => {
      if(!state.isAuthenticated){
        return null;
      }
      return state.user.uid
    },
    getUsersById: state => (ids) => {
      return state.users.filter(user => ids.indexOf(user.id) >= 0);
    },
  }
})

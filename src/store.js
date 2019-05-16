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
    setIsLoading(state, payload) {
      state.isLoading = payload;
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
        router.push({path:this.state.intendedUrl});
      } else {
        commit('setUser', null);
        commit('setIsAuthenticated', false);
        router.push({name:'login'});
      }
    }
  },
  getters:{
    userId: state => {
      if(!state.isAuthenticated){
        return null;
      }
      return state.user.uid
    }
  }
})
